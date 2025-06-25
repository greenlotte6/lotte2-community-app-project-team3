import React, { use, useEffect, useState } from "react";
import { initClock } from "../../assets/js/clock";
import { MainLayout } from "../../layouts/MainLayout";
import { useLoginStore } from "../../stores/useLoginStore";
import { useNavigate } from "react-router-dom";
import { getRecent } from "../../api/boardAPI";
import { format } from "date-fns";
import { getUpcomingEvents } from "../../api/userAPI";

/* 
로그인 정보를 사용하려면 다음처럼 꺼냅니다:
import { useLoginStore } from "../../stores/useLoginStore";

const username = useLoginStore((state) => state.user?.username); 
*/

export const Main = () => {
  const [recentBoards, setRecentBoards] = useState([]);
  const [events, setEvents] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const user = useLoginStore((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    initClock();

    return () => {
      window.removeEventListener("resize", initClock);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/user/login");
    }
    if (user) {
      getRecent()
        .then(setRecentBoards)
        .catch((err) => console.error(err));

      getUpcomingEvents() // 💥 여기서 오류나는 경우가 많음
        .then((data) => {
          if (Array.isArray(data)) {
            setEvents(data);
          } else {
            console.warn("❗서버에서 받은 일정 데이터가 배열이 아님:", data);
            setEvents([]);
          }
        })
        .catch((err) => console.error("🛑 일정 데이터 로드 실패:", err));
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 글자 수 제한을 설정하는 로직 (창 크기에 따라 다르게 설정)
  const getContentLimit = () => {
    if (windowWidth > 1200) {
      return 120; // 큰 화면에서는 100글자까지
    } else if (windowWidth > 800) {
      return 20; // 중간 화면에서는 75글자까지
    } else {
      return 10; // 작은 화면에서는 50글자까지
    }
  };

  return user ? (
    <MainLayout>
      <main className="main-content" id="dashboard-container">
        <article className="main-content">
          <div className="dashboard">
            <div className="top">
              <section className="part1">
                <div className="profile">
                  <section className="profile-image">
                    <img src="/images/profile1.png" alt="" />
                  </section>
                  <section className="profile-info">
                    <div>
                      <p>
                        Welcome! <span>{user?.name}</span> 님
                      </p>
                      <p>({user?.position})</p>
                    </div>
                  </section>
                </div>

                <div className="time">
                  <div className="js-clock">
                    <span className="currDate"></span>
                    <span className="currTime"></span>
                  </div>
                </div>
              </section>
              <section className="part2">
                <div className="projects">
                  <h2>✅진행중인 프로젝트</h2>
                  <div className="lists">
                    <div className="project-list">
                      <article>
                        <div className="title">
                          <p>
                            [<span> 프로젝트명</span>]
                          </p>
                        </div>
                        <div className="period">
                          <p>
                            <span>2025.06.03</span> ~ <span>2025.06.30</span>
                          </p>
                        </div>
                        <div className="info">
                          <p>담당자</p>
                          <p>프로젝트 내용입니다</p>
                        </div>
                        <div className="percentage">
                          <div className="progress-bar-container">
                            {/* 막대 전체 영역 */}
                            <div
                              className="progress-bar-filler"
                              style={{ width: "50%" }} // 여기에 진행률을 동적으로 설정
                            ></div>
                          </div>
                          <span>50%</span> {/* 숫자 텍스트는 그대로 유지 */}
                        </div>
                      </article>
                    </div>
                    <div className="project-list">
                      <article>
                        <div className="title">
                          <p>
                            [<span> 프로젝트명</span>]
                          </p>
                        </div>
                        <div className="period">
                          <p>
                            <span>2025.06.03</span> ~ <span>2025.06.30</span>
                          </p>
                        </div>
                        <div className="info">
                          <p>담당자</p>
                          <p>내용</p>
                        </div>
                        <div className="percentage">
                          <div className="progress-bar-container">
                            {" "}
                            {/* 막대 전체 영역 */}
                            <div
                              className="progress-bar-filler"
                              style={{ width: "50%" }} // 여기에 진행률을 동적으로 설정
                            ></div>
                          </div>
                          <span>50%</span> {/* 숫자 텍스트는 그대로 유지 */}
                        </div>
                      </article>
                    </div>
                    <div className="project-list">
                      <article>
                        <div className="title">
                          <p>
                            [<span> 프로젝트명</span>]
                          </p>
                        </div>
                        <div className="period">
                          <p>
                            <span>2025.06.03</span> ~ <span>2025.06.30</span>
                          </p>
                        </div>
                        <div className="info">
                          <p>담당자</p>
                          <p>내용</p>
                        </div>
                        <div className="percentage">
                          <div className="progress-bar-container">
                            {/* 막대 전체 영역 */}
                            <div
                              className="progress-bar-filler"
                              style={{ width: "50%" }} // 여기에 진행률을 동적으로 설정
                            ></div>
                          </div>
                          <span>50%</span> {/* 숫자 텍스트는 그대로 유지 */}
                        </div>
                      </article>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <section className="part3">
              <div className="notices1">
                <h2>🆕 NEW</h2>
                {recentBoards.length === 0 ? (
                  <p>게시글이 없습니다.</p>
                ) : (
                  recentBoards.map((board, idx) => (
                    <article key={idx}>
                      <div className="title">
                        <span>
                          [
                          {board.category === "notice"
                            ? "공지사항"
                            : board.category === "free"
                            ? "자유게시판"
                            : board.category === "menu"
                            ? "식단표"
                            : "알 수 없는 카테고리"}
                          ]
                        </span>
                        <span>{board.title}</span>
                      </div>
                      <div className="content">
                        <p>
                          {board.content
                            .replace(/<p>/g, "") // <p> 태그 제거
                            .replace(/<\/p>/g, "") // </p> 태그 제거
                            .replace(/<strong>/g, "") // </p> 태그 제거
                            .replace(/<\/strong>/g, "") // </p> 태그 제거
                            .substr(0, getContentLimit()) +
                            (board.content.length > getContentLimit()
                              ? "..."
                              : "")}
                        </p>
                      </div>
                      <div className="info">
                        <span>
                          {new Date(board.wDate).toLocaleDateString()}
                        </span>
                        <span>{board.views}</span>
                        <span>{board.comments}</span>
                      </div>
                    </article>
                  ))
                )}
              </div>
              <div className="notices2">
                <h2>📅다가오는 일정</h2>
                {events.length === 0 ? (
                  <p>일정이 없습니다.</p>
                ) : (
                  events.map((event, idx) => (
                    <article key={idx}>
                      <h3>{event.title}</h3>
                      <p>
                        📆 : {format(new Date(event.startDate), "yyyy.MM.dd")} ~{" "}
                        {format(new Date(event.endDate), "yyyy.MM.dd")}
                      </p>
                      <p>✏️ : {event.description}</p>
                    </article>
                  ))
                )}
              </div>
              <div className="notices3"></div>
            </section>
          </div>
        </article>
      </main>
    </MainLayout>
  ) : null;
};
