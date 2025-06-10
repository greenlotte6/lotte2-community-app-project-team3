// src/pages/chat/ChatTestPage.jsx
import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export const ChatTestPage = () => {
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
    <div
      style={{
        maxWidth: "1000px",
        margin: "20px auto",
        padding: "20px",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          padding: "30px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#333",
            marginBottom: "10px",
          }}
        >
          🚀 WebSocket 채팅 테스트
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "30px",
          }}
        >
          리액트 ↔ 스프링부트 실시간 채팅 연결 테스트
        </p>

        {/* 연결 상태 */}
        <div
          style={{
            padding: "15px",
            marginBottom: "25px",
            backgroundColor: getStatusColor(),
            color: "white",
            borderRadius: "8px",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          🔗 연결 상태: {getStatusText()}
        </div>

        {!isJoined ? (
          // 입장 폼
          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "40px",
              borderRadius: "10px",
              border: "1px solid #dee2e6",
            }}
          >
            <h3
              style={{
                textAlign: "center",
                marginBottom: "30px",
                color: "#495057",
              }}
            >
              채팅방 입장
            </h3>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                  color: "#495057",
                }}
              >
                👤 사용자명:
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ced4da",
                  borderRadius: "5px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
                placeholder="사용자명을 입력하세요"
              />
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                  color: "#495057",
                }}
              >
                🏠 채팅방 ID:
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ced4da",
                  borderRadius: "5px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
                placeholder="채팅방 ID를 입력하세요"
              />
            </div>

            <button
              onClick={joinRoom}
              style={{
                width: "100%",
                padding: "15px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
            >
              🚪 채팅방 입장하기
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
                padding: "15px",
                backgroundColor: "#e9ecef",
                borderRadius: "8px",
              }}
            >
              <h3 style={{ margin: 0, color: "#495057" }}>
                💬 채팅방: {roomId}
              </h3>
              <button
                onClick={disconnect}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                🚪 나가기
              </button>
            </div>

            {/* 메시지 목록 */}
            <div
              style={{
                height: "450px",
                overflowY: "auto",
                border: "1px solid #dee2e6",
                padding: "20px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                marginBottom: "15px",
              }}
            >
              {messages.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    color: "#6c757d",
                    fontSize: "16px",
                    marginTop: "150px",
                  }}
                >
                  💬 첫 번째 메시지를 보내보세요!
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "15px",
                      padding: "12px",
                      borderRadius: "12px",
                      maxWidth: "70%",
                      backgroundColor:
                        message.type === "JOIN"
                          ? "#d1ecf1"
                          : message.sender === username
                          ? "#007bff"
                          : "white",
                      color: message.sender === username ? "white" : "#333",
                      marginLeft:
                        message.type === "JOIN"
                          ? "auto"
                          : message.sender === username
                          ? "auto"
                          : "0",
                      marginRight:
                        message.type === "JOIN"
                          ? "auto"
                          : message.sender === username
                          ? "0"
                          : "auto",
                      border:
                        message.type !== "JOIN" && message.sender !== username
                          ? "1px solid #dee2e6"
                          : "none",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        opacity: 0.8,
                        marginBottom: "5px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <strong>{message.sender}</strong>
                      {message.createdAt && (
                        <span>
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "14px" }}>{message.content}</div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* 메시지 입력 */}
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="💬 메시지를 입력하세요..."
                disabled={!isConnected}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "1px solid #ced4da",
                  borderRadius: "25px",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!isConnected || !messageInput.trim()}
                style={{
                  padding: "12px 25px",
                  backgroundColor:
                    isConnected && messageInput.trim() ? "#28a745" : "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "25px",
                  cursor:
                    isConnected && messageInput.trim()
                      ? "pointer"
                      : "not-allowed",
                  fontWeight: "bold",
                  minWidth: "80px",
                }}
              >
                📤 전송
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
