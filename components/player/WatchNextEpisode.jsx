import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../../components/common/Button';

const WatchNextEpisode = ({
  nextEpisodeData,
  closePlayer,
  playNextEpisode,
  isFullScreen
}) => {
  const getMinsString = (mins) => {
    if (mins.length > 1) return `${mins}:00 mins`;
    return `0${mins}:00 mins`;
  };

  return (
    <div
      key={nextEpisodeData.id}
      id="end-screen-overlay"
      className="end-screen-container w-100"
      style={isFullScreen ? { top: '30%' } : null}>
      <div className="row mx-2  justify-content-center align-items-center w-100">
        <div className="col col-12 col-md-3 pr-2">
          <div
            className="d-flex flex-column  align-items-center align-items-xs-start"
            style={{ fontSize: '1.5rem', textAlign: 'center' }}>
            <h6 style={{ fontWeight: 'bolder' }}>Playing next video in</h6>
            <Counter onComplete={playNextEpisode} />
            <div className="px-0 px-xs-5  next-episode-btn-container d-flex flex-xs-row flex-md-column">
              <Button
                onClick={playNextEpisode}
                className="mr-1 mb-1"
                fullWidth
                variant="contained">
                Watch next episode
              </Button>
              <Button fullWidth variant="outlined" onClick={closePlayer}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
        <div className="col col-12 col-md-3 pr-2  d-lg-block d-none">
          <div
            className="next-episode-image"
            style={{
              backgroundImage: `url(${nextEpisodeData?.poster})`,
              position: 'relative'
            }}>
            <div className="next-episode-image-info d-flex justify-content-between">
              <span>{getMinsString(nextEpisodeData?.duration) || ''}</span>
              <span>{nextEpisodeData.year}</span>
            </div>
          </div>
        </div>
        <div className="col col-12 col-md-3 d-lg-block d-none h-100 align-self-start">
          <h6 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {nextEpisodeData?.title || ''}
          </h6>
          <div className="next-episode-synopsis">
            <p className="mt-2 ">{nextEpisodeData?.synopsis || ''}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Counter = ({ onComplete }) => {
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      setSeconds(0);
      onComplete();
    }
  });

  return <h1 className="next-episode-timer my-2 px-5">{seconds}s</h1>;
};

Counter.propTypes = {
  onComplete: PropTypes.func.isRequired
};

WatchNextEpisode.propTypes = {
  nextEpisodeData: PropTypes.objectOf(PropTypes.any).isRequired,
  closePlayer: PropTypes.func.isRequired,
  playNextEpisode: PropTypes.func.isRequired,
  isFullScreen: PropTypes.bool.isRequired
};

export default WatchNextEpisode;
