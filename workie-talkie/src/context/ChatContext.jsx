// context/ChatContext.js - 완전한 DM 및 채널 기능 지원
import React, { createContext, useContext, useState, useEffect } from "react";
import dmService from "../service/dmService";
import channelService from "../service/channelService";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  // 사용자 정보
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  // 채팅 데이터
  const [channels, setChannels] = useState([]);
  const [dmList, setDmList] = useState([]);
  const [activeChat, setActiveChat] = useState({ type: null, id: null });

  // 모달 상태
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [showDmModal, setShowDmModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // 로딩 상태
  const [channelsLoading, setChannelsLoading] = useState(false);
  const [dmsLoading, setDmsLoading] = useState(false);

  // 에러 상태
  const [error, setError] = useState(null);

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

  // 채팅 선택 처리
  const handleChatSelect = (type, id) => {
    console.log(`💬 채팅 선택: ${type} - ${id}`);
    setActiveChat({ type, id });
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

  // 사용자 로그인 후 채팅 데이터 로드
  useEffect(() => {
    if (currentUser) {
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
