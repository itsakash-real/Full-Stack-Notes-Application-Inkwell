import { memo } from "react";
import ReactMarkdown from "react-markdown";

const PageTransition = ({ children }) => (
  <div className="animate-fade-in">{children}</div>
);

export default memo(PageTransition);
