import React from "react";
import { MainLayout } from "../../layouts/MainLayout";

export const ProjectDetails = () => {
  return (
    <MainLayout>
      <div id="wrapper" className="project-details-container">
        <aside>
          <h2 className="sidebar-title">My Project</h2>
          <div className="project-list">
            <p>프로젝트명1</p>
            <p>프로젝트내용</p>
          </div>
          <div className="project-list">
            <p>프로젝트명1</p>
            <p>프로젝트내용</p>
          </div>
          <div className="project-list">
            <p>프로젝트명1</p>
            <p>프로젝트내용</p>
          </div>
        </aside>

        <main>
          <div className="kanban-header">
            <h1 className="kanban-title">Kanban Dashboard</h1>
            <div className="kanban-actions">
              <button className="search-btn" title="검색">
                🔍
              </button>
              <button className="add-btn" title="새 작업 추가">
                ➕
              </button>
            </div>
          </div>

          <div className="kanban-board">
            <div className="kanban-column todo">
              <div className="column-header">
                <div className="column-title">
                  <span className="column-name">To Do</span>
                  <span className="task-count">3</span>
                </div>
                <button className="column-menu">⋯</button>
              </div>

              <div className="task-list">
                <div className="task-card priority-high">
                  <div className="task-title">로그인 페이지 디자인 수정</div>
                  <div className="task-description">
                    사용자 피드백을 반영하여 로그인 페이지의 UI/UX를 개선합니다.
                  </div>
                  <div className="task-meta">
                    <div className="task-tags">
                      <span className="task-tag frontend">Frontend</span>
                      <span className="task-tag design">Design</span>
                    </div>
                    <div className="task-assignee">
                      <div className="assignee-avatar">김</div>
                      <span className="task-date">12/15</span>
                    </div>
                  </div>
                </div>

                <div className="task-card priority-medium">
                  <div className="task-title">데이터베이스 스키마 설계</div>
                  <div className="task-description">
                    새로운 기능을 위한 데이터베이스 테이블 구조를 설계합니다.
                  </div>
                  <div className="task-meta">
                    <div className="task-tags">
                      <span className="task-tag backend">Backend</span>
                    </div>
                    <div className="task-assignee">
                      <div className="assignee-avatar">이</div>
                      <span className="task-date">12/20</span>
                    </div>
                  </div>
                </div>

                <div className="task-card priority-low">
                  <div className="task-title">문서 업데이트</div>
                  <div className="task-description">
                    API 문서를 최신 버전으로 업데이트합니다.
                  </div>
                  <div className="task-meta">
                    <div className="task-tags">
                      <span className="task-tag">Documentation</span>
                    </div>
                    <div className="task-assignee">
                      <div className="assignee-avatar">박</div>
                      <span className="task-date">12/25</span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="add-task-btn">+ 새 작업 추가</button>
            </div>
            <div className="kanban-column progress">
              <div className="column-header">
                <div className="column-title">
                  <span className="column-name">In Progress</span>
                  <span className="task-count">2</span>
                </div>
                <button className="column-menu">⋯</button>
              </div>

              <div className="task-list">
                <div className="task-card priority-high">
                  <div className="task-title">결제 시스템 구현</div>
                  <div className="task-description">
                    PG사 연동을 통한 결제 기능을 개발 중입니다.
                  </div>
                  <div className="task-meta">
                    <div className="task-tags">
                      <span className="task-tag backend">Backend</span>
                      <span className="task-tag frontend">Frontend</span>
                    </div>
                    <div className="task-assignee">
                      <div className="assignee-avatar">최</div>
                      <span className="task-date">12/18</span>
                    </div>
                  </div>
                </div>

                <div className="task-card priority-medium">
                  <div className="task-title">모바일 반응형 작업</div>
                  <div className="task-description">
                    메인 페이지의 모바일 반응형을 구현하고 있습니다.
                  </div>
                  <div className="task-meta">
                    <div className="task-tags">
                      <span className="task-tag frontend">Frontend</span>
                    </div>
                    <div className="task-assignee">
                      <div className="assignee-avatar">정</div>
                      <span className="task-date">12/22</span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="add-task-btn">+ 새 작업 추가</button>
            </div>
            <div className="kanban-column review">
              <div className="column-header">
                <div className="column-title">
                  <span className="column-name">Review</span>
                  <span className="task-count">1</span>
                </div>
                <button className="column-menu">⋯</button>
              </div>

              <div className="task-list">
                <div className="task-card priority-medium">
                  <div className="task-title">사용자 권한 관리 기능</div>
                  <div className="task-description">
                    관리자 패널에서 사용자 권한을 관리할 수 있는 기능입니다.
                  </div>
                  <div className="task-meta">
                    <div className="task-tags">
                      <span className="task-tag backend">Backend</span>
                    </div>
                    <div className="task-assignee">
                      <div className="assignee-avatar">김</div>
                      <span className="task-date">12/16</span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="add-task-btn">+ 새 작업 추가</button>
            </div>
            <div className="kanban-column done">
              <div className="column-header">
                <div className="column-title">
                  <span className="column-name">Done</span>
                  <span className="task-count">4</span>
                </div>
                <button className="column-menu">⋯</button>
              </div>

              <div className="task-list">
                <div className="task-card priority-high">
                  <div className="task-title">회원가입 기능 완성</div>
                  <div className="task-description">
                    이메일 인증을 포함한 회원가입 시스템이 완료되었습니다.
                  </div>
                  <div className="task-meta">
                    <div className="task-tags">
                      <span className="task-tag backend">Backend</span>
                      <span className="task-tag frontend">Frontend</span>
                    </div>
                    <div className="task-assignee">
                      <div className="assignee-avatar">이</div>
                      <span className="task-date">12/10</span>
                    </div>
                  </div>
                </div>

                <div className="task-card priority-medium">
                  <div className="task-title">프로젝트 초기 설정</div>
                  <div className="task-description">
                    개발 환경 설정과 기본 프로젝트 구조가 완성되었습니다.
                  </div>
                  <div className="task-meta">
                    <div className="task-tags">
                      <span className="task-tag">Setup</span>
                    </div>
                    <div className="task-assignee">
                      <div className="assignee-avatar">박</div>
                      <span className="task-date">12/05</span>
                    </div>
                  </div>
                </div>

                <div className="task-card priority-low">
                  <div className="task-title">로고 디자인</div>
                  <div className="task-description">
                    브랜드 아이덴티티에 맞는 로고 디자인이 완료되었습니다.
                  </div>
                  <div className="task-meta">
                    <div className="task-tags">
                      <span className="task-tag design">Design</span>
                    </div>
                    <div className="task-assignee">
                      <div className="assignee-avatar">최</div>
                      <span className="task-date">12/08</span>
                    </div>
                  </div>
                </div>

                <div className="task-card priority-medium">
                  <div className="task-title">데이터베이스 구축</div>
                  <div className="task-description">
                    기본 테이블과 관계 설정이 완료되었습니다.
                  </div>
                  <div className="task-meta">
                    <div className="task-tags">
                      <span className="task-tag backend">Backend</span>
                    </div>
                    <div className="task-assignee">
                      <div className="assignee-avatar">정</div>
                      <span className="task-date">12/12</span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="add-task-btn">+ 새 작업 추가</button>
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
};
