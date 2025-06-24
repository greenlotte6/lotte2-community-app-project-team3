import { useEffect, useState } from "react";
import { BoardLayout } from "../../layouts/BoardLayout";
import { useParams } from "react-router-dom";
import {
  deleteComment,
  getArticle,
  getComments,
  postComment,
  putComment,
} from "../../api/boardAPI";

export const BoardView = () => {
  const { category, ano } = useParams(); // URL에서 ano 값을 가져옵니다.
  const [board, setBoard] = useState(null); // 게시물 데이터를 저장할 상태
  const [comments, setComments] = useState([]); // 댓글 데이터를 저장할 상태
  const [commentContent, setCommentContent] = useState(""); // 댓글 입력 상태

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await getArticle(category, ano); // 게시물 데이터 가져오기
        setBoard(response);
      } catch (error) {
        console.error("게시물 조회 실패:", error);
      }
    };
    fetchBoard();
  }, [category, ano]); // ano 값이 변경될 때마다 fetchBoard 함수가 실행됩니다.

  //댓글
  useEffect(() => {
    const fetchComment = async () => {
      try {
        const response = await getComments(ano);
        setComments(response);
      } catch (error) {
        console.error("댓글 불러오기 실패:", error);
      }
    };

    fetchComment();
  }, [ano]);

  const commentHandler = (e) => {
    setCommentContent(e.target.value);
  };

  const submitCommentHandler = async () => {
    if (!commentContent.trim()) {
      alert("댓글을 입력 해주세요.");
      return;
    }

    const newComment = {
      content: commentContent,
      ano: ano,
    };

    try {
      await postComment(ano, newComment);
      setCommentContent("");

      const updatedComments = await getComments(ano);
      setComments(updatedComments);
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      alert("댓글 작성에 실패했습니다.");
    }
  };

  const deleteCommentHandler = async (cno) => {
    try {
      await deleteComment(cno);
      const updatedComments = await getComments(ano);
      setComments(updatedComments);
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      alert("댓글을 삭제할 수 없습니다.");
    }
  };

  const updateCommentHandler = async (cno) => {
    try {
      await putComment(cno);
      const updatedComments = await getComments(ano);
      setComments(updatedComments.data);
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      alert("댓글을 수정할 수 없습니다.");
    }
  };

  if (!board) {
    return <p>게시물을 불러오는 중...</p>; // 게시물 데이터가 없으면 로딩 중 메시지 표시
  }

  return (
    <BoardLayout>
      <main className="main-content" id="board-view">
        <article className="main-area">
          <div className="board-view">
            <h1>{board.title}</h1>
            <p className="board-meta">
              <span>작성자: {board.writer}</span>
              <span>작성일: {new Date(board.wDate).toLocaleDateString()}</span>
              <span>댓글: {board.comments || 0}</span>
              <span>조회수: {board.views || 0}</span>
            </p>
            <div className="board-content">
              <div dangerouslySetInnerHTML={{ __html: board.content }} />
            </div>
          </div>

          {/* 댓글 및 관련 기능 추가 가능 */}
          <div className="comments">
            <h3>댓글</h3>
            {Number(board.commented) === 0 ? (
              <p>댓글을 사용할 수 없습니다.</p>
            ) : (
              <ul>
                {comments.length === 0 ? (
                  <li>댓글이 없습니다.</li>
                ) : (
                  comments.map((comment, index) => (
                    <li key={index}>
                      <p>{comment.writer}</p>
                      <p>{comment.content}</p>
                      <p>{comment.regDate}</p>
                      <button onClick={() => deleteCommentHandler(comment.cno)}>
                        삭제
                      </button>
                      <button
                        onClick={() =>
                          updateCommentHandler(comment.cno, "새로운 내용")
                        }
                      >
                        수정
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}

            {/* 댓글 작성 폼 */}
            {Number(board.commented) === 1 && (
              <div className="comment-form">
                <textarea
                  value={commentContent}
                  onChange={commentHandler}
                  placeholder="댓글을 작성하세요"
                />
                <button onClick={submitCommentHandler}>댓글 작성</button>
              </div>
            )}
          </div>
        </article>
      </main>
    </BoardLayout>
  );
};
