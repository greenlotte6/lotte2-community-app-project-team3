import React from "react";
import { BoardLayout } from "../../layouts/BoardLayout";
import { Notices } from "../../components/board/Notices";
import { Frees } from "../../components/board/Frees";
import { News } from "../../components/board/News";
import { Menus } from "../../components/board/Menus";

export const BoardMain = () => {
  return (
    <BoardLayout>
      <main className="main-content" id="board-main-container">
        <Notices />

        <div className="section-container">
          <Frees />

          <News />

          <Menus />
        </div>
      </main>
    </BoardLayout>
  );
};
