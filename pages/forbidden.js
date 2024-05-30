const Error = ({ message }) => {
  return (
    <>
      <div className="index-page-container">
        <div className="sample-content-main-container d-flex justify-content-center">
          <div className="row align-items-center justify-content-center py-5 comming-soon-text text-center">
            {message}
          </div>
        </div>
      </div>
    </>
  );
};

export default Error;
