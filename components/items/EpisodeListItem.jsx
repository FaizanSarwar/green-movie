/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import PropTypes from 'prop-types';
import { generateEpisodeUrl } from '../../utils/urlGenerator';

const EpisodeListItem = ({ data, episodeNo, onEpisodeClick }) => {
  const getMinsString = (mins) => {
    if (mins) {
      if (mins.length > 1) return `${mins}:00 mins`;
      return `0${mins}:00 mins`;
    }
    return mins;
  };
  //data.sId, data.id, data.season
  return (
    <div onClick={() => onEpisodeClick(data)}>
      <div className="position-relative w-100 h-100 pointer-cursor">
        <div className=" w-100 ">
          <img src={data.posterUrl} alt="" className="episode-row-list-img" />
        </div>
        <div className="episode-row-list-desc">
          <div className="d-flex align-items-center justify-content-between">
            <div className="episode-title mb-2">Episode {episodeNo}</div>

            <i className="ri-play-circle-fill episode-list-item-play-icon" />
          </div>
          <div className="episode-desc ep-row-list-desc">{data.synopsis}</div>
          <div className="episode-list-item-flex mt-3">
            {data.duration && (
              <div className="episode-list-item episode-info-item">
                {getMinsString(data.duration)}
              </div>
            )}
            {data.year && (
              <div className="episode-list-item episode-info-item">
                {data.year}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

EpisodeListItem.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  onEpisodeClick: PropTypes.func.isRequired,
};
export default EpisodeListItem;
