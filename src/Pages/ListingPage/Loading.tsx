import './Loading.scss';

const Loading = () => {
    return (
        <div className="listing-loading__grid">
            {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="listing-loading__grid__item">
                    <div className="listing-loading__grid__item__image loading" />
                    <div className="listing-loading__grid__item__title loading loading--text" />
                    <div className="listing-loading__grid__item__subtitle loading loading--text" />
                </div>
            ))}
        </div>
    );
};

export default Loading;
