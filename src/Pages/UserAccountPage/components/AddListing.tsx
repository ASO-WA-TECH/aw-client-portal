

import "../index.scss";

const AddListing = () => {
    return (
        <div className="create-listing-page">
            <div className="create-listing-page__container">
                <div className="airtable-form-wrapper">
                    <iframe
                        src="https://airtable.com/embed/apprhO3UfkXffh9Fe/pagUHqHq9QI6V02bC/form"
                        width="100%"
                        height="800"
                        frameBorder="0"
                        style={{ background: "transparent", border: "1px solid #ccc" }}
                        title="Airtable Listing Form"
                    />
                </div>
            </div>
        </div>
    );
};

export default AddListing;