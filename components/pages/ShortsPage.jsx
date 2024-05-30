import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import PageRoutes from '../../config/PageRoutes';
import { formatName } from '../../utils/formatData';
import GenresTab from '../../components/common/GenresTab';
import SliderSkeleton from '../../components/common/SliderSkeleton';
import ListFilms from '../../components/listing/ListFilms';
import BigSlider from '../../components/sliders/BigSlider';
import RowListSlider from '../../components/sliders/RowListSlider';
import { getCarouselFilms, getFilmsList } from '../../services/apiService';
import { generateSubGenrelUrl } from '../../utils/urlGenerator';
import { DataContext } from '../../contexts/DataContext';

const defaultAllText = 'All';

const ShortsPage = () => {
  const router = useRouter();
  const selected = router.query.slug;
  const { setSubGenres, selectedGenre, setSelectedGenre } =
    useContext(DataContext);

  const [carouselFilms, setCarouselFilms] = useState([]);
  const [shortsGenres, setShortsGenres] = useState([]);
  const [shortsGenresFilms, setShortsGenresFilms] = useState(null);

  const [refreshData, setRefreshData] = useState(false);
  const [currentGenreFilms, setCurrentGenreFilms] = useState([]);

  useEffect(() => {
    if (selected) {
      if (!shortsGenresFilms) {
        setRefreshData(!refreshData);
      } else {
        Object.keys(shortsGenresFilms).forEach((k) => {
          if (formatName(k) === selected) {
            setCurrentGenreFilms(shortsGenresFilms[k]);
            setSelectedGenre(k);
          }
        });
      }
    } else {
      if (!shortsGenresFilms || carouselFilms.length === 0) {
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
            type: 'films'
          }))
        );
      });
    }

    getFilmsList().then((res) => {
      const finalFeaturedFilms = [];
      res.data.forEach((f) => {
        if (f.genres?.includes('Shorts')) {
          finalFeaturedFilms.push({
            id: f.id,
            imageUrl: f.poster_url,
            type: 'films',
            genres: f.genres
          });
        }
      });

      const genres = [];
      finalFeaturedFilms.forEach((f) => {
        f.genres?.forEach((g) => {
          if (!genres.includes(g) && g !== 'Shorts') {
            genres.push(g);
          }
        });
      });
      setShortsGenres([defaultAllText, ...genres]);
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
            type: 'films',
            imageUrl: f.imageUrl
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
      setShortsGenresFilms(genresFilms);
    });
  }, [refreshData]);

  const changeGenre = (g) => {
    if (selectedGenre !== g) {
      if (g === defaultAllText) {
        router.push(PageRoutes.SHORTS);
      } else {
        router.push(generateSubGenrelUrl(PageRoutes.SHORTS_GENRE_PAGE, g));
      }
    }
  };

  return (
    <div className="page-container">
      {/* {shortsGenres && (
        <GenresTab
          data={shortsGenres}
          selectedGenre={selectedGenre}
          onChangeGenre={changeGenre}
        />
      )} */}

      {!selected && (
        <div>
          {/* <BigSlider data={carouselFilms} /> */}
          {shortsGenresFilms ? (
            Object.entries(shortsGenresFilms).map((f) => (
              <div key={f} className="film-row-list-container">
                <div className="film-row-list-title-container">
                  <div className="container-fluid film-row-list-title">
                    {f[0]}
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
            Shorts {`${selectedGenre ? `/ ${selectedGenre}` : ''}`}
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

export default ShortsPage;
