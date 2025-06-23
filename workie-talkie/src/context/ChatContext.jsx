// context/ChatContext.js - 메시지 전송 최적화 추가
import React, { createContext, useContext, useState, useEffect } from "react";
import dmService from "../service/dmService";
import channelService from "../service/channelService";
import webSocketService from "../service/webSocketService";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  // 사용자 정보
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  // 채팅 데이터
  const [channels, setChannels] = useState([]);
  const [dmList, setDmList] = useState([]);
  const [activeChat, setActiveChat] = useState({ type: null, id: null });

  // 🔥 메시지 상태 추가
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // 모달 상태
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [showDmModal, setShowDmModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // 로딩 상태
  const [channelsLoading, setChannelsLoading] = useState(false);
  const [dmsLoading, setDmsLoading] = useState(false);

  // 에러 상태
  const [error, setError] = useState(null);

  // 🔥 WebSocket 연결 상태
  const [websocketConnected, setWebsocketConnected] = useState(false);

  // 현재 사용자 정보 조회
  const fetchCurrentUser = async () => {
    try {
      setUserLoading(true);
      const response = await fetch("/api/users/me", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
        console.log("✅ 사용자 정보 조회 성공:", userData);
        return userData;
      } else if (response.status === 401) {
        console.warn("❌ 인증되지 않은 사용자");
        setCurrentUser(null);
        throw new Error("인증이 필요합니다");
      } else {
        throw new Error(`사용자 정보 조회 실패: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ 사용자 정보 조회 오류:", error);
      setError(error.message);
      setCurrentUser(null);
      throw error;
    } finally {
      setUserLoading(false);
    }
  };

  // 채널 목록 조회
  const fetchChannels = async () => {
    try {
      setChannelsLoading(true);
      setError(null);

      const channels = await channelService.getUserChannels();
      setChannels(channels);
      console.log("✅ 채널 목록 조회 성공:", channels);

      return channels;
    } catch (error) {
      console.error("❌ 채널 목록 조회 실패:", error);
      setError("채널 목록을 불러오는데 실패했습니다");
      setChannels([]);
      throw error;
    } finally {
      setChannelsLoading(false);
    }
  };

  // DM 목록 조회
  const fetchDMs = async () => {
    try {
      setDmsLoading(true);
      setError(null);

      const dms = await dmService.getUserDMList();

      // DM 목록에 온라인 상태 추가
      if (dms.length > 0) {
        const userIds = dms.map((dm) => dm.otherUserId).filter(Boolean);
        if (userIds.length > 0) {
          try {
            const onlineStatusMap = await dmService.getUserOnlineStatus(
              userIds
            );
            const dmsWithStatus = dms.map((dm) => ({
              ...dm,
              isOnline: onlineStatusMap[dm.otherUserId] || false,
            }));
            setDmList(dmsWithStatus);
          } catch (statusError) {
            console.warn("❌ 온라인 상태 조회 실패:", statusError);
            setDmList(dms);
          }
        } else {
          setDmList(dms);
        }
      } else {
        setDmList([]);
      }

      console.log("✅ DM 목록 조회 성공:", dms);
      return dms;
    } catch (error) {
      console.error("❌ DM 목록 조회 실패:", error);
      setError("DM 목록을 불러오는데 실패했습니다");
      setDmList([]);
      throw error;
    } finally {
      setDmsLoading(false);
    }
  };

  // 🔥 WebSocket 초기화 및 연결
  const initializeWebSocket = async () => {
    try {
      console.log("🔄 WebSocket 초기화 시작...");

      // WebSocket 연결
      await webSocketService.connect();
      setWebsocketConnected(true);

      // 메시지 핸들러 등록
      webSocketService.addMessageHandler(handleIncomingMessage);

      console.log("✅ WebSocket 초기화 완료");
    } catch (error) {
      console.error("❌ WebSocket 초기화 실패:", error);
      setWebsocketConnected(false);
    }
  };

  // 🔥 WebSocket으로 받은 메시지 처리
  const handleIncomingMessage = (message) => {
    console.log("📨 새 메시지 수신:", message);

    // 현재 활성화된 채팅의 메시지라면 즉시 화면에 추가
    if (
      (activeChat.type === "channel" && message.channelId === activeChat.id) ||
      (activeChat.type === "dm" && message.roomId === activeChat.id)
    ) {
      setMessages((prev) => {
        // 임시 메시지가 있다면 교체, 없다면 추가
        const existingIndex = prev.findIndex(
          (msg) => msg.isTemporary && msg.content === message.content
        );

        if (existingIndex !== -1) {
          // 임시 메시지를 실제 메시지로 교체
          const newMessages = [...prev];
          newMessages[existingIndex] = { ...message, isTemporary: false };
          return newMessages;
        } else {
          // 새 메시지 추가
          return [...prev, message];
        }
      });
    }

    // 채팅 목록의 최근 메시지 업데이트
    if (message.channelId) {
      updateChannelLastMessage(message.channelId, message);
    } else if (message.roomId) {
      updateDMLastMessage(message.roomId, message);
    }
  };

  // 🔥 메시지 전송 최적화 함수
  const sendMessage = async (content, type = "CHAT") => {
    if (!content.trim()) {
      console.warn("❌ 빈 메시지는 전송할 수 없습니다");
      return false;
    }

    if (!websocketConnected) {
      console.error("❌ WebSocket이 연결되지 않았습니다");
      setError("채팅 서버에 연결되지 않았습니다");
      return false;
    }

    if (!activeChat.type || !activeChat.id) {
      console.error("❌ 활성화된 채팅이 없습니다");
      return false;
    }

    // 1. 임시 메시지 생성 (즉시 UI에 표시)
    const tempMessage = {
      id: `temp-${Date.now()}-${Math.random()}`,
      content: content.trim(),
      sender: currentUser,
      senderName: currentUser?.name || currentUser?.id,
      senderId: currentUser?.id,
      timestamp: new Date().toISOString(),
      type: type,
      isTemporary: true,
      status: "sending",
    };

    // 2. 즉시 UI에 메시지 추가
    setMessages((prev) => [...prev, tempMessage]);

    try {
      // 3. WebSocket으로 메시지 전송
      const roomId = activeChat.type === "dm" ? activeChat.id : activeChat.id;
      const success = webSocketService.sendMessage(roomId, content, type);

      if (!success) {
        throw new Error("WebSocket 전송 실패");
      }

      console.log("✅ 메시지 전송 성공");

      // 4. 전송 상태 업데이트
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessage.id ? { ...msg, status: "sent" } : msg
        )
      );

      return true;
    } catch (error) {
      console.error("❌ 메시지 전송 실패:", error);

      // 5. 실패 시 임시 메시지에 오류 표시 또는 제거
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessage.id ? { ...msg, status: "failed" } : msg
        )
      );

      setError("메시지 전송에 실패했습니다");
      return false;
    }
  };

  // 🔥 메시지 목록 로드
  const loadMessages = async (chatType, chatId) => {
    try {
      setMessagesLoading(true);
      setMessages([]); // 이전 메시지 클리어

      let messages = [];

      if (chatType === "channel") {
        // 채널 메시지 API 호출 (구현 필요)
        // messages = await channelService.getChannelMessages(chatId);
        console.log("📝 채널 메시지 로드:", chatId);
      } else if (chatType === "dm") {
        // DM 메시지 API 호출 (구현 필요)
        // messages = await dmService.getDMMessages(chatId);
        console.log("📝 DM 메시지 로드:", chatId);
      }

      setMessages(messages || []);
      console.log("✅ 메시지 로드 완료:", messages?.length || 0);
    } catch (error) {
      console.error("❌ 메시지 로드 실패:", error);
      setError("메시지를 불러오는데 실패했습니다");
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  // 🔥 채팅방 입장 처리
  const joinChatRoom = async (chatType, chatId) => {
    try {
      console.log(`🚪 채팅방 입장: ${chatType} - ${chatId}`);

      if (websocketConnected) {
        // 이전 채팅방에서 나가기
        if (activeChat.type && activeChat.id) {
          webSocketService.leaveRoom();
        }

        // 새 채팅방 입장
        webSocketService.joinRoom(chatId, handleIncomingMessage);
      }

      // 메시지 로드
      await loadMessages(chatType, chatId);
    } catch (error) {
      console.error("❌ 채팅방 입장 실패:", error);
      setError("채팅방에 입장할 수 없습니다");
    }
  };

  // 데이터 새로고침 함수들
  const refreshChannels = () => {
    if (currentUser) {
      fetchChannels();
    }
  };

  const refreshDMs = () => {
    if (currentUser) {
      fetchDMs();
    }
  };

  const refreshAll = () => {
    refreshChannels();
    refreshDMs();
  };

  // 현재 선택된 채팅 정보 가져오기
  const getCurrentChat = () => {
    if (!activeChat.type || !activeChat.id) return null;

    if (activeChat.type === "channel") {
      return channels.find((channel) => channel.id === activeChat.id);
    } else if (activeChat.type === "dm") {
      return dmList.find((dm) => dm.id === activeChat.id);
    }

    return null;
  };

  // 🔥 채팅 선택 처리 (WebSocket 방 입장 포함)
  const handleChatSelect = async (type, id) => {
    console.log(`💬 채팅 선택: ${type} - ${id}`);

    // 이전 채팅과 같다면 무시
    if (activeChat.type === type && activeChat.id === id) {
      return;
    }

    setActiveChat({ type, id });

    // WebSocket 방 입장 및 메시지 로드
    await joinChatRoom(type, id);
  };

  // 채널 나가기 확인 모달 표시
  const showLeaveChannelModal = (channelId) => {
    setShowLeaveModal(channelId);
  };

  // 온라인 상태 업데이트 (WebSocket에서 호출)
  const updateUserOnlineStatus = (userId, isOnline) => {
    setDmList((prevDMs) =>
      prevDMs.map((dm) =>
        dm.otherUserId === userId ? { ...dm, isOnline } : dm
      )
    );
  };

  // 새 메시지 도착 시 DM 목록 업데이트
  const updateDMLastMessage = (roomId, message) => {
    setDmList((prevDMs) =>
      prevDMs.map((dm) =>
        dm.roomId === roomId
          ? {
              ...dm,
              lastMessage: message.content,
              lastMessageTime: message.timestamp || message.createdAt,
              unreadCount: (dm.unreadCount || 0) + 1,
            }
          : dm
      )
    );
  };

  // 새 메시지 도착 시 채널 목록 업데이트
  const updateChannelLastMessage = (channelId, message) => {
    setChannels((prevChannels) =>
      prevChannels.map((channel) =>
        channel.id === channelId
          ? {
              ...channel,
              lastMessage: message.content,
              lastMessageTime: message.timestamp || message.createdAt,
              unreadCount: (channel.unreadCount || 0) + 1,
            }
          : channel
      )
    );
  };

  // 읽음 표시 처리
  const markAsRead = (type, id) => {
    if (type === "channel") {
      setChannels((prevChannels) =>
        prevChannels.map((channel) =>
          channel.id === id ? { ...channel, unreadCount: 0 } : channel
        )
      );
    } else if (type === "dm") {
      setDmList((prevDMs) =>
        prevDMs.map((dm) => (dm.id === id ? { ...dm, unreadCount: 0 } : dm))
      );
    }
  };

  // 🔥 실패한 메시지 재전송
  const retryMessage = async (messageId) => {
    const message = messages.find((msg) => msg.id === messageId);
    if (!message || message.status !== "failed") return;

    console.log("🔄 메시지 재전송:", message.content);

    // 실패 상태를 전송 중으로 변경
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, status: "sending" } : msg
      )
    );

    // 재전송
    const success = await sendMessage(message.content, message.type);

    if (success) {
      // 성공 시 원본 메시지 제거 (WebSocket으로 새 메시지가 올 것임)
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    }
  };

  // 컴포넌트 마운트 시 데이터 초기화
  useEffect(() => {
    const initializeData = async () => {
      try {
        await fetchCurrentUser();
      } catch (error) {
        console.error("❌ 초기화 실패:", error);
      }
    };

    initializeData();
  }, []);

  // 🔥 사용자 로그인 후 WebSocket 연결 및 채팅 데이터 로드
  useEffect(() => {
    if (currentUser) {
      // WebSocket 연결
      initializeWebSocket();

      // 채팅 데이터 로드
      Promise.all([fetchChannels(), fetchDMs()]).catch((error) => {
        console.error("❌ 채팅 데이터 로드 실패:", error);
      });
    }
  }, [currentUser]);

  // 채팅 선택 시 읽음 표시
  useEffect(() => {
    if (activeChat.type && activeChat.id) {
      markAsRead(activeChat.type, activeChat.id);
    }
  }, [activeChat]);

  // 🔥 컴포넌트 언마운트 시 WebSocket 연결 해제
  useEffect(() => {
    return () => {
      if (websocketConnected) {
        webSocketService.disconnect();
      }
    };
  }, [websocketConnected]);

  const contextValue = {
    // 사용자 정보
    currentUser,
    userLoading,

    // 채팅 데이터
    channels,
    dmList,
    activeChat,
    channelsLoading,
    dmsLoading,

    // 🔥 메시지 관련 상태 추가
    messages,
    messagesLoading,
    websocketConnected,

    // 에러 상태
    error,
    setError,

    // 모달 상태
    showChannelModal,
    setShowChannelModal,
    showDmModal,
    setShowDmModal,
    showLeaveModal,
    setShowLeaveModal,

    // 액션 함수들
    setActiveChat: handleChatSelect,
    getCurrentChat,
    refreshChannels,
    refreshDMs,
    refreshAll,
    fetchCurrentUser,
    showLeaveChannelModal,

    // 🔥 메시지 관련 함수 추가
    sendMessage,
    loadMessages,
    retryMessage,

    // 실시간 업데이트 함수들
    updateUserOnlineStatus,
    updateDMLastMessage,
    updateChannelLastMessage,
    markAsRead,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
