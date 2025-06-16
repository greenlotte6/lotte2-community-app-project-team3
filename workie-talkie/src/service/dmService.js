// 1. dmService.js 수정 - URL 문제 해결
class DMService {
  constructor() {
    this.baseURL = "http://localhost:8080"; // 🔥 올바른 백엔드 URL
  }

  // JWT 토큰 헤더 생성
  getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  // 🔥 사용자 검색 (올바른 URL로 수정)
  async searchUsers(query) {
    try {
      console.log("🔍 사용자 검색 요청:", query);

      const response = await fetch(
        `${this.baseURL}/users/search?q=${encodeURIComponent(query)}`, // 🔥 올바른 URL
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

  // DM 룸 생성/조회
  async createOrGetDMRoom(targetUserId) {
    try {
      console.log("💬 DM 룸 생성/조회:", targetUserId);

      const response = await fetch(`${this.baseURL}/dm/create`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          targetUserId: targetUserId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ DM 룸 생성/조회 성공:", result);
        return result;
      } else {
        let errorMessage = "DM 시작에 실패했습니다.";

        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          errorMessage = `서버 오류 (${response.status}): ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("❌ DM 생성 오류:", error);
      throw error;
    }
  }

  // 토큰 상태 확인
  checkAuthStatus() {
    const token = localStorage.getItem("token");
    console.log("🔐 DM Service 인증 상태:", {
      hasToken: !!token,
      tokenLength: token ? token.length : 0,
      tokenPreview: token ? `${token.substring(0, 20)}...` : "null",
    });
    return !!token;
  }
}

export default new DMService();

// 2. 브라우저에서 즉시 실행할 로그인 및 테스트 함수
function quickLoginAndTest() {
  console.clear();
  console.log("🚀 빠른 로그인 및 테스트");
  console.log("========================");

  // 토큰 확인
  const token = localStorage.getItem("token");
  console.log("현재 토큰 상태:", !!token);

  if (!token) {
    console.log("🔑 자동 로그인 시도...");
    tryLogin();
  } else {
    console.log("✅ 토큰 존재, 사용자 검색 테스트 시작");
    testUserSearch();
  }
}

async function tryLogin() {
  try {
    const response = await fetch("http://localhost:8080/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: "user4", // 🔥 실제 사용자 ID로 변경하세요
        pass: "test123", // 🔥 실제 비밀번호로 변경하세요
      }),
    });

    console.log("로그인 응답 상태:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ 로그인 성공:", data);

      if (data.token) {
        localStorage.setItem("token", data.token);
        console.log("✅ 토큰 저장 완료");

        // 로그인 성공 후 사용자 검색 테스트
        setTimeout(() => testUserSearch(), 500);
      } else {
        console.log("❌ 응답에 토큰이 없습니다:", data);
      }
    } else {
      const errorText = await response.text();
      console.log("❌ 로그인 실패:", response.status, errorText);
    }
  } catch (error) {
    console.error("❌ 로그인 오류:", error);
  }
}

async function testUserSearch() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("❌ 토큰이 없어서 사용자 검색을 할 수 없습니다.");
    return;
  }

  console.log("🔍 사용자 검색 테스트...");

  try {
    // 사용자 검색 테스트
    const response = await fetch("http://localhost:8080/users/search?q=user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("사용자 검색 응답:", response.status, response.statusText);

    if (response.ok) {
      const users = await response.json();
      console.log("✅ 사용자 검색 성공:", users);
    } else {
      const errorText = await response.text();
      console.log("❌ 사용자 검색 실패:", errorText);
    }
  } catch (error) {
    console.error("❌ 사용자 검색 오류:", error);
  }
}

// 3. 백엔드에 없을 수도 있는 사용자 검색 API 임시 구현
// UserService.java에 추가할 메서드들

/*
// UserService.java에 추가
@Transactional(readOnly = true)
public List<UserDTO> searchUsersByName(String query) {
    log.info("사용자 검색: query='{}'", query);
    
    try {
        // 🔥 실제 DB 검색 (이름으로)
        List<User> users = userRepository.findByNameContainingIgnoreCase(query);
        
        // DTO 변환
        List<UserDTO> userDTOs = users.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
            
        log.info("검색 결과: {}명", userDTOs.size());
        return userDTOs;
        
    } catch (Exception e) {
        log.error("사용자 검색 실패: {}", e.getMessage(), e);
        throw new RuntimeException("사용자 검색 중 오류가 발생했습니다.");
    }
}

private UserDTO convertToDTO(User user) {
    return UserDTO.builder()
        .id(user.getId())
        .name(user.getName())
        .email(user.getEmail())
        .employeeId(user.getEmployeeId())
        .department(user.getDepartment())
        .position(user.getPosition())
        .role(user.getRole())
        .build();
}
*/

/*
// UserRepository.java에 추가할 메서드
public interface UserRepository extends JpaRepository<User, String> {
    
    // 이름으로 검색 (대소문자 무시)
    List<User> findByNameContainingIgnoreCase(String name);
    
    // ID 또는 이름으로 검색
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.id) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<User> searchByNameOrId(@Param("query") String query);
}
*/

// 4. 즉시 실행
quickLoginAndTest();

console.log("\n🛠️  사용 가능한 함수들:");
console.log("quickLoginAndTest() - 빠른 로그인 및 테스트");
console.log("tryLogin() - 로그인 시도");
console.log("testUserSearch() - 사용자 검색 테스트");

// 5. 프론트엔드에서 실제 사용자 정보 입력받기
function setUserCredentials() {
  const userId = prompt("사용자 ID를 입력하세요:");
  const password = prompt("비밀번호를 입력하세요:");

  if (userId && password) {
    console.log("입력된 정보로 로그인 시도...");

    fetch("http://localhost:8080/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: userId,
        pass: password,
      }),
    })
      .then((response) => {
        console.log("로그인 응답:", response.status);
        return response.json();
      })
      .then((data) => {
        console.log("로그인 결과:", data);
        if (data.token) {
          localStorage.setItem("token", data.token);
          console.log(
            "✅ 토큰 저장 완료! 이제 채널/DM 기능을 사용할 수 있습니다."
          );
        }
      })
      .catch((error) => console.error("로그인 실패:", error));
  }
}

console.log("\n실제 계정으로 로그인하려면: setUserCredentials() 실행");
