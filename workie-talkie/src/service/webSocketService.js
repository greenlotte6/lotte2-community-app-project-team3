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

  // WebSocket 연결
  connect() {
    return new Promise((resolve, reject) => {
      try {
        // SockJS를 통한 WebSocket 연결
        const socket = new SockJS("/ws");
        this.stompClient = Stomp.over(socket);

        // 디버그 로그 비활성화 (운영 환경에서)
        this.stompClient.debug = (str) => {
          console.log("STOMP: " + str);
        };

        // 연결 시도
        this.stompClient.connect(
          {}, // 헤더 (필요시 JWT 토큰 등 추가)
          (frame) => {
            console.log("WebSocket 연결 성공:", frame);
            this.connected = true;
            resolve(frame);
          },
          (error) => {
            console.error("WebSocket 연결 실패:", error);
            this.connected = false;
            reject(error);
          }
        );
      } catch (error) {
        console.error("WebSocket 초기화 실패:", error);
        reject(error);
      }
    });
  }

  // WebSocket 연결 해제
  disconnect() {
    if (this.stompClient && this.connected) {
      this.stompClient.disconnect(() => {
        console.log("WebSocket 연결 해제");
        this.connected = false;
        this.currentRoomId = null;
      });
    }
  }

  // 채팅방 참여 (구독)
  joinRoom(roomId, messageHandler) {
    if (!this.connected) {
      console.error("WebSocket이 연결되지 않음");
      return;
    }

    // 이전 룸에서 나가기
    if (this.currentRoomId && this.currentRoomId !== roomId) {
      this.leaveRoom();
    }

    this.currentRoomId = roomId;

    // 채팅방 메시지 구독
    const subscription = this.stompClient.subscribe(
      `/topic/chat/${roomId}`,
      (message) => {
        try {
          const parsedMessage = JSON.parse(message.body);
          console.log("메시지 수신:", parsedMessage);

          // 등록된 모든 핸들러에게 메시지 전달
          this.messageHandlers.forEach((handler) => {
            try {
              handler(parsedMessage);
            } catch (error) {
              console.error("메시지 핸들러 오류:", error);
            }
          });

          // 개별 핸들러 호출
          if (messageHandler) {
            messageHandler(parsedMessage);
          }
        } catch (error) {
          console.error("메시지 파싱 오류:", error);
        }
      }
    );

    // 입장 알림 전송
    this.stompClient.send(`/app/chat/${roomId}/join`, {}, JSON.stringify({}));

    console.log(`채팅방 ${roomId} 참여 완료`);
    return subscription;
  }

  // 채팅방 나가기
  leaveRoom() {
    if (this.currentRoomId) {
      // 퇴장 알림 전송
      this.stompClient.send(
        `/app/chat/${this.currentRoomId}/leave`,
        {},
        JSON.stringify({})
      );
      console.log(`채팅방 ${this.currentRoomId} 나가기`);
      this.currentRoomId = null;
    }
  }

  // 메시지 전송
  sendMessage(roomId, content, messageType = "CHAT") {
    if (!this.connected) {
      console.error("WebSocket이 연결되지 않음");
      return false;
    }

    if (!content.trim()) {
      console.warn("빈 메시지는 전송할 수 없음");
      return false;
    }

    const message = {
      content: content.trim(),
      type: messageType,
      timestamp: new Date().toISOString(),
    };

    try {
      this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(message));
      console.log("메시지 전송:", message);
      return true;
    } catch (error) {
      console.error("메시지 전송 실패:", error);
      return false;
    }
  }

  // 메시지 핸들러 등록
  addMessageHandler(handler) {
    this.messageHandlers.add(handler);
  }

  // 메시지 핸들러 제거
  removeMessageHandler(handler) {
    this.messageHandlers.delete(handler);
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
