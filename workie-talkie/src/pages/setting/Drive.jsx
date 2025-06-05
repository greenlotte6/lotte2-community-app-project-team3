import React from "react";
import { SettingLayout } from "../../layouts/SettingLayout";

export const Drive = () => {
  return (
    <SettingLayout>
      <main className="main-content" id="drive-container">
        <article className="main-content">
          <div className="title">
            <h1>드라이브 설정</h1>
          </div>

          <div className="drive">
            <div className="setting1">
              <h3>기본 설정</h3>
              <div className="list1">
                <section>
                  <p> 파일 정렬 기준</p>
                  <label className="order">
                    <select name="order" id="order">
                      <option value="name">이름순</option>
                      <option value="regDate">날짜순</option>
                      <option value="size">크기순</option>
                    </select>
                  </label>
                </section>
                <section>
                  <p> 기본보기 방식</p>
                  <label className="view">
                    <select name="view" id="view">
                      <option value="list">목록</option>
                      <option value="grid">그리드</option>
                    </select>
                  </label>
                </section>
              </div>
            </div>

            <h3>드라이브 정보</h3>
            <div className="setting2">
              <div className="list2">
                <section>
                  <p>
                    내 드라이브 용량 : <span>0.0KB</span>
                  </p>
                  <p>
                    사용 가능한 용량 : <span>5.0GB</span>
                  </p>
                </section>

                <section>
                  <p>유형</p>
                  <span>크기</span>
                </section>

                <section>
                  <p> 폴더 및 파일</p>
                  <span>0.0KB</span>
                </section>

                <section>
                  <p>휴지통</p>
                  <span>0.0KB</span>
                </section>
              </div>
            </div>
          </div>

          <div className="btn">
            <button>S A V E</button>
          </div>
        </article>
      </main>
    </SettingLayout>
  );
};
