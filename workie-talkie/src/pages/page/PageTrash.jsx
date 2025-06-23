import React, { useEffect, useState } from "react"; // useEffect 훅을 임포트
import { MainLayout } from "../../layouts/MainLayout";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Aside } from "../../components/page/Aside";
import { deletePageByPno, getPage, recoveryPage } from "../../api/userAPI";
import { useLoginStore } from "../../stores/useLoginStore";

export const PageTrash = () => {
  const user = useLoginStore((state) => state.user);
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // 2자리
    const day = ("0" + date.getDate()).slice(-2);
    let hour = date.getHours();
    const minute = ("0" + date.getMinutes()).slice(-2);
    const second = ("0" + date.getSeconds()).slice(-2);
    const period = hour < 12 ? "오전" : "오후";
    hour = hour % 12 || 12; // 12시간제로 변환

    return `${year}-${month}-${day} ${period} ${hour}:${minute}:${second}`;
  };

  useEffect(() => {
    if (!user) {
      navigate("/user/login");
      return;
    }

    getPage()
      .then((data) => {
        console.log(data);
        setPages(data);
      })
      .catch((err) => {
        console.log(err);
        console.error("페이지 불러오기 실패", err);
      });
  }, [user, navigate]);

  //휴지통에서 복구
  const recoveryHandler = async (pno) => {
    console.log("recoveryHandler 호출, pno:", pno);

    const target = pages.find((p) => p.pno === pno);
    if (!target) return;

    const updatedDeleted = !target.recover;

    const updatedPages = pages.map((page) =>
      page.pno === pno ? { ...page, delete: updatedDeleted } : page
    );
    setPages(updatedPages);

    if (window.confirm("이 페이지를 복구하시겠습니까?")) {
      try {
        const requestData = { pno, deleted: updatedDeleted };
        console.log("전달할 데이터(1) : ", requestData);

        await recoveryPage(pno);
        console.log("페이지 복구 반영 완료!");
        alert("페이지가 복구되었습니다.");
        navigate("/page");
      } catch (err) {
        console.error("페이지 복구 중 오류", err);
        alert("페이지 복구 중 오류가 발생했습니다.");
      }
    }
  };

  //휴지통에서 삭제
  const deleteHandler = async (pno) => {
    console.log("deleteHandler 호출, pno:", pno);

    const target = pages.find((p) => p.pno === pno);

    if (!target) return;

    const updatedDeleted = !target.delete;

    const updatedPages = pages.map((page) =>
      page.pno === pno ? { ...page, delete: updatedDeleted } : page
    );
    setPages(updatedPages);

    if (window.confirm("정말 이 노트를 삭제하시겠습니까?")) {
      try {
        const requestData = { pno, delete: updatedDeleted };
        console.log("전달할 데이터(2) : ", requestData);

        await deletePageByPno(pno); // ✅ API 호출
        alert("페이지가 삭제되었습니다.");
        navigate("/page");
      } catch (err) {
        console.error("❌ 페이지 삭제 중 오류", err);
        alert("노트 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  return user ? (
    <MainLayout>
      <main className="main-content" id="page">
        <div className="main-content-wrapper">
          <div className="notion-style-sidebar">
            <Aside />
          </div>

          <div className="main-editor-area">
            <div className="page-header">
              <h1>휴지통</h1>
            </div>
            <h3>삭제한 페이지</h3>
            <div className="page-grid">
              {pages
                .filter((page) => page.deleted)
                .map((page) => (
                  <Link
                    to={`/page/${page.pno}`}
                    className="page-card tooltip-wrapper"
                    key={page.pno}
                  >
                    <div className="card-header">
                      <div className="status-bar">
                        <button
                          className="recovery"
                          onClick={(e) => {
                            e.preventDefault(); // 중요
                            e.stopPropagation();
                            recoveryHandler(page.pno);
                          }}
                        >
                          <img src="/images/recovery.png" alt="복구" />
                        </button>
                        <button
                          className="delete-btn"
                          onClick={(e) => {
                            e.preventDefault(); // 중요
                            e.stopPropagation();
                            deleteHandler(page.pno);
                          }}
                        >
                          <img src="/images/trashcan.png" alt="삭제" />
                        </button>
                      </div>
                      <h3>{page.title}</h3>
                    </div>

                    {/* 툴팁용 숨겨진 정보 */}
                    <div className="tooltip-content">
                      <p>제목: {page.title}</p>
                      <p>작성자: {page.writer}</p>
                      <p>수정일: {formatDateTime(page.modDate)}</p>
                      <div className="tag-list">
                        {page.tags?.map((tag, idx) => (
                          <span className="tag" key={idx}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  ) : null;
};
