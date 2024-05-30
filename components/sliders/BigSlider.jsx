import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import Link from 'next/link';
import { genreateDetailsPageUrl } from '../../utils/urlGenerator';

const BigSlider = ({ data }) => {
  useEffect(() => {
    window
      .jQuery('#main-slider')
      .not('.slick-initialized')
      .slick({
        centerMode: true,
        centerPadding: '200px',
        slidesToShow: 1,
        nextArrow:
          '<button class="NextArrow"><i class="ri-arrow-right-s-line"></i></button>',
        prevArrow:
          '<button class="PreArrow"><i class="ri-arrow-left-s-line"></i></button>',
        arrows: true,
        dots: true,
        responsive: [
          {
            breakpoint: 991,
            settings: {
              arrows: false,
              centerMode: true,
              centerPadding: '20px',
              slidesToShow: 1
            }
          },
          {
            breakpoint: 480,
            settings: {
              arrows: false,
              centerMode: true,
              centerPadding: '20px',
              slidesToShow: 1
            }
          }
        ]
      });
  }, [data]);

  return (
    <section
      className="iq-main-slider p-0"
      style={{ overflow: data && data.length === 0 ? 'hidden' : 'auto' }}>
      {data.length > 0 ? (
        <ul id="main-slider" className="p-0">
          {data.map((f) => (
            <Link
              passHref
              key={f.id}
              href={genreateDetailsPageUrl({ id: f.id, type: f.type })}>
              <li key={f.id}>
                <div className="shows-img pointer-cursor">
                  <Image
                    src={f.imageUrl}
                    className="w-100 border-radius-global"
                    alt=""
                    width={1505}
                    height={847}
                    layout="responsive"
                    loading="lazy"
                  />
                </div>
              </li>
            </Link>
          ))}
        </ul>
      ) : (
        <Loader />
      )}
    </section>
  );
};

const Loader = () => {
  return (
    <ul id="main-slider" key="slider-loader">
      {[...Array(3)].map((_, idx) => (
        <li key={idx}>
          <Skeleton
            width="100%"
            containerClassName="shows-img"
            baseColor="#202020"
            highlightColor="#444"
            height="65vh"
          />
        </li>
      ))}
    </ul>
  );
};

BigSlider.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired
};
export default BigSlider;
