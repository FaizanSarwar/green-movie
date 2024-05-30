import React, { useContext, useEffect, useState } from 'react';
import PageRoutes from '../../config/PageRoutes';
import GenresTab from '../common/GenresTab';
import SliderSkeleton from '../common/SliderSkeleton';
import ListFilms from '../listing/ListFilms';
import RowListSlider from '../sliders/RowListSlider';
import { getCarouselFilms, getSeriesList } from '../../services/apiService';
import { useRouter } from 'next/router';
import { generateSubGenrelUrl } from '../../utils/urlGenerator';
import { formatName } from '../../utils/formatData';
import { DataContext } from '../../contexts/DataContext';

const defaultAllText = 'All';

const SeriesPage = () => {
  const router = useRouter();
  const selected = router.query.slug;

  const { setSubGenres, selectedGenre, setSelectedGenre } =
    useContext(DataContext);

  const [carouselFilms, setCarouselFilms] = useState([]);
  const [seriesGenres, setSeriesGenres] = useState([]);
  const [seriesGenresFilms, setSeriesGenresFilms] = useState(null);
  const [currentGenreFilms, setCurrentGenreFilms] = useState([]);

  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    if (selected) {
      if (!seriesGenresFilms) {
        setRefreshData(!refreshData);
      } else {
        Object.keys(seriesGenresFilms).forEach((k) => {
          if (formatName(k) === selected) {
            setCurrentGenreFilms(seriesGenresFilms[k]);
            setSelectedGenre(k);
          }
        });
      }
    } else {
      if (!seriesGenresFilms || carouselFilms.length === 0) {
        setRefreshData(!refreshData);
      } else {
        setSelectedGenre(defaultAllText);
      }
    }
  }, [selected]);

  useEffect(() => {
    if (!selected && carouselFilms.length === 0) {
      getCarouselFilms().then((res) => {
        setCarouselFilms(
          res.data.map((f) => ({
            imageUrl: f.image_url,
            id: f.film_id,
            type: 'films',
          }))
        );
      });
    }

    getSeriesList().then((res) => {
      const finalFeaturedFilms = [];
      res.data.forEach((f) => {
        if (f.genres?.includes('Series')) {
          finalFeaturedFilms.push({
            id: f.id,
            imageUrl: f.poster_url,
            genres: f.genres,
          });
        }
      });

      const genres = [];
      finalFeaturedFilms.forEach((f) => {
        f.genres?.forEach((g) => {
          if (!genres.includes(g) && g !== 'Series') {
            genres.push(g);
          }
        });
      });
      setSeriesGenres([defaultAllText, ...genres]);
      setSubGenres([defaultAllText, ...genres]);

      const genresFilms = [];
      genres.forEach((g) => {
        if (g == defaultAllText) {
          return;
        }
        const checkFilms = finalFeaturedFilms.filter((f) =>
          f.genres.includes(g)
        );
        if (checkFilms.length > 0) {
          genresFilms[g] = checkFilms.map((f) => ({
            id: f.id,
            type: 'series',
            imageUrl: f.imageUrl,
          }));
        }
      });

      const findSelectedGenre = selected
        ? genres.find((r) => formatName(r) === selected)
        : defaultAllText;
      setSelectedGenre(findSelectedGenre);
      if (findSelectedGenre !== defaultAllText) {
        setCurrentGenreFilms(genresFilms[findSelectedGenre]);
      }
      setSeriesGenresFilms(genresFilms);
    });
  }, [refreshData]);

  const changeGenre = (g) => {
    if (selectedGenre !== g) {
      if (g === defaultAllText) {
        router.push(PageRoutes.SERIES);
      } else {
        router.push(generateSubGenrelUrl(PageRoutes.SERIES_GENRE_PAGE, g));
      }
    }
  };

  return (
    <div className="page-container">
      {/* <GenresTab
        data={seriesGenres}
        selectedGenre={selectedGenre}
        onChangeGenre={changeGenre}
      /> */}

      {!selected && (
        <div>
          {seriesGenresFilms ? (
            Object.entries(seriesGenresFilms).map((f) => (
              <div key={f} className="film-row-list-container">
                <div>
                  <div className="film-row-list-title-container">
                    <div className="container-fluid film-row-list-title">
                      {f[0]}
                    </div>
                    <i
                      className="ri-more-fill film-row-list-more-icon pointer-cursor"
                      onClick={() => changeGenre(f[0])}></i>
                  </div>
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
            Series {`${selectedGenre ? `/ ${selectedGenre}` : ''}`}
          </div>
          <ul className="row-list-slider row list-inline p-0 m-0">
            <ListFilms data={currentGenreFilms || []} />
          </ul>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps = async () => {
  return { props: {} };
};

export default SeriesPage;
