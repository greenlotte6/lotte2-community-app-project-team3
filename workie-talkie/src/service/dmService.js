// services/dmService.js - DM 관련 API 호출
class DMService {
  constructor() {
    this.baseURL = "/api/dm"; // 🔥 수정: /list 제거
  }

  // 사용자 검색 (DM 상대방 찾기)
  async searchUsers(query) {
    try {
      const response = await fetch(
        `/api/users/search?q=${encodeURIComponent(query)}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const users = await response.json();
        console.log("✅ 사용자 검색 성공:", users);
        return users;
      } else {
        throw new Error(`사용자 검색 실패: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ 사용자 검색 오류:", error);
      throw error;
    }
  }

  // DM 방 생성 또는 기존 방 찾기
  async createOrGetDMRoom(targetUserId) {
    try {
      const response = await fetch(`${this.baseURL}`, {
        // 🔥 수정: /room 제거
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetUserId: targetUserId,
        }),
      });

      if (response.ok) {
        const dmRoom = await response.json();
        console.log("✅ DM 방 생성/조회 성공:", dmRoom);
        return dmRoom;
      } else {
        throw new Error(`DM 방 생성 실패: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ DM 방 생성 오류:", error);
      throw error;
    }
  }

  // 사용자의 DM 목록 조회
  async getUserDMList() {
    try {
      const response = await fetch(`${this.baseURL}/list`, {
        // 🔥 수정: /list 유지
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const dmList = await response.json();
        console.log("✅ DM 목록 조회 성공:", dmList);
        return dmList;
      } else {
        throw new Error(`DM 목록 조회 실패: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ DM 목록 조회 오류:", error);
      throw error;
    }
  }

  // DM 방 나가기 (대화 숨기기)
  async leaveDMRoom(dmId) {
    // 🔥 수정: roomId -> dmId로 변경
    try {
      const response = await fetch(`${this.baseURL}/${dmId}`, {
        // 🔥 수정: 경로 단순화
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("✅ DM 방 나가기 성공");
        return true;
      } else {
        throw new Error(`DM 방 나가기 실패: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ DM 방 나가기 오류:", error);
      throw error;
    }
  }

  // roomId로 DM 조회 (WebSocket용) - 🔥 새로 추가
  async getDMByRoomId(roomId) {
    try {
      const response = await fetch(`${this.baseURL}/room/${roomId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const dm = await response.json();
        console.log("✅ DM 조회 성공:", dm);
        return dm;
      } else {
        throw new Error(`DM 조회 실패: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ DM 조회 오류:", error);
      throw error;
    }
  }

  // 사용자 온라인 상태 조회
  async getUserOnlineStatus(userIds) {
    try {
      const response = await fetch("/api/users/online-status", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIds }),
      });

      if (response.ok) {
        const statusMap = await response.json();
        console.log("✅ 온라인 상태 조회 성공:", statusMap);
        return statusMap;
      } else {
        throw new Error(`온라인 상태 조회 실패: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ 온라인 상태 조회 오류:", error);
      throw error;
    }
  }
}

export default new DMService();
