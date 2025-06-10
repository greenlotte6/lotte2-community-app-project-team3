import React, { useEffect } from "react";
import { initClock } from "../../assets/js/clock";
import { MainLayout } from "../../layouts/MainLayout";
import { useLoginStore } from "../../stores/useLoginStore";
import { useNavigate } from "react-router-dom";

/* 
로그인 정보를 사용하려면 다음처럼 꺼냅니다:
import { useLoginStore } from "../../stores/useLoginStore";

const username = useLoginStore((state) => state.user?.username); 
*/

export const Main = () => {
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
  }, [user]);

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
                  </div>
                </div>
              </section>
            </div>

            <section className="part3">
              <div className="notices1">
                <h2>📢공지사항</h2>
                <article>
                  <div className="title">
                    <span>[공지사항]</span>
                    <span>제목</span>
                  </div>
                  <div className="content">
                    <p>내용</p>
                  </div>
                  <div className="info">
                    <span>2025.06.03</span>
                    <span>10</span>
                    <span>29</span>
                  </div>
                </article>
                <article>
                  <div className="title">
                    <span>[공지사항]</span>
                    <span>제목</span>
                  </div>
                  <div className="content">
                    <p>내용</p>
                  </div>
                  <div className="info">
                    <span>2025.06.03</span>
                    <span>10</span>
                    <span>29</span>
                  </div>
                </article>
                <article>
                  <div className="title">
                    <span>[공지사항]</span>
                    <span>제목</span>
                  </div>
                  <div className="content">
                    <p>내용</p>
                  </div>
                  <div className="info">
                    <span>2025.06.03</span>
                    <span>10</span>
                    <span>29</span>
                  </div>
                </article>
              </div>
              <div className="notices2">
                <h2>📅다가오는 일정</h2>
                <h3>오늘</h3>
                <article>
                  <div className="title">
                    <span>일정1</span>
                  </div>
                  <div className="dates">
                    <p>
                      <span>2025.06.03</span> ~ <span>2025.06.30</span>
                    </p>
                  </div>
                  <div className="info">
                    <p>일정 설명</p>
                  </div>
                </article>
                <h3>내일</h3>
                <article>
                  <div className="title">
                    <span>일정1</span>
                  </div>
                  <div className="dates">
                    <p>
                      <span>2025.06.03</span> ~ <span>2025.06.30</span>
                    </p>
                  </div>
                  <div className="info">
                    <p>일정 설명</p>
                  </div>
                </article>
                <article>
                  <div className="title">
                    <span>일정1</span>
                  </div>
                  <div className="dates">
                    <p>
                      <span>2025.06.03</span> ~ <span>2025.06.30</span>
                    </p>
                  </div>
                  <div className="info">
                    <p>일정 설명</p>
                  </div>
                </article>
              </div>
              <div className="notices3"></div>
            </section>
          </div>
        </article>
      </main>
    </MainLayout>
  ) : null;
};
