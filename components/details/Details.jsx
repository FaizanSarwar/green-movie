/* eslint-disable @next/next/no-img-element */
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import { getExpiryDays } from '../../utils/formatData';

const Details = ({
  data,
  openPlayer,
  onWatchClick,
  trailerUrl,
  isSubscriptionEnabled,
  progress,
  buttonText,
  rentExpiryData,
  manageRent,
  isSample,
  isSeries,
}) => {
  useEffect(() => {
    try {
      if (data) {
        if (window) {
          window.document.title = data.title;
          //detail-info
        }
        const height =
          window.document.getElementById('detail-info').offsetHeight;
        if (height > 211) {
          window.document
            .getElementById('detail-info')
            .classList.add('scrolling');
          window.document.getElementById('credit').classList.add('scroll');
        } else {
          window.document
            .getElementById('detail-info')
            .classList.remove('scrolling');
          window.document.getElementById('credit').classList.remove('scroll');
        }
      }
    } catch (e) {
      // skip error
    }
  }, [data]);

  if (!data) {
    return (
      <div className="container">
        <Skeleton
          inline
          baseColor="#202020"
          className="detail-loader w-100 mr-1mt-0 mt-md-5"
          highlightColor="#444"
        />
      </div>
    );
  }
  return (
    <div
      className="details-section"
      style={{
        backgroundImage: `url(${
          data?.poster_url ? data?.poster_url : data?.posterUrl
        })`,
      }}>
      <div className="detail-bg-image">
        <div className="details-content pt-2 pb-5 mt-0">
          <div className="container">
            <div className="detail-flex-container  d-flex flex-md-row flex-column mt-0 mt-md-5">
              <div className="d-flex flex-column align-items-md-start align-items-center align-self-center  align-self-md-baseline">
                {(data.poster_url || data.posterUrl) && (
                  <div style={{ position: 'relative' }}>
                    <img
                      style={{ height: 350, width: 250 }}
                      src={data.posterUrl ? data.posterUrl : data.poster_url}
                      className="img-fluid border-radius-global my-md-auto"
                      alt={data.title || 'Film Poster'}
                    />
                    <div
                      className="border-radius-global program-watch-progress"
                      style={{
                        width: `${progress}%`,
                      }}></div>
                  </div>
                )}
                {!isSample &&
                  rentExpiryData &&
                  rentExpiryData.rented &&
                  rentExpiryData.period_end > 0 && (
                    <button className="btn green-outlined-button mt-3 btn-rent-days w-100">
                      {`Expires in ${getExpiryDays(rentExpiryData)} Days`}
                    </button>
                  )}
                {!isSeries && (
                  <button
                    className="btn green-filled-button mt-3 btn-watch-now w-100"
                    onClick={onWatchClick}>
                    <i
                      className="ri-play-fill mr-2"
                      style={{ fontSize: 20 }}></i>
                    {progress > 0 ? 'Resume' : 'Watch Now'}
                  </button>
                )}
                {trailerUrl && (
                  <button
                    className="btn green-outlined-button mt-3 btn-watch-trailer w-100"
                    onClick={() => openPlayer(data, true)}>
                    Watch Trailer
                  </button>
                )}
              </div>
              <div className="detail-description ml-0 ml-0 ml-md-3 border-radius-global p-3">
                <h1 className="detail-title mb-3">{data?.title}</h1>
                <div className="detail-synopsis">{data?.synopsis}</div>
                <div id="detail-info" className="detail-info mt-3">
                  <table>
                    <tbody>
                      {data?.duration_mins && (
                        <tr>
                          <td className="detail-info-title" width="10%">
                            Duration
                          </td>
                          <td className="detail-info-value">{` ${data.duration_mins} mins`}</td>
                        </tr>
                      )}
                      {data?.production_year && (
                        <tr>
                          <td className="detail-info-title">Year</td>
                          <td className="detail-info-value">
                            {data.production_year}
                          </td>
                        </tr>
                      )}
                      {data?.director_and_cast && (
                        <tr>
                          <td className="detail-info-title align-top">
                            Credit
                          </td>
                          <td
                            id="credit"
                            className="detail-info-value">{`${data?.director_and_cast}`}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Details.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  openPlayer: PropTypes.func.isRequired,
  onWatchClick: PropTypes.func.isRequired,
  isSubscriptionEnabled: PropTypes.bool.isRequired,
  rentExpiryData: PropTypes.objectOf(PropTypes.any).isRequired,
  manageRent: PropTypes.func.isRequired,
  isSample: PropTypes.bool,
  isSeries: PropTypes.bool,
};

Details.defaultProps = {
  isSample: false,
  isSeries: false,
};
export default Details;
