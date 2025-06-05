export function initDelete() {
  function confirmDelete() {
    const confirmed = confirm("정말 삭제하시겠습니까?");
    if (confirmed) {
      // 실제 삭제 처리 로직이 있다면 여기에 추가
      // 예: 서버로 delete 요청 보내기 등

      //closeModal("modifyModal"); // 수정 모달 닫기
      alert("삭제되었습니다."); // 필요 시 사용자 알림
    }
  }
}
