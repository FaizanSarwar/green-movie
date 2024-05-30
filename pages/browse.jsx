import { useEffect, useState } from 'react';
import SliderSkeleton from '../components/common/SliderSkeleton';
import BigSlider from '../components/sliders/BigSlider';
import RowListSlider from '../components/sliders/RowListSlider';
import { parseCookies } from '../utils/CookieFormatter';
import {
  getCarouselFilms,
  getFilmsList,
  getGenres,
} from '../services/apiService';
import { registerGuestUser, validateUser } from '../services/tgcApi';
// import { serialize } from 'cookie';
import { useRouter } from 'next/router';
import PageRoutes from '../config/PageRoutes';
import { generateSubGenrelUrl } from '../utils/urlGenerator';
import { carousel_films } from '../services/carousel_films';
import { genres } from '../services/genres';
import { features } from '../services/features';
import { serialize } from 'cookie';
const Browse = ({ userSubscription, areCookieOk, isLoggedIn }) => {
  const router = useRouter();

  const [carouselFilms, setCarouselFilms] = useState([]);
  const [genresFilms, setGenresFilms] = useState(null);

  useEffect(() => {
    window.jQuery('#header-logo').removeClass('hide-header-logo');
    window.jQuery('#right-menu').removeClass('hide-header-logo');
    // getCarouselFilms().then((res) => {
    const initialRecords = carousel_films.data.slice(0, 8);
    setCarouselFilms(
      initialRecords.map((f) => ({
        imageUrl: f.image_url,
        id: f.film_id,
        type: 'films',
      }))
    );
    //});

    //getFilmsList().then(async (films) => {
    // const genres = await getGenres();
    const generesFilmsObj = {};
    genres.data.forEach((g) => {
      const checkFilms = features.filter((f) => f.genres.includes(g));
      if (checkFilms.length > 0) {
        generesFilmsObj[g] = checkFilms.map((f) => ({
          id: f?.id,
          type: f?.content_type,
          imageUrl: f?.poster_url,
          subscriptionType: f?.subscription_types,
        }));
      }
    });

    setGenresFilms(generesFilmsObj);
    //});
  }, []);

  const handleSubGenreRoute = (genre) => {
    router.push(generateSubGenrelUrl(PageRoutes.FEATURES_PAGE, genre));
    // if (genre === 'Features') {
    //   router.push(PageRoutes.FEATURES);
    // } else {
    //   router.push(generateSubGenrelUrl(PageRoutes.FEATURES_PAGE, genre));
    // }
  };

  return (
    <div className="page-container">
      <BigSlider data={carouselFilms} />
      {genresFilms ? (
        Object.entries(genresFilms).map((f) => (
          <div key={f} className="film-row-list-container">
            <div className="film-row-list-title-container">
              <div className="container-fluid film-row-list-title">{f[0]}</div>
              <i
                className="ri-more-fill film-row-list-more-icon pointer-cursor"
                onClick={() => handleSubGenreRoute(f[0])}></i>
            </div>

            <RowListSlider data={f[1]} userSubscription={userSubscription} />
          </div>
        ))
      ) : (
        <SliderSkeleton rows={3} />
      )}
    </div>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  let areCookieOk = false;
  let isUserLoggedIn = false;
  let userSubscription = '';
  let cookies;
  const referer = req?.headers.referer || '';
  const { host } = req?.headers;
  const resp = await validateUser(req.headers.cookie);
  if (resp && resp.success) {
    areCookieOk = true;
    isUserLoggedIn = true;
    userSubscription = resp?.data?.data?.subscription_type || '';
  }

  if (!isUserLoggedIn && !areCookieOk) {
    if (referer.includes(host)) {
      const result = await registerGuestUser();

      if (result.success) {
        const resCokkies = result?.headers['set-cookie'].map((ck) => {
          return parseCookies(ck);
        });

        let cookiesToSet = resCokkies.map((ck) => {
          const cKey = Object.keys(ck)[0];
          const cOpts = {};
          if (ck.domain) {
            cOpts.domain = ck.domain;
          }
          cOpts.path = ck.path;
          cOpts.httpOnly = true;
          cOpts.secure = true;

          if (ck.expires) {
            cOpts.expiresAt = ck.expires;
          }
          if (ck['Max-Age']) {
            cOpts.maxAge = ck['Max-Age'];
          }
          if (ck.SameSite) {
            cOpts.sameSite = ck.SameSite;
          }

          return serialize(cKey, ck[cKey], cOpts);
        });

        if (resCokkies) {
          areCookieOk = true;
          res.setHeader('Set-Cookie', cookiesToSet);
        }
      }
    }
  }

  return {
    props: { isLoggedIn: areCookieOk, userSubscription: userSubscription },
  };
};

// export async function getStaticProps() {
//   let areCookieOk = false;
//   let isUserLoggedIn = false;
//   let userSubscription = '';
//   let cookies;

//   // Stubbed request and response objects, as getStaticProps doesn't have them
//   const req = { headers: { cookie: '' } };
//   const res = { setHeader: () => {} };

//   const resp = await validateUser(req.headers.cookie);

//   if (resp && resp.success) {
//     areCookieOk = true;
//     isUserLoggedIn = true;
//     userSubscription = resp?.data?.data?.subscription_type || '';
//   }

//   if (!isUserLoggedIn && !areCookieOk) {
//     // Stubbed referer and host, as getStaticProps doesn't have access to request headers
//     const referer = ''; // Change this if you have a value to use
//     const host = ''; // Change this if you have a value to use

//     if (referer.includes(host)) {
//       const result = await registerGuestUser();

//       if (result.success) {
//         const resCokkies = result?.headers['set-cookie'].map((ck) => {
//           return parseCookies(ck);
//         });

//         let cookiesToSet = resCokkies.map((ck) => {
//           const cKey = Object.keys(ck)[0];
//           const cOpts = {};
//           if (ck.domain) {
//             cOpts.domain = ck.domain;
//           }
//           cOpts.path = ck.path;
//           cOpts.httpOnly = true;
//           cOpts.secure = true;

//           if (ck.expires) {
//             cOpts.expiresAt = ck.expires;
//           }
//           if (ck['Max-Age']) {
//             cOpts.maxAge = ck['Max-Age'];
//           }
//           if (ck.SameSite) {
//             cOpts.sameSite = ck.SameSite;
//           }

//           return serialize(cKey, ck[cKey], cOpts);
//         });

//         if (resCokkies) {
//           areCookieOk = true;
//           res.setHeader('Set-Cookie', cookiesToSet);
//         }
//       }
//     }
//   }

//   return {
//     props: { isLoggedIn: areCookieOk, userSubscription: userSubscription },
//   };
// }

export default Browse;
