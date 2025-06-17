// services/channelService.js - 수정된 채널 관련 API 호출
class ChannelService {
  constructor() {
    this.baseURL = "http://localhost:8080";
  }

  // 🔥 JWT 토큰 헤더 생성 헬퍼 메서드
  getAuthHeaders() {
    let token = null;

    // 1. 기본 토큰 위치들 확인
    token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("jwt");

    // 2. 🔥 login-storage에서 토큰 추출 (핵심 수정!)
    if (!token) {
      try {
        const loginStorage = localStorage.getItem("login-storage");
        if (loginStorage) {
          const parsed = JSON.parse(loginStorage);
          const userToken = parsed?.state?.user?.token;
          if (userToken) {
            token = userToken;
            console.log("✅ channelService: login-storage에서 토큰 발견");

            // 편의를 위해 token 키에도 저장
            localStorage.setItem("token", userToken);
          }
        }
      } catch (error) {
        console.error("login-storage 파싱 오류:", error);
      }
    }

    console.log(
      "🔑 channelService 토큰:",
      token ? `${token.substring(0, 20)}...` : "null"
    );

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  // 🔥 채널 생성 (경로 수정: /channels 추가)
  async createChannel(channelData) {
    try {
      console.log("🚀 채널 생성 요청:", channelData);

      const response = await fetch(`${this.baseURL}/channels`, {
        // 경로 수정
        method: "POST",
        headers: this.getAuthHeaders(), // JWT 토큰 헤더 사용
        body: JSON.stringify(channelData),
      });

      console.log("📥 채널 생성 응답:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (response.ok) {
        const channel = await response.json();
        console.log("✅ 채널 생성 성공:", channel);
        return channel;
      } else {
        let errorMessage = `채널 생성 실패: ${response.status}`;

        try {
          const error = await response.json();
          errorMessage = error.error || error.message || errorMessage;
        } catch (jsonError) {
          // JSON 파싱 실패 시 기본 메시지 사용
          console.warn("에러 응답 JSON 파싱 실패:", jsonError);
        }

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("❌ 채널 생성 오류:", error);
      throw error;
    }
  }

  // 🔥 사용자의 채널 목록 조회 (경로 수정)
  async getUserChannels() {
    try {
      const response = await fetch(`${this.baseURL}/channels`, {
        // 경로 수정
        method: "GET",
        headers: this.getAuthHeaders(),
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

  // 🔥 채널에 멤버 추가 (경로 수정)
  async addMemberToChannel(channelId, userId) {
    try {
      const response = await fetch(
        `${this.baseURL}/channels/${channelId}/members`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ memberIds: [userId] }), // 백엔드 API에 맞게 수정
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("✅ 멤버 추가 성공:", result);
        return result;
      } else {
        let errorMessage = `멤버 추가 실패: ${response.status}`;
        try {
          const error = await response.json();
          errorMessage = error.error || error.message || errorMessage;
        } catch (jsonError) {
          console.warn("에러 응답 JSON 파싱 실패:", jsonError);
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("❌ 멤버 추가 오류:", error);
      throw error;
    }
  }

  // 🔥 채널에서 멤버 제거 (경로 수정)
  async removeMemberFromChannel(channelId, userId) {
    try {
      const response = await fetch(
        `${this.baseURL}/channels/${channelId}/members/${userId}`,
        {
          method: "DELETE",
          headers: this.getAuthHeaders(),
        }
      );

      if (response.ok) {
        console.log("✅ 멤버 제거 성공");
        return true;
      } else {
        let errorMessage = `멤버 제거 실패: ${response.status}`;
        try {
          const error = await response.json();
          errorMessage = error.error || error.message || errorMessage;
        } catch (jsonError) {
          console.warn("에러 응답 JSON 파싱 실패:", jsonError);
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("❌ 멤버 제거 오류:", error);
      throw error;
    }
  }

  // 🔥 채널 멤버 목록 조회 (경로 수정)
  async getChannelMembers(channelId) {
    try {
      const response = await fetch(
        `${this.baseURL}/channels/${channelId}/members`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

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

  // 🔥 채널 나가기 (경로 및 메서드 수정)
  async leaveChannel(channelId) {
    try {
      const response = await fetch(
        `${this.baseURL}/channels/${channelId}/leave`,
        {
          method: "POST", // DELETE → POST로 변경 (백엔드와 일치)
          headers: this.getAuthHeaders(),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("✅ 채널 나가기 성공:", result);
        return result;
      } else {
        let errorMessage = `채널 나가기 실패: ${response.status}`;
        try {
          const error = await response.json();
          errorMessage = error.error || error.message || errorMessage;
        } catch (jsonError) {
          console.warn("에러 응답 JSON 파싱 실패:", jsonError);
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("❌ 채널 나가기 오류:", error);
      throw error;
    }
  }

  // 🔥 채널 정보 수정 (경로 수정)
  async updateChannel(channelId, updateData) {
    try {
      const response = await fetch(`${this.baseURL}/channels/${channelId}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const channel = await response.json();
        console.log("✅ 채널 수정 성공:", channel);
        return channel;
      } else {
        let errorMessage = `채널 수정 실패: ${response.status}`;
        try {
          const error = await response.json();
          errorMessage = error.error || error.message || errorMessage;
        } catch (jsonError) {
          console.warn("에러 응답 JSON 파싱 실패:", jsonError);
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("❌ 채널 수정 오류:", error);
      throw error;
    }
  }

  // 🔥 채널 삭제 (소유자만) (경로 수정)
  async deleteChannel(channelId) {
    try {
      const response = await fetch(`${this.baseURL}/channels/${channelId}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });

      if (response.ok) {
        console.log("✅ 채널 삭제 성공");
        return true;
      } else {
        let errorMessage = `채널 삭제 실패: ${response.status}`;
        try {
          const error = await response.json();
          errorMessage = error.error || error.message || errorMessage;
        } catch (jsonError) {
          console.warn("에러 응답 JSON 파싱 실패:", jsonError);
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("❌ 채널 삭제 오류:", error);
      throw error;
    }
  }

  // 🔥 추가: 사용자 검색 기능 (Modals.jsx에서 사용)
  async searchUsers(query) {
    try {
      console.log("🔍 사용자 검색 요청:", query);

      const response = await fetch(
        `${this.baseURL}/users/search?q=${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      console.log("📥 사용자 검색 응답:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

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

  // 🔥 디버그용: 토큰 상태 확인
  checkAuthStatus() {
    const token = localStorage.getItem("token");
    console.log("🔐 인증 상태 확인:", {
      hasToken: !!token,
      tokenLength: token ? token.length : 0,
      tokenPreview: token ? `${token.substring(0, 20)}...` : "null",
    });
    return !!token;
  }
}

export default new ChannelService();
