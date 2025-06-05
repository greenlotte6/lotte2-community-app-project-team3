import React from "react";
import { SettingLayout } from "../../layouts/SettingLayout";

export const Calendar = () => {
  return (
    <SettingLayout>
      <main class="main-content">
        <article class="main-content">
          <div class="title">
            <h1>달력 설정</h1>
          </div>

          <div class="calendar">
            <h3>기본 설정</h3>
            <div class="setting2">
              <div class="list2">
                <section>
                  한 주의 시작
                  <section class="radios">
                    <label>
                      <input
                        name="startDay"
                        class="sunday"
                        type="radio"
                        value="sunday"
                      />
                      일요일
                    </label>
                    <label>
                      <input
                        name="startDay"
                        class="monday"
                        type="radio"
                        value="monday"
                      />
                      월요일
                    </label>
                  </section>
                </section>

                <section>
                  시간 표시
                  <section class="radios">
                    <label>
                      <input
                        name="time"
                        class="ampm"
                        type="radio"
                        value="ampm"
                      />
                      오전/오후
                    </label>
                    <label>
                      <input
                        name="time"
                        class="hours"
                        type="radio"
                        value="hours"
                      />
                      24시간
                    </label>
                  </section>
                </section>
              </div>
            </div>
          </div>

          <div class="btn">
            <button>S A V E</button>
          </div>
        </article>
      </main>
    </SettingLayout>
  );
};
