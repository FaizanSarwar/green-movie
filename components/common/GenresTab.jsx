import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';

const GenresTab = ({ data, selectedGenre, onChangeGenre }) => {
  return (
    <div className="features-tabs-holder w-100 d-none d-lg-block">
      <div className="features-tabs-container features-container">
        {data && data.length > 0 ? (
          data.map((g) => (
            <div
              className={`features-tabs-item ${
                selectedGenre === g ? `features-tabs-item-selected` : ``
              }`}
              key={g}
              onClick={() => onChangeGenre(g)}>
              {g}
            </div>
          ))
        ) : (
          <Skeleton
            containerClassName="features-tabs-container features-container w-100"
            count={5}
            className="mr-4 my-2"
            height="20px"
            width="100px"
            baseColor="#202020"
            highlightColor="#444"
          />
        )}
      </div>
    </div>
  );
};

GenresTab.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  selectedGenre: PropTypes.string.isRequired,
  onChangeGenre: PropTypes.func.isRequired
};
export default GenresTab;
