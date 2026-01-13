import React from 'react';

type ImageProps = {
    imageUrl: string;
    title: string;
};

const Image: React.FC<ImageProps> = ({ imageUrl, title }) => {
    return (
        <div className="individual-listing-page__image-wrapper">
            <img
                src={imageUrl}
                alt={title}
                className="individual-listing-page__image-wrapper__image"
            />
            <button className="individual-listing-page__image-wrapper__back-btn">
                <a href="/listing">←</a>
            </button>
        </div>
    );
};

export default Image;
