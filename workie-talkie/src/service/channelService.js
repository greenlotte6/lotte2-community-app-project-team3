// services/channelService.js - 채널 관련 API 호출
class ChannelService {
  constructor() {
    this.baseURL = "/api/channels";
  }

  // 채널 생성
  async createChannel(channelData) {
    try {
      const response = await fetch(this.baseURL, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(channelData),
      });

      if (response.ok) {
        const channel = await response.json();
        console.log("✅ 채널 생성 성공:", channel);
        return channel;
      } else {
        const error = await response.json();
        throw new Error(error.message || `채널 생성 실패: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ 채널 생성 오류:", error);
      throw error;
    }
  }

  // 사용자의 채널 목록 조회
  async getUserChannels() {
    try {
      const response = await fetch(`${this.baseURL}/my`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const channels = await response.json();
        console.log("✅ 채널 목록 조회 성공:", channels);
        return channels;
      } else {
        throw new Error(`채널 목록 조회 실패: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ 채널 목록 조회 오류:", error);
      throw error;
    }
  }

  // 채널에 멤버 추가
  async addMemberToChannel(channelId, userId) {
    try {
      const response = await fetch(`${this.baseURL}/${channelId}/members`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ 멤버 추가 성공:", result);
        return result;
      } else {
        const error = await response.json();
        throw new Error(error.message || `멤버 추가 실패: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ 멤버 추가 오류:", error);
      throw error;
    }
  }

  // 채널에서 멤버 제거
  async removeMemberFromChannel(channelId, userId) {
    try {
      const response = await fetch(
        `${this.baseURL}/${channelId}/members/${userId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("✅ 멤버 제거 성공");
        return true;
      } else {
        const error = await response.json();
        throw new Error(error.message || `멤버 제거 실패: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ 멤버 제거 오류:", error);
      throw error;
    }
  }

  // 채널 멤버 목록 조회
  async getChannelMembers(channelId) {
    try {
      const response = await fetch(`${this.baseURL}/${channelId}/members`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const members = await response.json();
        console.log("✅ 채널 멤버 조회 성공:", members);
        return members;
      } else {
        throw new Error(`채널 멤버 조회 실패: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ 채널 멤버 조회 오류:", error);
      throw error;
    }
  }

  // 채널 나가기
  async leaveChannel(channelId) {
    try {
      const response = await fetch(`${this.baseURL}/${channelId}/leave`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("✅ 채널 나가기 성공");
        return true;
      } else {
        const error = await response.json();
        throw new Error(
          error.message || `채널 나가기 실패: ${response.status}`
        );
      }
    } catch (error) {
      console.error("❌ 채널 나가기 오류:", error);
      throw error;
    }
  }

  // 채널 정보 수정
  async updateChannel(channelId, updateData) {
    try {
      const response = await fetch(`${this.baseURL}/${channelId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const channel = await response.json();
        console.log("✅ 채널 수정 성공:", channel);
        return channel;
      } else {
        const error = await response.json();
        throw new Error(error.message || `채널 수정 실패: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ 채널 수정 오류:", error);
      throw error;
    }
  }

  // 채널 삭제 (소유자만)
  async deleteChannel(channelId) {
    try {
      const response = await fetch(`${this.baseURL}/${channelId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("✅ 채널 삭제 성공");
        return true;
      } else {
        const error = await response.json();
        throw new Error(error.message || `채널 삭제 실패: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ 채널 삭제 오류:", error);
      throw error;
    }
  }
}

export default new ChannelService();
