import { useEffect } from 'react';
import PropTypes from 'prop-types';
import EpisodeListItem from '../items/EpisodeListItem';

const EpisodeListSlider = ({ data, onEpisodeClick }) => {
  useEffect(() => {
    window
      .jQuery('.row-list-slider')
      .not('.slick-initialized')
      .slick({
        dots: false,
        arrows: true,
        infinite: false,
        speed: 300,
        autoplay: false,
        slidesToShow: 5,
        slidesToScroll: 1,
        variableWidth: true,
        nextArrow:
          '<button class="NextArrow"><i class="ri-arrow-right-s-line"></i></button>',
        prevArrow:
          '<button class="PreArrow"><i class="ri-arrow-left-s-line"></i></button>',
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
              infinite: true,
              dots: true,
            },
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 480,
            settings: {
              // arrows: false,
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      });
  }, []);

  return (
    <section>
      <ul className="row-list-slider row-slider-episode-items-container row list-inline p-0 m-0">
        {data.map((f, idx) => (
          <li className="p-1 w-200" key={f.id}>
            <EpisodeListItem
              data={f}
              episodeNo={idx + 1}
              onEpisodeClick={onEpisodeClick}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

EpisodeListSlider.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  onEpisodeClick: PropTypes.func.isRequired,
};

export default EpisodeListSlider;
