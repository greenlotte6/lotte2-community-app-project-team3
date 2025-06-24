import { BoardLayout } from "../../layouts/BoardLayout";
import { Notices } from "../../components/board/Notices";
import { Frees } from "../../components/board/Frees";
import { News } from "../../components/board/News";
import { Menus } from "../../components/board/Menus";
import { useEffect, useState } from "react";
import {
  getFrees,
  getImportantNotices,
  getMenus,
  getNotices,
  getRecent,
} from "../../api/boardAPI";
import { useNavigate } from "react-router-dom";
import { useLoginStore } from "../../stores/useLoginStore";

export const BoardMain = () => {
  const user = useLoginStore((state) => state.user);
  const navigate = useNavigate();

  //상태관리: 각 게시판 데이터 state
  const [notices, setNotices] = useState([]);
  const [importances, setImportances] = useState([]);
  const [frees, setFrees] = useState([]);
  const [menus, setMenus] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/user/login");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedNotices = await getNotices();
      const fetchedImportancs = await getImportantNotices();
      const fetchedFrees = await getFrees();
      const fetchedMenus = await getMenus();
      const fetchedNews = await getRecent();

      setNotices(fetchedNotices);
      setImportances(fetchedImportancs);
      setFrees(fetchedFrees);
      setMenus(fetchedMenus);
      setNews(fetchedNews);
    };

    fetchData();
  }, []);

  //핸들러
  const onClickHandlerForView = (category, ano) => {
    navigate(`/board/${category}/${ano}`);
  };

  return user ? (
    <BoardLayout>
      <main className="main-content" id="board-main-container">
        <Notices
          notices={notices}
          importances={importances}
          onClickHandler={onClickHandlerForView}
        />

        <div className="section-container">
          <Frees frees={frees} onClickHandler={onClickHandlerForView} />

          <News news={news} onClickHandler={onClickHandlerForView} />

          <Menus menus={menus} />
        </div>
      </main>
    </BoardLayout>
  ) : null;
};
