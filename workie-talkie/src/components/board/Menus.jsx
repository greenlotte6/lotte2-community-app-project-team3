export const Menus = ({ menus }) => {
  return (
    <div className="menu">
      <h3>🍱 식단표</h3>
      {menus.length === 0 ? (
        <p> 식단표가 없습니다. </p>
      ) : (
        menus.map((menu, index) => {
          const content = menu.content;
          console.log("Original Content:", content);

          const paragraphs = content
            .split(/<\/p>\s*<p>/) // </p><p> (공백 포함) 기준으로 분리
            .map((p) => p.replace(/<\/?p>/g, "").trim()) // 각 조각에서 <p> 태그 제거 및 공백 정리
            .filter((p) => p.length > 0); // 빈 문자열 제거

          console.log("Parsed Paragraphs:", paragraphs);

          const date =
            paragraphs.length >= 1 && paragraphs[0].match(/\[(.*?)\]/)
              ? paragraphs[0].match(/\[(.*?)\]/)[1]
              : "";
          console.log("Extracted Date:", date);

          const itemsString = paragraphs.length >= 2 ? paragraphs[1] : "";
          const items = itemsString
            ? itemsString.split(",").map((item) => item.trim())
            : [];
          console.log("Extracted Items Array:", items);

          return (
            <div key={index} className="meal-card">
              <div className="meal-date">{date}</div>
              <div className="meal-content">
                <span>{items[0]}</span>
                <span>{items[1]}</span>
                <div className="sides">
                  <span>{items[2]}</span>
                  <span>{items[3]}</span>
                  <span>{items[4]}</span>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
