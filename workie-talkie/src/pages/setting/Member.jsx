import React, { useEffect, useState } from "react";
import axios from "axios";
import { SettingLayout } from "../../layouts/SettingLayout";
import { useLoginStore } from "../../stores/useLoginStore";
import { useNavigate } from "react-router-dom";

export const Member = () => {
  const [showModal, setShowModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const navigate = useNavigate();

  const user = useLoginStore((state) => state.user);
  console.log("user in Profile:", user);

  const id = user?.username;
  console.log("id: " + id);

  useEffect(() => {
    if (!user) {
      navigate("/user/login");
    }
  }, [user, navigate]);

  const handleInviteClick = () => {
    setShowModal(true);
  };

  const handleInviteSubmit = async () => {
    if (!inviteEmail.includes("@")) {
      alert("유효한 이메일을 입력해주세요.");
      return;
    }

    try {
      const res = await axios.post("/api/invite", { email: inviteEmail });
      alert("초대 이메일이 발송되었습니다.");
      setShowModal(false);
      setInviteEmail("");
    } catch (err) {
      alert("이메일 발송에 실패했습니다.");
      console.error(err);
    }
  };

  return user ? (
    <SettingLayout>
      <main className="main-content" id="member-container">
        <article className="main-content">
          <div className="title">
            <h1>회원관리</h1>
          </div>
          <div className="member-setting">
            <div className="member">
              <div className="head">
                <div>
                  <p>회원 목록, 회원 초대 및 회원 수정을 할 수 있습니다.</p>
                </div>
                <button onClick={handleInviteClick}>INVITE</button>
              </div>

              <div className="body">
                <table>
                  <thead>
                    <tr>
                      <th>아이디</th>
                      <th>이름</th>
                      <th>주민번호</th>
                      <th>휴대폰</th>
                      <th>사무실</th>
                      <th>직급</th>
                      <th>권한</th>
                      <th>가입날짜</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <p>kim0531</p>
                      </td>
                      <td>김팀장</td>
                      <td>123456-1234567</td>
                      <td>010-1234-1234</td>
                      <td>051-123-1234</td>
                      <td>팀장</td>
                      <td>ADMIN</td>
                      <td>2025.06.03</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </article>

        {/* 🔽 모달 UI */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>회원 초대</h2>
              <input
                type="email"
                placeholder="이메일 주소 입력"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <div className="modal-actions">
                <button onClick={handleInviteSubmit}>초대하기</button>
                <button onClick={() => setShowModal(false)}>취소</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </SettingLayout>
  ) : null;
};
