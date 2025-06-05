export function initHidden() {
  function handleShareScopeChange() {
    const shareSelect = document.getElementById("shareScope");

    // 기존 멤버 입력 컨테이너 제거
    const existing = document.getElementById("memberInputContainer");
    if (existing) {
      existing.remove();
    }

    if (shareSelect.value === "member") {
      const container = document.createElement("div");
      container.id = "memberInputContainer";
      container.innerHTML = `
                    <div class="hidden">                    
                        <h4>공유할 멤버</h4>
                        <input type="text" id="memberInput"  style="width:100%;" placeholder="이메일 또는 아이디 입력 후 Enter"
                            onkeydown="addMember(event)" />
                    </div>

                    <div id="memberTagContainer"></div>
                `;

      // 🔽 공유 범위 select 요소의 부모의 부모 (div.body)를 기준으로 적절한 위치에 삽입
      const body = document.querySelector(".body");

      // 공유 범위 select 다음에 삽입할 위치 찾기
      const shareScopeDiv = shareSelect.closest("div");
      body.insertBefore(container, shareScopeDiv.nextSibling);
    }
  }
}
