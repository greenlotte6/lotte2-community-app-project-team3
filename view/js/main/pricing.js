// 월간/연간 토글 기능
document.querySelectorAll(".toggle-label").forEach((label) => {
  label.addEventListener("click", function () {
    const billing = this.dataset.billing;

    // 토글 버튼 상태 변경
    document
      .querySelectorAll(".toggle-label")
      .forEach((l) => l.classList.remove("active"));
    this.classList.add("active");

    // 가격 및 텍스트 변경
    const monthlyElements = document.querySelectorAll(".monthly");
    const annuallyElements = document.querySelectorAll(".annually");

    if (billing === "monthly") {
      monthlyElements.forEach((el) => (el.style.display = "block"));
      annuallyElements.forEach((el) => (el.style.display = "none"));
    } else {
      monthlyElements.forEach((el) => (el.style.display = "none"));
      annuallyElements.forEach((el) => (el.style.display = "block"));
    }
  });
});
