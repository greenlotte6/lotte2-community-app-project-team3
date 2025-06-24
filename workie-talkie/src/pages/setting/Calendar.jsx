import { SettingLayout } from "../../layouts/SettingLayout";

export const Calendar = () => {
  return (
    <SettingLayout>
      <main className="main-content" id="calendar-container">
        <article className="main-content">
          <div className="title">
            <h1>달력 설정</h1>
          </div>

          <div className="calendar">
            <h3>기본 설정</h3>
            <div className="setting2">
              <div className="list2">
                <section>
                  한 주의 시작
                  <section className="radios">
                    <label>
                      <input
                        name="startDay"
                        className="sunday"
                        type="radio"
                        value="sunday"
                      />
                      일요일
                    </label>
                    <label>
                      <input
                        name="startDay"
                        className="monday"
                        type="radio"
                        value="monday"
                      />
                      월요일
                    </label>
                  </section>
                </section>

                <section>
                  시간 표시
                  <section className="radios">
                    <label>
                      <input
                        name="time"
                        className="ampm"
                        type="radio"
                        value="ampm"
                      />
                      오전/오후
                    </label>
                    <label>
                      <input
                        name="time"
                        className="hours"
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

          <div className="btn">
            <button>S A V E</button>
          </div>
        </article>
      </main>
    </SettingLayout>
  );
};
