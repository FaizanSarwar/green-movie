import React from 'react';
import Skeleton from 'react-loading-skeleton';
import PropTypes from 'prop-types';

const SliderSkeleton = ({ rows, horizontalPoster }) => {
  return [...Array(rows)].map((_, idx) => (
    <div key={idx} className="film-row-list-container">
      <div className="film-row-list-title-container">
        <div className="container-fluid film-row-list-title">
          <Skeleton
            width={120}
            height={10}
            baseColor="#202020"
            highlightColor="#444"
          />
        </div>
        <i className="ri-more-fill film-row-list-more-icon"></i>
      </div>
      <div
        className={`d-flex overflow-hidden w-100 ${
          horizontalPoster
            ? 'impact-film-grid-item-loader'
            : ' row-slider-images'
        }`}>
        <Skeleton
          className={`border-radius-global img-fluid  ${
            horizontalPoster
              ? 'impact-film-grid-item-loader'
              : ' row-slider-images'
          }`}
          count={25}
          containerClassName="row-list-slider row flex-nowrap list-inline p-0 m-0"
          baseColor="#202020"
          style={{ marginRight: 10 }}
          highlightColor="#444"
        />
      </div>
    </div>
  ));
};

SliderSkeleton.propTypes = {
  rows: PropTypes.number,
  horizontalPoster: PropTypes.bool
};

SliderSkeleton.defaultProps = {
  rows: 1,
  horizontalPoster: false
};

export default SliderSkeleton;
