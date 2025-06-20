import React from "react";

export const Template = () => {
  return (
    <>
      <h2>🍽️ 이번 주 식단표</h2>
      <br></br>
      <table border="1" className="menuTable">
        <thead>
          <tr>
            <th>요일</th>
            <th>아침</th>
            <th>점심</th>
            <th>저녁</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>월</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <td>화</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <td>수</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <td>목</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <td>금</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
        </tbody>
      </table>
      <p>※ 식단은 사정에 따라 변경될 수 있습니다.</p>
    </>
  );
};
