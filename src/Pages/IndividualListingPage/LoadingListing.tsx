import './LoadingListing.scss';

const LoadingListing = () => {
    return (
        <div className="loading-listing">
            <div className="loading-listing__image skeleton" />

            <div className="loading-listing__details">
                <div className="skeleton skeleton--text skeleton--small" />
                <div className="skeleton skeleton--text skeleton--medium" />
                <div className="skeleton skeleton--text skeleton--large" />

                <div className="skeleton skeleton--block" />
                <div className="skeleton skeleton--block" />

                <div className="skeleton skeleton--button" />
            </div>
        </div>
    );
};

export default LoadingListing;
