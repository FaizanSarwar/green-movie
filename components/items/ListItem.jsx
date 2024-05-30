import Link from 'next/link';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { genreateDetailsPageUrl } from '../../utils/urlGenerator';

const ListItem = ({
  data,
  itemClass,
  imgClass = '',
  type,
  from,
  userSubscription,
}) => {
  const isSample = data?.subscriptionType?.includes('sample') || false;
  return (
    <>
      <Link
        passHref
        key={data.film_id}
        href={genreateDetailsPageUrl({
          id: data.id ? data.id : data.film_id,
          type: data.type ? data.type : type,
          from,
        })}>
        <div>
          <div
            className={`block-images position-relative pointer-cursor ${itemClass}`}>
            <div className="img-box">
              <Image
                //original
                // src={data.imageUrl ? data.imageUrl : data.image_url}
                src={data.imageUrl ? data.imageUrl : data.poster_url}
                className={`img-fluid border-radius-global ${imgClass}`}
                alt=""
                width={212}
                height={300}
                layout="responsive"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </Link>
      {isSample && userSubscription !== 'monthly' && (
        <div className="free-sample-content-text">Free</div>
      )}
    </>
  );
};

ListItem.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  itemClass: PropTypes.string,
  imgClass: PropTypes.string,
  from: PropTypes.string.isRequired,
  userSubscription: PropTypes.string.isRequired,
};
ListItem.defaultProps = {
  itemClass: '',
  imgClass: '',
  userSubscription: '',
};
export default ListItem;
