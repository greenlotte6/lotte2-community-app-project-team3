// components/chat/ChatArea.jsx - 수정된 버전
import React, { useState, useEffect, useRef } from "react";
import { Hash, MessageCircle, Users, Send } from "lucide-react";
import { useChat } from "../../context/ChatContext";
import webSocketService from "../../service/webSocketService";

// 채팅 헤더 컴포넌트
const ChatHeader = ({ currentChat, activeChat }) => {
  return (
    <div className="chat-header">
      <div className="header-content">
        {activeChat.type === "channel" ? (
          <>
            <Hash className="channel-icon" />
            <span className="chat-name">{currentChat.name}</span>
            <Users className="members-icon" />
            <span className="member-count">
              {currentChat.memberCount || 0}명
            </span>
          </>
        ) : (
          <>
            <MessageCircle className="channel-icon" />
            <span className="chat-name">
              {currentChat.otherUserName || currentChat.name}
            </span>
            <div
              className={`online-status ${
                currentChat.isOnline ? "online" : "offline"
              }`}
            ></div>
            <span className="status-text">
              {currentChat.isOnline ? "온라인" : "오프라인"}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

// 메시지 컴포넌트
const MessageItem = ({ message, isOwnMessage, currentUser }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMessageTypeClass = (type) => {
    switch (type) {
      case "JOIN":
        return "system-message join";
      case "LEAVE":
        return "system-message leave";
      default:
        return isOwnMessage ? "user-message own" : "user-message other";
    }
  };

  // 자신이 보낸 메시지인지 확인
  const isOwn =
    currentUser &&
    (message.senderId === currentUser.id ||
      message.senderName === currentUser.name ||
      message.senderId === currentUser.employeeId);

  return (
    <div className={`message-item ${getMessageTypeClass(message.type)}`}>
      {message.type === "CHAT" && (
        <>
          {!isOwn && <div className="message-sender">{message.senderName}</div>}
          <div className="message-content">{message.content}</div>
          <div className="message-time">
            {formatTime(message.timestamp || message.createdAt)}
          </div>
        </>
      )}
      {(message.type === "JOIN" || message.type === "LEAVE") && (
        <div className="system-content">{message.content}</div>
      )}
    </div>
  );
};

// 메시지 입력창 컴포넌트
const MessageInput = ({
  currentChat,
  activeChat,
  onSendMessage,
  isConnected,
  isSending,
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && currentChat && isConnected && !isSending) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const roomId = currentChat
    ? activeChat.type === "channel"
      ? `channel_${currentChat.id}`
      : currentChat.roomId
    : null;

  return (
    <div className="message-input">
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`${
            activeChat.type === "channel"
              ? "#" + currentChat?.name
              : currentChat?.otherUserName || currentChat?.name || "채팅"
          }에 메시지 보내기`}
          className="message-input-field"
          disabled={!isConnected || isSending}
        />
        <button
          type="submit"
          className="send-button"
          disabled={!message.trim() || !isConnected || isSending}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

// 메인 채팅 영역 컴포넌트
const ChatArea = () => {
  const { getCurrentChat, activeChat, currentUser } = useChat();
  const currentChat = getCurrentChat();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const currentRoomRef = useRef(null);
  const subscriptionRef = useRef(null);

  // 메시지 목록 끝으로 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 메시지 중복 확인 함수
  const isDuplicateMessage = (newMessage, existingMessages) => {
    return existingMessages.some(
      (msg) =>
        (msg.id && newMessage.id && msg.id === newMessage.id) ||
        (msg.content === newMessage.content &&
          msg.senderName === newMessage.senderName &&
          Math.abs(
            new Date(msg.timestamp || msg.createdAt) -
              new Date(newMessage.timestamp || newMessage.createdAt)
          ) < 1000)
    );
  };

  // 메시지 추가 함수 (중복 방지)
  const addMessage = (newMessage) => {
    setMessages((prevMessages) => {
      if (isDuplicateMessage(newMessage, prevMessages)) {
        console.log("중복 메시지 무시:", newMessage);
        return prevMessages;
      }
      console.log("새 메시지 추가:", newMessage);
      return [...prevMessages, newMessage];
    });
  };

  // WebSocket 연결 초기화
  useEffect(() => {
    const initWebSocket = async () => {
      try {
        if (!webSocketService.isConnected()) {
          await webSocketService.connect();
        }
        setWsConnected(true);
        console.log("WebSocket 연결 성공");
      } catch (error) {
        console.error("WebSocket 연결 실패:", error);
        setWsConnected(false);
      }
    };

    initWebSocket();

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
      currentRoomRef.current = null;
    };
  }, []);

  // 채팅방 변경 시 처리
  useEffect(() => {
    if (!currentChat || !wsConnected) return;

    const roomId =
      activeChat.type === "channel"
        ? `channel_${currentChat.id}`
        : currentChat.roomId;

    // 같은 방이면 중복 처리 방지
    if (currentRoomRef.current === roomId) {
      return;
    }

    console.log("채팅방 변경:", currentRoomRef.current, "->", roomId);

    // 이전 구독 해제
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }

    // 이전 방 나가기
    if (currentRoomRef.current) {
      webSocketService.leaveRoom();
    }

    // 새 방 설정
    currentRoomRef.current = roomId;
    setMessages([]);
    setLoading(true);

    // 채팅 히스토리 로드
    loadChatHistory(roomId);

    // 새 방 참여 및 메시지 구독
    const messageHandler = (message) => {
      console.log("새 메시지 수신:", message);
      addMessage(message);
    };

    try {
      subscriptionRef.current = webSocketService.joinRoom(
        roomId,
        messageHandler
      );
      console.log("방 참여 완료:", roomId);
    } catch (error) {
      console.error("방 참여 실패:", error);
    }

    // cleanup 함수
    return () => {
      // 컴포넌트가 언마운트되거나 방이 바뀔 때만 정리
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [currentChat, activeChat, wsConnected]);

  // 새 메시지 도착 시 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 채팅 히스토리 로드
  const loadChatHistory = async (roomId) => {
    try {
      const response = await fetch(`/api/chat/recent/${roomId}?limit=50`, {
        credentials: "include",
      });

      if (response.ok) {
        const history = await response.json();
        setMessages(history);
        console.log("채팅 히스토리 로드 완료:", history.length);
      }
    } catch (error) {
      console.error("채팅 히스토리 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 메시지 전송
  const handleSendMessage = async (content) => {
    if (!currentChat || !wsConnected || isSending) {
      console.log("메시지 전송 불가:", {
        currentChat: !!currentChat,
        wsConnected,
        isSending,
      });
      return;
    }

    const roomId =
      activeChat.type === "channel"
        ? `channel_${currentChat.id}`
        : currentChat.roomId;

    setIsSending(true);

    try {
      const success = webSocketService.sendMessage(roomId, content);
      if (!success) {
        console.error("메시지 전송 실패");
        // TODO: 사용자에게 오류 알림
      }
    } catch (error) {
      console.error("메시지 전송 중 오류:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="chat-area">
      {/* 채팅 헤더 */}
      {currentChat && (
        <ChatHeader currentChat={currentChat} activeChat={activeChat} />
      )}

      {/* 채팅 메시지 영역 */}
      <div className="messages-area">
        {!currentChat ? (
          <div className="empty-state">채널이나 DM을 선택해주세요</div>
        ) : !wsConnected ? (
          <div className="empty-state">연결 중...</div>
        ) : loading ? (
          <div className="empty-state">메시지를 불러오는 중...</div>
        ) : messages.length === 0 ? (
          <div className="empty-state">
            {activeChat.type === "channel"
              ? `#${currentChat.name} 채팅을 시작하세요`
              : `${
                  currentChat.otherUserName || currentChat.name
                }과의 대화를 시작하세요`}
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message, index) => {
              // 고유한 키 생성
              const messageKey = message.id
                ? `msg-${message.id}`
                : `msg-${
                    message.timestamp || message.createdAt || Date.now()
                  }-${index}`;

              return (
                <MessageItem
                  key={messageKey}
                  message={message}
                  currentUser={currentUser}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 메시지 입력 영역 */}
      {currentChat && (
        <MessageInput
          currentChat={currentChat}
          activeChat={activeChat}
          onSendMessage={handleSendMessage}
          isConnected={wsConnected}
          isSending={isSending}
        />
      )}
    </div>
  );
};

export default ChatArea;
