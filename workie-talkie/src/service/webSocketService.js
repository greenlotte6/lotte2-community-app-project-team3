// services/webSocketService.js - WebSocket 연결 및 메시지 처리

import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.currentRoomId = null;
    this.messageHandlers = new Set();
  }

  // WebSocket 연결 - JWT 토큰 포함
  connect() {
    return new Promise((resolve, reject) => {
      try {
        console.log("🔄 WebSocket 연결 시도...");

        // JWT 토큰 가져오기
        const token = this.getAuthToken();
        console.log("🔑 JWT 토큰:", token ? "존재" : "없음");

        // SockJS를 통한 WebSocket 연결
        const socket = new SockJS("http://localhost:8080/ws");
        this.stompClient = Stomp.over(() => socket);

        // 디버그 로그 활성화
        this.stompClient.debug = (str) => {
          console.log("STOMP: " + str);
        };

        // 🔥 JWT 토큰을 헤더에 포함
        const headers = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
          console.log("🔑 Authorization 헤더 설정됨");
        } else {
          console.warn("⚠️ JWT 토큰이 없어서 인증 없이 연결 시도");
        }

        // 연결 시도
        this.stompClient.connect(
          headers, // 🔥 JWT 토큰이 포함된 헤더
          (frame) => {
            console.log("✅ WebSocket 연결 성공:", frame);
            this.connected = true;
            resolve(frame);
          },
          (error) => {
            console.error("❌ WebSocket 연결 실패:", error);
            this.connected = false;
            reject(error);
          }
        );
      } catch (error) {
        console.error("❌ WebSocket 초기화 실패:", error);
        reject(error);
      }
    });
  }

  // 🔥 JWT 토큰 가져오기 메서드 추가
  getAuthToken() {
    // 1. localStorage에서 토큰 확인
    let token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("jwtToken");

    if (token) {
      console.log("📦 localStorage에서 토큰 찾음");
      return token;
    }

    // 2. sessionStorage에서 토큰 확인
    token =
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("authToken") ||
      sessionStorage.getItem("jwtToken");

    if (token) {
      console.log("📦 sessionStorage에서 토큰 찾음");
      return token;
    }

    // 3. 쿠키에서 토큰 확인
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "token" || name === "authToken" || name === "jwtToken") {
        console.log("🍪 쿠키에서 토큰 찾음");
        return value;
      }
    }

    console.warn("⚠️ 토큰을 찾을 수 없음");
    return null;
  }

  // WebSocket 연결 해제
  disconnect() {
    if (this.stompClient && this.connected) {
      this.stompClient.disconnect(() => {
        console.log("🔌 WebSocket 연결 해제");
        this.connected = false;
        this.currentRoomId = null;
      });
    }
  }

  // 🔥 디버깅 메서드 추가
  testConnection() {
    console.log("=== WebSocket 연결 상태 테스트 ===");
    console.log("연결 상태:", this.connected);
    console.log("STOMP 클라이언트:", this.stompClient ? "존재" : "없음");
    console.log("현재 방 ID:", this.currentRoomId);
    console.log("메시지 핸들러 개수:", this.messageHandlers.size);

    if (this.stompClient) {
      console.log("STOMP 연결 상태:", this.stompClient.connected);
    }
    console.log("===============================");
  }

  // 🔥 구독 상태 확인 메서드
  getSubscriptionInfo() {
    return {
      connected: this.connected,
      currentRoomId: this.currentRoomId,
      handlerCount: this.messageHandlers.size,
      stompClientStatus: this.stompClient ? "exists" : "null",
    };
  }

  // 채팅방 참여 (구독) - 강화된 디버깅
  joinRoom(roomId, messageHandler) {
    console.log("🔄 joinRoom 시작 - roomId:", roomId);

    if (!this.connected) {
      console.error("❌ WebSocket이 연결되지 않음");
      return null;
    }

    if (!this.stompClient) {
      console.error("❌ STOMP 클라이언트가 없음");
      return null;
    }

    // 이전 룸에서 나가기
    if (this.currentRoomId && this.currentRoomId !== roomId) {
      console.log("🚪 이전 방 나가기:", this.currentRoomId);
      this.leaveRoom();
    }

    this.currentRoomId = roomId;
    const topicPath = `/topic/chat/${roomId}`;

    console.log("📡 구독 시도 - 토픽:", topicPath);

    try {
      // 채팅방 메시지 구독
      const subscription = this.stompClient.subscribe(topicPath, (message) => {
        console.log("📨 STOMP 메시지 원본 수신:", {
          body: message.body,
          headers: message.headers,
          command: message.command,
        });

        try {
          const parsedMessage = JSON.parse(message.body);
          console.log("📨 파싱된 메시지:", parsedMessage);

          // 등록된 모든 핸들러에게 메시지 전달
          let handlerCount = 0;
          this.messageHandlers.forEach((handler) => {
            try {
              handler(parsedMessage);
              handlerCount++;
            } catch (error) {
              console.error("❌ 메시지 핸들러 오류:", error);
            }
          });

          console.log(`📤 ${handlerCount}개 핸들러에게 메시지 전달 완료`);

          // 개별 핸들러 호출
          if (messageHandler) {
            console.log("📤 개별 핸들러 호출");
            messageHandler(parsedMessage);
          }
        } catch (error) {
          console.error("❌ 메시지 파싱 실패:", error);
          console.error("❌ 원본 메시지:", message.body);
        }
      });

      console.log("✅ 구독 성공:", subscription);

      // 입장 알림 전송
      const joinPath = `/app/chat/${roomId}/join`;
      console.log("📤 입장 알림 전송:", joinPath);
      this.stompClient.send(joinPath, {}, JSON.stringify({}));

      console.log("✅ 방 참여 완료:", roomId);
      return subscription;
    } catch (error) {
      console.error("❌ 방 참여 실패:", error);
      return null;
    }
  }

  // 채팅방 나가기
  leaveRoom() {
    if (this.currentRoomId) {
      console.log(`🚪 퇴장 알림 전송: /app/chat/${this.currentRoomId}/leave`);

      // 퇴장 알림 전송
      this.stompClient.send(
        `/app/chat/${this.currentRoomId}/leave`,
        {},
        JSON.stringify({})
      );
      console.log(`✅ 채팅방 ${this.currentRoomId} 나가기 완료`);
      this.currentRoomId = null;
    }
  }

  // 메시지 전송 - 강화된 디버깅
  sendMessage(roomId, content, messageType = "CHAT") {
    if (!this.connected) {
      console.error("❌ WebSocket이 연결되지 않음");
      return false;
    }

    if (!content.trim()) {
      console.warn("❌ 빈 메시지는 전송할 수 없음");
      return false;
    }

    const message = {
      content: content.trim(),
      type: messageType,
      timestamp: new Date().toISOString(),
    };

    try {
      const destination = `/app/chat/${roomId}`;
      console.log(`📤 메시지 전송 시도:`);
      console.log("  - 목적지:", destination);
      console.log("  - 메시지:", message);

      this.stompClient.send(destination, {}, JSON.stringify(message));

      console.log("✅ 메시지 전송 성공");
      return true;
    } catch (error) {
      console.error("❌ 메시지 전송 실패:", error);
      return false;
    }
  }

  // 메시지 핸들러 등록
  addMessageHandler(handler) {
    this.messageHandlers.add(handler);
    console.log(`📝 메시지 핸들러 등록 (총 ${this.messageHandlers.size}개)`);
  }

  // 메시지 핸들러 제거
  removeMessageHandler(handler) {
    this.messageHandlers.delete(handler);
    console.log(`🗑️ 메시지 핸들러 제거 (총 ${this.messageHandlers.size}개)`);
  }

  // 연결 상태 확인
  isConnected() {
    return this.connected;
  }

  // 현재 참여 중인 룸 ID
  getCurrentRoomId() {
    return this.currentRoomId;
  }
}

// 싱글톤 인스턴스 생성
const webSocketService = new WebSocketService();

export default webSocketService;
