import Image from 'next/image';
import tgcLogo from '/public/images/tgc-logo.png';

const Rent = () => {
  return (
    <>
      <div className="index-page-container">
        <div className="rent-main-container">
          <div className="rent-main-container-bg" />
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-3 col-sm-12 col-xs-12">
                <>
                  <div className="tgc-logo-index">
                    <Image
                      src={tgcLogo}
                      alt="TGC Logo"
                      width={150}
                      height={125}
                    />
                  </div>
                  <h1 className="font-weight-bold guest-landing-large-text mt-3">
                    ON-DEMAND STREAMING
                  </h1>
                  <p className="mt-4">
                    We are working on bring you some amazing impactful content
                    that you can rent and stream without needing a subscription
                  </p>
                </>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Rent;
