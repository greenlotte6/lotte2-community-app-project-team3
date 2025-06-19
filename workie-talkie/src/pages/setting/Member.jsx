import React, { useEffect, useState } from "react";
import axios from "axios";
import { SettingLayout } from "../../layouts/SettingLayout";
import { useLoginStore } from "../../stores/useLoginStore";
import { useNavigate } from "react-router-dom";
import { getMembers, putMembers } from "../../api/userAPI";
import { SETTING_MEMBERS } from "../../api/http";

export const Member = () => {
  const [showModal, setShowModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [members, setMembers] = useState([]);

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

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getMembers();
        setMembers(data);
      } catch (err) {
        console.error("멤버 불러오기 실패", err);
      }
    };

    fetchMembers();
  }, []);

  //초대하기 모달
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

  //유저정보 변경하기
  const handleSave = async (member) => {
    try {
      await putMembers(member);
      alert("수정 완료!");
    } catch (err) {
      alert("수정 실패");
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
                      <th>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member, idx) => (
                      <tr key={member.id}>
                        <td>{member.id}</td>
                        <td>{member.name}</td>
                        <td>{member.ssn}</td>
                        <td>{member.hp}</td>
                        <td>{member.office}</td>
                        {/* ✅ 직급 select */}
                        <td>
                          <select
                            value={member.position}
                            onChange={(e) => {
                              const updated = [...members];
                              updated[idx].position = e.target.value;
                              setMembers(updated);
                            }}
                          >
                            <option value="사원">사원</option>
                            <option value="대리">대리</option>
                            <option value="과장">과장</option>
                            <option value="차장">차장</option>
                            <option value="부장">부장</option>
                            <option value="CEO">CEO</option>
                          </select>
                        </td>

                        {/* ✅ 권한 select */}
                        <td>
                          <select
                            value={member.role}
                            onChange={(e) => {
                              const updated = [...members];
                              updated[idx].role = e.target.value;
                              setMembers(updated);
                            }}
                          >
                            <option value="ADMIN">ADMIN</option>
                            <option value="MEMBER">MEMBER</option>
                            <option value="MASTER">MASTER</option>
                          </select>
                        </td>
                        <td>{member.regDate?.substring(0, 10)}</td>

                        {/* ✅ 저장 버튼 */}
                        <td>
                          <button
                            className="infoBtn"
                            onClick={() => handleSave(member)}
                          >
                            <img src="/images/save.png" alt="저장버튼" />
                          </button>
                        </td>
                      </tr>
                    ))}
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
