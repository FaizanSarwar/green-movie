import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import GenresTab from '../../components/common/GenresTab';
import ListFilms from '../../components/listing/ListFilms';
import SliderSkeleton from '../../components/common/SliderSkeleton';
import RowListSlider from '../../components/sliders/RowListSlider';
import PageRoutes from '../../config/PageRoutes';
import { getFilmsList } from '../../services/apiService';
import { generateSubGenrelUrl } from '../../utils/urlGenerator';
import PropTypes from 'prop-types';
import {
  filterGenreData,
  filterGenreWiseData,
  filterUniqueGenres,
  formatName,
} from '../../utils/formatData';
import { DataContext } from '../../contexts/DataContext';

const defaultAllText = 'All';

const FeaturesPage = () => {
  const generData = [
    'TGC Originals',
    'Recently Added',
    'Shorts',
    'Features',
    'Top 12 Impact',
    'Documentary',
    'Public Interest',
    'Climate',
  ];
  const router = useRouter();
  const selected = router.query.slug || 'Features';
  const { setSubGenres, selectedGenre, setSelectedGenre } =
    useContext(DataContext);

  const [carouselFilms, setCarouselFilms] = useState([]);
  const [featuresGenres, setFeaturesGenres] = useState([]);
  const [featuresGenresFilms, setFeaturesGenresFilms] = useState(null);

  const [refreshData, setRefreshData] = useState(false);
  const [currentGenreFilms, setCurrentGenreFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selected) {
      if (!featuresGenresFilms) {
        setRefreshData(!refreshData);
      } else {
        Object.keys(featuresGenresFilms).forEach((k) => {
          if (formatName(k) === selected) {
            setCurrentGenreFilms(featuresGenresFilms[k]);
            setSelectedGenre(k);
          }
        });
      }
    } else {
      if (!featuresGenresFilms || carouselFilms.length === 0) {
        setRefreshData(!refreshData);
      } else {
        setSelectedGenre(defaultAllText);
      }
    }
  }, [selected]);

  useEffect(() => {
    setLoading(true);
    getFilmsList()
      .then((res) => {
        const finalFeaturedFilms = filterGenreData(res.data, 'Features');
        let newGenres = filterUniqueGenres(finalFeaturedFilms);
        let genres = [];
        generData.map((t) => {
          newGenres.map((g) => {
            if (t === g) {
              genres.push(g);
              newGenres = newGenres.filter((item) => g !== item);
            }
          });
        });
        genres.push(...newGenres);
        genres = genres.filter(
          (value, index, genres) => genres.indexOf(value) === index
        );
        setFeaturesGenres(genres);
        setSubGenres(genres);

        const genresFilms = {};

        const filteredData = filterGenreWiseData(finalFeaturedFilms, genres);
        Object.entries(filteredData).forEach((f) => {
          genresFilms[f[0]] = f[1].map((f) => ({
            id: f.id,
            type: 'films',
            imageUrl: f.poster_url,
            genres: f.genres,
          }));
        });

        setFeaturesGenresFilms(genresFilms);
        const findSelectedGenre = selected
          ? genres.find((r) => formatName(r) === formatName(selected))
          : defaultAllText;
        setSelectedGenre(findSelectedGenre);
        if (
          findSelectedGenre &&
          findSelectedGenre !== undefined &&
          findSelectedGenre !== defaultAllText
        ) {
          setCurrentGenreFilms(genresFilms[findSelectedGenre]);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [refreshData]);

  const changeGenre = (g) => {
    if (selectedGenre !== g) {
      if (g === defaultAllText) {
        router.push(PageRoutes.FEATURES);
      } else {
        router.push(generateSubGenrelUrl(PageRoutes.FEATURES_PAGE, g));
      }
    }
  };

  return (
    <>
      {!loading && currentGenreFilms && currentGenreFilms.length > 0 && (
        <div className="page-container">
          {/* {featuresGenres && (
            <GenresTab
              data={featuresGenres}
              selectedGenre={selectedGenre}
              onChangeGenre={changeGenre}
            />
          )} */}

          {!selected && (
            <div>
              {/* <BigSlider data={carouselFilms} /> */}

              {featuresGenresFilms ? (
                Object.entries(featuresGenresFilms).map((f) => (
                  <div key={f} className="film-row-list-container">
                    <div className="film-row-list-title-container">
                      <div className="container-fluid">
                        <div className="row">
                          <div className="col-sm-12">
                            <div className="film-row-list-title">{f[0]}</div>
                          </div>
                        </div>
                      </div>
                      <i
                        className="ri-more-fill film-row-list-more-icon pointer-cursor"
                        onClick={() => changeGenre(f[0])}></i>
                    </div>

                    <RowListSlider data={f[1]} />
                  </div>
                ))
              ) : (
                <SliderSkeleton rows={3} />
              )}
            </div>
          )}

          {selected && (
            <div className="features-container">
              <div className="features-container-gener-title">
                {`${selectedGenre ? `${selectedGenre}` : 'Feature'}`}
              </div>
              <ul className="row-list-slider row list-inline p-0 m-0">
                <ListFilms data={currentGenreFilms || []} />
              </ul>
            </div>
          )}
        </div>
      )}
      {loading && <SliderSkeleton rows={3} />}
      {!loading && currentGenreFilms.length <= 0 && (
        <div className="page-container d-flex justify-content-center align-items-center">
          No Data Found!
        </div>
      )}
    </>
  );
};

export const getServerSideProps = async () => {
  return { props: {} };
};

FeaturesPage.propTypes = {
  selected: PropTypes.string,
};
FeaturesPage.defaultPropTypes = {
  selected: '',
};

export default FeaturesPage;
