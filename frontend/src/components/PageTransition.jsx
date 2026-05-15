const PageTransition = ({ children }) => {
  return (
    <div
      className="animate-fade-in"
      style={{ animationDuration: "0.4s" }}
    >
      {children}
    </div>
  );
};

export default PageTransition;