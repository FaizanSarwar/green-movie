import { useEffect } from 'react';
import PropTypes from 'prop-types';
import ListItem from '../items/ListItem';

const RowListSlider = ({ data, horizontalPoster, userSubscription }) => {
  useEffect(() => {
    window
      .jQuery('.row-list-slider')
      .not('.slick-initialized')
      .slick({
        variableWidth: true,
        dots: false,
        arrows: true,
        infinite: false,
        speed: 300,
        autoplay: false,
        slidesToShow: horizontalPoster ? 4 : 8,
        slidesToScroll: horizontalPoster ? 4 : 8,
        nextArrow:
          '<button class="NextArrow"><i class="ri-arrow-right-s-line"></i></button>',
        prevArrow:
          '<button class="PreArrow"><i class="ri-arrow-left-s-line"></i></button>',
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: false,
              dots: true,
            },
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              infinite: false,
            },
          },
          {
            breakpoint: 480,
            settings: {
              // arrows: false,
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: false,
            },
          },
        ],
      });
  }, []);

  return (
    <section>
      <ul
        className={`row-list-slider row list-inline p-0 m-0 ${
          !horizontalPoster
            ? 'row-slider-container'
            : 'row-slider-horizontal-items-container'
        }`}>
        {data.map((f) => (
          <li className="p-1" key={f.id}>
            <ListItem
              data={f}
              imgClass={horizontalPoster ? 'impact-film-grid-item' : ''}
              from="subscription"
              userSubscription={userSubscription}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

RowListSlider.defaultProps = {
  horizontalPoster: false,
  userSubscription: '',
};

RowListSlider.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  horizontalPoster: PropTypes.bool,
  userSubscription: PropTypes.string.isRequired,
};

export default RowListSlider;
