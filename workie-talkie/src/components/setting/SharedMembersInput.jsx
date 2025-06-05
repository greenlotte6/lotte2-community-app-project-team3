import React, { useState } from "react";

export const SharedMembersInput = ({
  sharedMembers, // 부모 컴포넌트로부터 현재 멤버 리스트를 받음
  setSharedMembers, // 부모 컴포넌트로부터 멤버 리스트를 업데이트할 함수를 받음
}) => {
  const [newMemberInput, setNewMemberInput] = useState(""); // 현재 컴포넌트 내부에서만 관리될 입력 상태

  const handleAddMember = (event) => {
    if (event.key === "Enter" && newMemberInput.trim() !== "") {
      event.preventDefault();

      const value = newMemberInput.trim();

      if (sharedMembers.includes(value)) {
        alert("이미 추가된 멤버입니다.");
        setNewMemberInput("");
        return;
      }

      // 부모로부터 받은 setSharedMembers 함수를 사용하여 멤버 리스트 업데이트
      setSharedMembers([...sharedMembers, value]);
      setNewMemberInput("");
    }
  };

  const handleRemoveMember = (valueToRemove) => {
    // 부모로부터 받은 setSharedMembers 함수를 사용하여 멤버 리스트 업데이트
    setSharedMembers(sharedMembers.filter((item) => item !== valueToRemove));
  };

  return (
    <div id="memberInputContainer">
      {" "}
      {/* 이 ID는 CSS에 사용될 수 있으니 유지 */}
      <div className="hidden">
        {" "}
        {/* 이 클래스도 CSS에 사용될 수 있으니 유지 */}
        <h4>공유할 멤버</h4>
        <input
          type="text"
          id="memberInput"
          style={{ width: "100%" }}
          placeholder="이메일 또는 아이디 입력 후 Enter"
          value={newMemberInput}
          onChange={(e) => setNewMemberInput(e.target.value)}
          onKeyDown={handleAddMember}
        />
      </div>
      <div id="memberTagContainer">
        {" "}
        {/* 이 ID도 CSS에 사용될 수 있으니 유지 */}
        {sharedMembers.map((member, index) => (
          <div
            key={index}
            className="tag"
            style={{
              border: "1px solid #dfdfdf",
              borderRadius: "20px",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              flexDirection: "row-reverse",
              height: "30px",
              paddingRight: "7px",
              marginRight: "5px",
              marginBottom: "5px",
            }}
          >
            {member}
            <span
              style={{
                marginLeft: "8px",
                cursor: "pointer",
                color: "#999",
              }}
              onClick={() => handleRemoveMember(member)}
            >
              ×
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
