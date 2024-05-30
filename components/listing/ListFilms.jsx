import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import ListItem from '../items/ListItem';

const ListFilms = ({ data }) => {
  return (
    <>
      {data.length === 0 &&
        [...Array(12)].map((_, idx) => (
          <li className="col-md-4 col-lg-2 col-6  p-1" key={idx}>
            <Skeleton
              inline
              baseColor="#202020"
              className="grid-list-loader w-100 mr-1 mb-1"
              highlightColor="#444"
            />
          </li>
        ))}
      {data.map((f) => (
        <li className="col-lg-2 col-md-4 col-6 p-1" key={f.id}>
          <ListItem data={f} />
        </li>
      ))}
    </>
  );
};

ListFilms.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired
};
export default ListFilms;
