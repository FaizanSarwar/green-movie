import React from "react";

const Loader = ({isSearching}) => {
  return (
    <div className="search-section">
    <div className="col-12 mb-4 d-flex justify-content-center mt-5">
      {isSearching ? (
        <div className="min-height">Loading...</div>
      ) : (
        "No result found."
      )}
    </div>
    </div>
  );
};

export default Loader;
