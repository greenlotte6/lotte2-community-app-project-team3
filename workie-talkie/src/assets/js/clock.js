export function initClock() {
  const clockContainer = document.querySelector(".js-clock");
  if (!clockContainer) return;

  const dateTitle = clockContainer.querySelector(".currDate");
  const clockTitle = clockContainer.querySelector(".currTime");

  function getDate() {
    const date = new Date();
    const week = ["일", "월", "화", "수", "목", "금", "토"];
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayName = week[date.getDay()];
    dateTitle.innerText = `${year}년 ${month < 10 ? `0${month}` : month}월 ${
      day < 10 ? `0${day}일` : day
    } ${dayName}요일`;
  }

  function getTime() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    clockTitle.innerText =
      `${hours < 10 ? `0${hours}` : hours}:` +
      `${minutes < 10 ? `0${minutes}` : minutes}:` +
      `${seconds < 10 ? `0${seconds}` : seconds}`;
  }

  function updateTextSize() {
    const elements = [clockTitle, dateTitle];
    const targetWidthRatio = 0.5;
    elements.forEach((elem) => {
      let curFontSize = 20;
      for (let i = 0; i < 3; i++) {
        const parentWidth = elem.parentNode.offsetWidth;
        const textWidth = elem.offsetWidth;
        curFontSize *= targetWidthRatio / (textWidth / parentWidth);
        elem.style.fontSize = `${curFontSize}pt`;
      }
    });
  }

  getDate();
  getTime();
  updateTextSize();
  setInterval(getTime, 1000);
  window.addEventListener("resize", updateTextSize);
}
