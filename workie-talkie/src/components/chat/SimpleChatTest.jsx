import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const SimpleChatTest = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [username, setUsername] = useState("테스터1");
  const [roomId, setRoomId] = useState("room1");
  const [isConnected, setIsConnected] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);

  // 연결 함수
  const connect = () => {
    console.log("연결 시도 중...");

    const socket = new SockJS("http://localhost:8080/ws");
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log("STOMP:", str),

      onConnect: () => {
        console.log("✅ WebSocket 연결 성공!");
        setIsConnected(true);

        // 채팅방 구독
        stompClient.current.subscribe(`/topic/${roomId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          console.log("수신된 메시지:", receivedMessage);
          setMessages((prev) => [...prev, receivedMessage]);
        });

        // 입장 메시지 전송
        sendJoinMessage();
      },

      onDisconnect: () => {
        console.log("❌ WebSocket 연결 해제");
        setIsConnected(false);
      },

      onStompError: (frame) => {
        console.error("❌ STOMP 에러:", frame);
        setIsConnected(false);
      },
    });

    stompClient.current.activate();
  };

  // 입장 메시지 전송
  const sendJoinMessage = () => {
    const joinMessage = {
      sender: username,
      type: "JOIN",
    };

    stompClient.current.publish({
      destination: `/app/chat.addUser/${roomId}`,
      body: JSON.stringify(joinMessage),
    });
  };

  // 일반 메시지 전송
  const sendMessage = () => {
    if (messageInput.trim() && isConnected) {
      const message = {
        sender: username,
        content: messageInput.trim(),
        type: "CHAT",
      };

      console.log("메시지 전송:", message);

      stompClient.current.publish({
        destination: `/app/chat.sendMessage/${roomId}`,
        body: JSON.stringify(message),
      });

      setMessageInput("");
    }
  };

  // 연결 해제
  const disconnect = () => {
    if (stompClient.current) {
      stompClient.current.deactivate();
      setIsConnected(false);
      setIsJoined(false);
      setMessages([]);
    }
  };

  // 채팅방 입장
  const joinRoom = () => {
    if (username.trim() && roomId.trim()) {
      setIsJoined(true);
      connect();

      // 기존 채팅 히스토리 로드
      loadHistory();
    }
  };

  // 히스토리 로드
  const loadHistory = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/chat/history/${roomId}`
      );
      if (response.ok) {
        const history = await response.json();
        setMessages(history);
        console.log("히스토리 로드 완료:", history.length, "개 메시지");
      }
    } catch (error) {
      console.error("히스토리 로드 실패:", error);
    }
  };

  // 메시지 목록 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 엔터키 처리
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 연결 상태 표시
  const getStatusColor = () => {
    if (isConnected) return "#28a745";
    return "#dc3545";
  };

  const getStatusText = () => {
    if (!isJoined) return "대기중";
    if (isConnected) return "연결됨";
    return "연결 실패";
  };

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", padding: "20px" }}>
      <h2>🚀 리액트 ↔ 스프링부트 채팅 테스트</h2>

      {/* 연결 상태 */}
      <div
        style={{
          padding: "10px",
          marginBottom: "20px",
          backgroundColor: getStatusColor(),
          color: "white",
          borderRadius: "5px",
          textAlign: "center",
        }}
      >
        상태: {getStatusText()}
      </div>

      {!isJoined ? (
        // 입장 폼
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "30px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          <h3>채팅방 입장</h3>
          <div style={{ marginBottom: "15px" }}>
            <label>사용자명:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
              placeholder="사용자명을 입력하세요"
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>채팅방 ID:</label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
              placeholder="채팅방 ID를 입력하세요"
            />
          </div>
          <button
            onClick={joinRoom}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            채팅방 입장
          </button>
        </div>
      ) : (
        // 채팅 화면
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h3>채팅방: {roomId}</h3>
            <button
              onClick={disconnect}
              style={{
                padding: "8px 16px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              나가기
            </button>
          </div>

          {/* 메시지 목록 */}
          <div
            style={{
              height: "400px",
              overflowY: "auto",
              border: "1px solid #ddd",
              padding: "15px",
              backgroundColor: "#f8f9fa",
              borderRadius: "5px",
              marginBottom: "15px",
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundColor:
                    message.type === "JOIN"
                      ? "#d4edda"
                      : message.sender === username
                      ? "#007bff"
                      : "white",
                  color: message.sender === username ? "white" : "black",
                  marginLeft: message.sender === username ? "30%" : "0",
                  marginRight: message.sender === username ? "0" : "30%",
                  border:
                    message.type !== "JOIN" && message.sender !== username
                      ? "1px solid #ddd"
                      : "none",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    opacity: 0.8,
                    marginBottom: "5px",
                  }}
                >
                  <strong>{message.sender}</strong>
                  {message.createdAt && (
                    <span style={{ float: "right" }}>
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </span>
                  )}
                </div>
                <div>{message.content}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 메시지 입력 */}
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              disabled={!isConnected}
              style={{
                flex: 1,
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!isConnected || !messageInput.trim()}
              style={{
                padding: "10px 20px",
                backgroundColor: isConnected ? "#007bff" : "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: isConnected ? "pointer" : "not-allowed",
              }}
            >
              전송
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleChatTest;
