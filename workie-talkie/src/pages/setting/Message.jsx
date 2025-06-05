import React from "react";
import { SettingLayout } from "../../layouts/SettingLayout";
import { Link } from "react-router-dom";

export const Message = () => {
  return (
    <SettingLayout>
      <main className="main-content" id="message-container">
        <article className="main-content">
          <div className="title">
            <h1>메시지 설정</h1>
          </div>

          <div className="message-setting">
            <h3>기본 설정</h3>
            <div className="setting1">
              <div className="list1">
                <section>
                  글자 크기 옵션
                  <section className="radios">
                    <label>
                      <input
                        name="fontsize"
                        className="basic"
                        type="radio"
                        value="basic"
                      />
                      기본
                    </label>
                    <label>
                      <input
                        name="fontsize"
                        className="big"
                        type="radio"
                        value="big"
                      />
                      크게
                    </label>
                    <label>
                      <input
                        name="fontsize"
                        className="small"
                        type="radio"
                        value="small"
                      />
                      작게
                    </label>
                  </section>
                </section>
              </div>
            </div>

            <h3>메시지 자동응답</h3>
            <div className="setting2">
              <div className="list2">
                <section>
                  개인 메시지 자동응답
                  <label className="switch">
                    <Link to="/setting/autoMessage">
                      <input type="checkbox" />
                      <span className="slider round"></span>
                    </Link>
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
