import "./LoadingAccount.scss";

const LoadingAccount = () => {
  return (
    <div className="loading-account" data-testid="loading-account">
      <div className="loading-account__sidebar">
        <div className="loading-account__profile">
          <div className="skeleton skeleton--circle" />
          <div className="skeleton skeleton--text skeleton--medium" />
        </div>
        <div className="loading-account__nav">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="skeleton skeleton--text skeleton--large" />
          ))}
        </div>
      </div>

      <div className="loading-account__content">
        <div className="skeleton skeleton--text skeleton--large" />
        <div className="skeleton skeleton--block" />
        <div className="skeleton skeleton--block" />
        <div className="skeleton skeleton--block" />
      </div>
    </div>
  );
};

export default LoadingAccount;
