import React from "react";
import { SettingLayout } from "../../layouts/SettingLayout";
import { Link } from "react-router-dom";

export const AutoMessage = () => {
  return (
    <SettingLayout>
      <main className="main-content" id="auto-container">
        <article className="main-content">
          <div className="title">
            <h1>메시지 설정</h1>
          </div>

          <div className="notification">
            <Link to={"/setting/message"}>
              <h3>자동응답 메시지</h3>
            </Link>
            <div className="setting1">
              <div className="list1">
                <section>
                  자동응답 메시지 설정
                  <label className="switch">
                    <input type="checkbox" checked />
                    <span className="slider round"></span>
                  </label>
                </section>
                <section>
                  내용
                  <label>
                    <input
                      name="message"
                      type="text"
                      placeholder="내용을 입력하세요."
                    />
                  </label>
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
