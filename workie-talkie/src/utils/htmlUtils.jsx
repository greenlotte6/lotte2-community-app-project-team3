import ReactDOMServer from "react-dom/server";
import { Template } from "../components/board/Template";

export const getMenuTemplateHTML = () => {
  return ReactDOMServer.renderToStaticMarkup(<Template />);
};
