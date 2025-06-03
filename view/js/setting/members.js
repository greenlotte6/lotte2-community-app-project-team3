let sharedMembers = [];

function addMember(event) {
  const input = document.getElementById("memberInput");
  const container = document.getElementById("memberTagContainer");

  if (event.key === "Enter" && input.value.trim() !== "") {
    event.preventDefault(); // form 제출 방지
    const value = input.value.trim();

    // 중복 체크
    if (sharedMembers.includes(value)) {
      alert("이미 추가된 멤버입니다.");
      input.value = "";
      return;
    }

    sharedMembers.push(value);

    const tag = document.createElement("div");
    tag.className = "tag";
    tag.style.cssText = `
                    border: 1px solid #dfdfdf;
                    border-radius: 20px;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    flex-direction: row-reverse;
                    height: 30px;
                    padding-right: 7px;
                `;
    tag.innerHTML = `
                    ${value}
                    <span style="margin-left:8px; cursor:pointer; color: #999;" onclick="removeMember('${value}', this)">×</span>
                `;

    container.appendChild(tag);
    input.value = "";
  }
}

function removeMember(value, element) {
  sharedMembers = sharedMembers.filter((item) => item !== value);
  element.parentElement.remove();
}
