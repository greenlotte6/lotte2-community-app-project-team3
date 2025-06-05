import React, { useEffect } from "react";
import { Header } from "../../components/common/Header";
import { Footer } from "../../components/common/Footer";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { initClock } from "../../assets/js/clock";

export const Dashboard = () => {
  useEffect(() => {
    // clock.js 직접 삽입 방식으로 대체
    const script = document.createElement("script");
    script.src = "/js/clock.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <DashboardLayout>
      <main class="main-content">
        <article class="main-content">
          <div class="dashboard">
            <div class="top">
              <section class="part1">
                <div class="profile">
                  <section class="profile-image">
                    <img src="/images/profile1.png" alt="" />
                  </section>
                  <section class="profile-info">
                    <div>
                      <p>
                        Welcome! <span>김팀장</span> 님{" "}
                      </p>
                      <p>(관리자)</p>
                    </div>
                  </section>
                </div>

                <div class="time">
                  <div class="js-clock">
                    <span class="currDate"></span>
                    <span class="currTime"></span>
                  </div>
                </div>
              </section>
              <section class="part2">
                <div class="projects">
                  <h2>✅진행중인 프로젝트</h2>
                  <div class="lists">
                    <div class="project-list">
                      <article>
                        <div class="title">
                          <p>
                            [<span>프로젝트명</span>]
                          </p>
                        </div>
                        <div class="period">
                          <p>
                            <span>2025.06.03</span> ~ <span>2025.06.30</span>
                          </p>
                        </div>
                        <div class="info">
                          <p>담당자</p>
                          <p>프로젝트 내용입니다</p>
                        </div>
                      </article>
                    </div>
                    <div class="project-list">
                      <article>
                        <div class="title">
                          <p>
                            [<span>프로젝트명</span>]
                          </p>
                        </div>
                        <div class="period">
                          <p>
                            <span>2025.06.03</span> ~ <span>2025.06.30</span>
                          </p>
                        </div>
                        <div class="info">
                          <p>담당자</p>
                          <p>내용</p>
                        </div>
                      </article>
                    </div>
                    <div class="project-list">
                      <article>
                        <div class="title">
                          <p>
                            [<span>프로젝트명</span>]
                          </p>
                        </div>
                        <div class="period">
                          <p>
                            <span>2025.06.03</span> ~ <span>2025.06.30</span>
                          </p>
                        </div>
                        <div class="info">
                          <p>담당자</p>
                          <p>내용</p>
                        </div>
                      </article>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <section class="part3">
              <div class="notices1">
                <h2>📢공지사항</h2>
                <article>
                  <div class="title">
                    <span>[공지사항]</span>
                    <span>제목</span>
                  </div>
                  <div class="content">
                    <p>내용</p>
                  </div>
                  <div class="info">
                    <span>2025.06.03</span>
                    <span>10</span>
                    <span>29</span>
                  </div>
                </article>
                <article>
                  <div class="title">
                    <span>[공지사항]</span>
                    <span>제목</span>
                  </div>
                  <div class="content">
                    <p>내용</p>
                  </div>
                  <div class="info">
                    <span>2025.06.03</span>
                    <span>10</span>
                    <span>29</span>
                  </div>
                </article>
                <article>
                  <div class="title">
                    <span>[공지사항]</span>
                    <span>제목</span>
                  </div>
                  <div class="content">
                    <p>내용</p>
                  </div>
                  <div class="info">
                    <span>2025.06.03</span>
                    <span>10</span>
                    <span>29</span>
                  </div>
                </article>
              </div>
              <div class="notices2">
                <h2>📅다가오는 일정</h2>
                <h3>오늘</h3>
                <article>
                  <div class="title">
                    <span>일정1</span>
                  </div>
                  <div class="dates">
                    <p>
                      <span>2025.06.03</span> ~ <span>2025.06.30</span>
                    </p>
                  </div>
                  <div class="info">
                    <p>일정 설명</p>
                  </div>
                </article>
                <h3>내일</h3>
                <article>
                  <div class="title">
                    <span>일정1</span>
                  </div>
                  <div class="dates">
                    <p>
                      <span>2025.06.03</span> ~ <span>2025.06.30</span>
                    </p>
                  </div>
                  <div class="info">
                    <p>일정 설명</p>
                  </div>
                </article>
                <article>
                  <div class="title">
                    <span>일정1</span>
                  </div>
                  <div class="dates">
                    <p>
                      <span>2025.06.03</span> ~ <span>2025.06.30</span>
                    </p>
                  </div>
                  <div class="info">
                    <p>일정 설명</p>
                  </div>
                </article>
              </div>
              <div class="notices3"></div>
            </section>
          </div>
        </article>
      </main>
    </DashboardLayout>
  );
};
