// context/ChatContext.jsx
import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  // 사용자 정보
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: "김철수",
    isPremium: false, // true로 변경하면 유료 회원
  });

  // 채널 목록
  const [channels, setChannels] = useState([
    { id: 1, name: "일반", members: ["김철수", "이영희"], ownerId: 1 },
    {
      id: 2,
      name: "프로젝트",
      members: ["김철수", "박민수", "최지영"],
      ownerId: 1,
    },
  ]);

  // DM 목록
  const [dmList, setDmList] = useState([
    { id: 1, name: "이영희", isOnline: true },
    { id: 2, name: "박민수", isOnline: false },
  ]);

  // 현재 선택된 채널/DM
  const [activeChat, setActiveChat] = useState({ type: "channel", id: 1 });

  // 모달 상태
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [showDmModal, setShowDmModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // 새 채널/DM 생성 폼
  const [newChannel, setNewChannel] = useState({ name: "", members: [] });
  const [newDm, setNewDm] = useState("");

  // 사용 가능한 멤버 목록
  const availableMembers = ["이영희", "박민수", "최지영", "김영수", "정민정"];

  // 채널 추가 함수
  const handleAddChannel = () => {
    if (!newChannel.name.trim()) return;

    const maxMembers = currentUser.isPremium ? Infinity : 3;
    if (newChannel.members.length > maxMembers) {
      alert(
        `${
          currentUser.isPremium ? "유료" : "무료"
        } 회원은 최대 ${maxMembers}명까지 추가할 수 있습니다.`
      );
      return;
    }

    const channel = {
      id: Date.now(),
      name: newChannel.name,
      members: [currentUser.name, ...newChannel.members],
      ownerId: currentUser.id,
    };

    setChannels([...channels, channel]);
    setNewChannel({ name: "", members: [] });
    setShowChannelModal(false);
  };

  // DM 추가 함수
  const handleAddDm = () => {
    if (!newDm.trim()) return;

    const maxDms = currentUser.isPremium ? Infinity : 3;
    if (dmList.length >= maxDms) {
      alert(
        `${
          currentUser.isPremium ? "유료" : "무료"
        } 회원은 최대 ${maxDms}개의 DM만 가능합니다.`
      );
      return;
    }

    if (dmList.find((dm) => dm.name === newDm)) {
      alert("이미 추가된 멤버입니다.");
      return;
    }

    const dm = {
      id: Date.now(),
      name: newDm,
      isOnline: Math.random() > 0.5,
    };

    setDmList([...dmList, dm]);
    setNewDm("");
    setShowDmModal(false);
  };

  // 채널 나가기 함수
  const handleLeaveChannel = (channelId) => {
    const channel = channels.find((c) => c.id === channelId);
    if (channel.ownerId === currentUser.id) {
      const newOwner = channel.members.find(
        (member) => member !== currentUser.name
      );
      if (newOwner) {
        alert(`${newOwner}님에게 채널 관리자가 이임됩니다.`);
      }
    }

    setChannels(channels.filter((c) => c.id !== channelId));
    if (activeChat.type === "channel" && activeChat.id === channelId) {
      setActiveChat({ type: "channel", id: channels[0]?.id || null });
    }
    setShowLeaveModal(false);
  };

  // 멤버 토글 함수
  const toggleMember = (member) => {
    const isSelected = newChannel.members.includes(member);
    if (isSelected) {
      setNewChannel({
        ...newChannel,
        members: newChannel.members.filter((m) => m !== member),
      });
    } else {
      const maxMembers = currentUser.isPremium ? Infinity : 3;
      if (newChannel.members.length >= maxMembers) {
        alert(
          `${
            currentUser.isPremium ? "유료" : "무료"
          } 회원은 최대 ${maxMembers}명까지 추가할 수 있습니다.`
        );
        return;
      }
      setNewChannel({
        ...newChannel,
        members: [...newChannel.members, member],
      });
    }
  };

  // 현재 채팅 정보 가져오기
  const getCurrentChat = () => {
    if (activeChat.type === "channel") {
      return channels.find((c) => c.id === activeChat.id);
    } else {
      return dmList.find((d) => d.id === activeChat.id);
    }
  };

  const value = {
    // States
    currentUser,
    channels,
    dmList,
    activeChat,
    showChannelModal,
    showDmModal,
    showLeaveModal,
    newChannel,
    newDm,
    availableMembers,

    // Setters
    setCurrentUser,
    setChannels,
    setDmList,
    setActiveChat,
    setShowChannelModal,
    setShowDmModal,
    setShowLeaveModal,
    setNewChannel,
    setNewDm,

    // Functions
    handleAddChannel,
    handleAddDm,
    handleLeaveChannel,
    toggleMember,
    getCurrentChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
