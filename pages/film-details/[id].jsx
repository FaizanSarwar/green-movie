import React, { useEffect, useState } from 'react';
import { getSavedFilmPosition } from '../../services/tgcApi';
import { useRouter } from 'next/router';
import Details from '../../components/details/Details';
import ListSimilar from '../../components/listing/ListSimilar';
import VideoPlayer from '../../components/player/VideoPlayer';
import NoSubscription from '../../components/subscription/NoSubscription';
import PageRoutes from '../../config/PageRoutes';
import SubscribeModel from '../../components/subscription/SubscribeModel';
import Product from '../../components/common/Product';
import { getExpiryDays } from '../../utils/formatData';
import {
  validateUser,
  getFilmsList,
  getSimilarDataList,
} from '../../services/tgcApi';
import CardPayment from '../../components/subscription/CardPayment';
import InfoModel from '../../components/subscription/InfoModel';
import { getClientIp } from '../../utils/getClientIp';
import { features } from '../../services/features';

const FilmDetailsPage = ({
  savedPositionSeconds,
  filmDetail,
  isSubcriptionEnable,
  trailerUrl,
  similarFilms,
  isUserLogin,
  filmProgress,
  rentExpiryData,
  isSample,
  subscriptionTypes,
  isVod,
  isMonthly,
  userSubscripton,
}) => {
  const router = useRouter();
  let from = router.query.from || '';
  const [reload, setReload] = useState(false);
  const [openPlayer, setOpenPlayer] = useState(false);
  const [openNoSubscription, setNoSubscription] = useState(false);
  const [playerData, setPlayerData] = useState({});
  const [isOpenSubscribeModel, setIsOpenSubscribeModel] = useState(false);
  const [isOpenProductModel, setIsOpenProductModel] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState('');
  const [isOpenRent, setIsOpenRent] = useState(false);
  const [isInfoModel, setIsInfoModel] = useState(false);
  const [upgradeText, setupgradeText] = useState('');

  const handlePlayer = (d, isTrailer = false) => {
    const url = isTrailer ? trailerUrl : d.film_url;
    setPlayerData({
      isSeries: false,
      poster: d.posterUrl,
      src: url,
      title: d.title || '',
      synopsis: d.synopsis || '',
      startFrom: savedPositionSeconds,
    });
    if (url) {
      setOpenPlayer(true);
    }
  };

  const closePlayer = () => {
    setPlayerData(null);
    setOpenPlayer(false);
    router.reload();
  };

  const onWatch = () => {
    if (isUserLogin && isSubcriptionEnable) {
      handlePlayer(filmDetail);
    } else if (!isUserLogin || !isSubcriptionEnable) {
      setIsInfoModel(true);
    }
    // else if (!isSubcriptionEnable) {
    //   setNoSubscription(true);
    // }
  };

  const onSuccessInfo = (action) => {
    if (!isUserLogin) {
      const url = `${PageRoutes.SELECTPLAN}?from=${
        action === 'subscription'
          ? 'subscription'
          : action === 'sample'
          ? 'sample'
          : 'rent-create'
      }`;
      url += `&redirect=${encodeURIComponent(router?.asPath)}`;
      router.push(url);
    } else {
      setupgradeText(action === 'subscription' ? 'subscription' : 'rent');
      setIsInfoModel(false);
      setIsOpenRent(true);
    }
  };

  const openSubscribeModel = () => {
    setNoSubscription(false);
    if (!isUserLogin) {
      router.push(PageRoutes.SIGNIN);
    } else {
      setIsOpenProductModel(true);
    }
  };

  const confirmPayment = () => {
    setIsOpenSubscribeModel(false);
    window.location.reload();
  };

  const confirmProduct = (type) => {
    setSubscriptionType(type);
    setIsOpenProductModel(false);
    setTimeout(() => {
      setIsOpenSubscribeModel(true);
    }, 500);
  };

  const manageRent = () => {
    setIsOpenRent(!isOpenRent);
  };

  return !filmDetail || filmDetail === null ? (
    <div className="page-container sample-page">No Film Found</div>
  ) : (
    <>
      <div className="page-container">
        <div className="details-container">
          {filmDetail && (
            <Details
              data={filmDetail}
              openPlayer={handlePlayer}
              trailerUrl={trailerUrl}
              onWatchClick={onWatch}
              isSubscriptionEnabled={isSubcriptionEnable}
              progress={filmProgress}
              rentExpiryData={rentExpiryData}
              manageRent={manageRent}
              isSample={isSample}
            />
          )}
          {isSample &&
            userSubscripton !== 'monthly' &&
            rentExpiryData?.enabled &&
            rentExpiryData?.period_end > 0 && (
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <div className="free-sample-content-text-availability">
                      {`Free Until ${getExpiryDays(rentExpiryData, true)}`}
                    </div>
                  </div>
                </div>
              </div>
            )}
          {similarFilms.length > 0 && (
            <div className="container">
              <div className="detail-similar-title">You may like</div>
              <ul className="row-list-slider row list-inline p-0 m-0">
                <ListSimilar
                  data={similarFilms}
                  type="film"
                  from="subscription"
                />
              </ul>
            </div>
          )}
        </div>
        {openPlayer && (
          <div className="modal show" style={{ display: 'block' }}>
            <div className="modal-dialog modal-lg video-player-modal">
              <div className="modal-content">
                <button className="player-close btn" onClick={closePlayer}>
                  <i className="ri-close-line"></i>
                </button>
                <div className="modal-body d-flex flex-column p-0">
                  <VideoPlayer data={playerData} closePlayer={closePlayer} />
                </div>
              </div>
            </div>
          </div>
        )}
        {openNoSubscription && (
          <NoSubscription
            reason="not-subscribed"
            data={{
              title: filmDetail?.title || '',
              synopsis: filmDetail?.synopsis || '',
              posterUrl: filmDetail?.posterUrl,
            }}
            onClose={() => setNoSubscription(false)}
            onConfirm={() => openSubscribeModel()}
          />
        )}
        {isOpenSubscribeModel && (
          <SubscribeModel
            nameClass="details-container"
            onClose={() => setIsOpenSubscribeModel(false)}
            onConfirm={() => confirmPayment()}
            subscriptionType={subscriptionType}
          />
        )}
        {isOpenProductModel && (
          <Product
            nameClass="details-container"
            onClose={() => setIsOpenProductModel(false)}
            onConfirm={(type) => confirmProduct(type)}
            type={from}
            page="account"
          />
        )}
        {isOpenRent && (
          <CardPayment
            filmId={filmDetail?.id || 0}
            title={filmDetail?.title || ''}
            upgradeText={upgradeText}
            onClose={() => setIsOpenRent(false)}
            onConfirm={() => window.location.reload()}
          />
        )}
        {isInfoModel && (
          <InfoModel
            isSample={isSample}
            isVod={isVod}
            isMonthly={isMonthly}
            isUserLogin={isUserLogin}
            onClose={() => setIsInfoModel(false)}
            onConfirm={(t) => onSuccessInfo(t)}
          />
        )}
      </div>
    </>
  );
};

export const getServerSideProps = async ({ req, res, params }) => {
  // console.log(params);
  let savedPositionSeconds = 0;
  let userSubscripton = '';
  let isUserLogin = false;
  let filmDetail = null;
  let isSubcriptionEnable = false;
  let trailerUrl = '';
  let similarFilms = [];
  let filmProgress = 0;
  let rentExpiryData = null;
  let isSample = false;
  let isMonthly = false;
  let isVod = false;
  let subscriptionTypes = null;
  try {
    const filmId = Number(params.id) || 0;
    const clientIp = getClientIp(req);
    const validateRes = await validateUser(req.headers.cookie);
    if (validateRes && validateRes?.success) {
      isUserLogin = true;
      userSubscripton = validateRes?.data?.data?.subscription_type || false;
    }
    // const filmList = await getFilmsList(req.headers.cookie, clientIp);
    const filmList = features;
    // console.log(filmList);
    // if (filmList && filmList.success) {
    const currentTimeStamps = Math.round(Date.now() / 1000);
    const filmsData = filmList || [];
    filmDetail = filmsData.filter((f) => f.id === filmId)[0] || null;
    // console.log(filmDetail);
    subscriptionTypes = filmDetail?.subscription_types || null;
    if (filmDetail?.duration && filmDetail?.duration > 0) {
      filmProgress =
        Math.ceil((savedPositionSeconds / (filmDetail?.duration * 60)) * 100) ||
        0;
    }
    const titlePrice = Number(filmDetail?.vod_subscription?.price) || 4.99;

    isSample = filmDetail?.subscription_types.includes('sample') ? true : false;
    isVod = filmDetail?.subscription_types.includes('vod') ? true : false;
    isMonthly = filmDetail?.subscription_types.includes('monthly')
      ? true
      : false;

    if (isUserLogin && filmDetail?.subscription_types.includes('sample')) {
      isSample = true;
      isSubcriptionEnable = true;
      rentExpiryData = filmDetail?.vod_subscription || {};
      rentExpiryData.titlePrice = titlePrice;
    } else if (
      isUserLogin &&
      filmDetail?.subscription_types.includes('monthly') &&
      userSubscripton === 'monthly'
    ) {
      isSubcriptionEnable = true;
    } else if (
      isUserLogin &&
      filmDetail?.subscription_types.includes('vod') &&
      titlePrice &&
      titlePrice > 0
    ) {
      if (!filmDetail?.vod_subscription?.rented) {
        isSubcriptionEnable = false;
        rentExpiryData = filmDetail?.vod_subscription || {};
        rentExpiryData.titlePrice = titlePrice;
      } else if (
        filmDetail?.vod_subscription?.rented &&
        filmDetail?.vod_subscription?.period_end >= currentTimeStamps
      ) {
        rentExpiryData = filmDetail?.vod_subscription || {};
        rentExpiryData.titlePrice = titlePrice;
        isSubcriptionEnable = true;
      }
    } else if (
      isUserLogin &&
      filmDetail?.subscription_types.includes(userSubscripton)
    ) {
      isSubcriptionEnable = true;
    } else if (isUserLogin) {
      isSubcriptionEnable = false;
    }

    trailerUrl = filmDetail?.trailer_url || '';
    //original
    // const similarData = await getSimilarDataList(filmId, req.headers.cookie);
    const similarData = features.slice(0, 12);
    //original
    // if (similarData && similarData?.success && similarData?.data?.data) {
    similarFilms = similarData || [];
    // console.log(similarFilms);

    // }
    // }
    const result = await getSavedFilmPosition(filmId, req.headers.cookie);
    savedPositionSeconds = result?.data?.data?.position_seconds || 0;
  } catch (error) {
    //skip error
  }

  return {
    props: {
      savedPositionSeconds,
      filmDetail,
      isSubcriptionEnable,
      trailerUrl,
      similarFilms,
      isUserLogin,
      filmProgress,
      rentExpiryData,
      isSample,
      subscriptionTypes,
      isVod,
      isMonthly,
      userSubscripton,
    },
  };
};

// export function getStaticPaths() {
//   const filmIds = features; // Function to get all film IDs

//   const paths = filmIds.map((val) => ({
//     params: { id: val.id.toString() }, // params must be a string
//   }));

//   return {
//     paths,
//     fallback: false, // You can set this to true if you want to handle unknown paths with a custom 404 page
//   };
// }

// export async function getStaticProps({ params }) {
//   let savedPositionSeconds = 0;
//   let userSubscription = '';
//   let isUserLogin = false;
//   let filmDetail = null;
//   let isSubscriptionEnabled = false;
//   let trailerUrl = '';
//   let similarFilms = [];
//   let filmProgress = 0;
//   let rentExpiryData = null;
//   let isSample = false;
//   let isMonthly = false;
//   let isVod = false;
//   let subscriptionTypes = null;

//   try {
//     const filmId = Number(params.id) || 0;
//     const currentTimeStamps = Math.round(Date.now() / 1000);
//     const filmList = features; // Use your film data module here
//     filmDetail = filmList.find((f) => f.id === filmId) || null;

//     const validateRes = await validateUser(''); // Stubbed value as getStaticProps doesn't have access to request headers

//     if (validateRes && validateRes.success) {
//       isUserLogin = true;
//       userSubscription = validateRes.data?.data?.subscription_type || false;
//     }

//     subscriptionTypes = filmDetail?.subscription_types || null;

//     if (filmDetail?.duration && filmDetail.duration > 0) {
//       filmProgress =
//         Math.ceil((savedPositionSeconds / (filmDetail.duration * 60)) * 100) ||
//         0;
//     }

//     const titlePrice = Number(filmDetail?.vod_subscription?.price) || 4.99;

//     isSample = filmDetail?.subscription_types.includes('sample') || false;
//     isVod = filmDetail?.subscription_types.includes('vod') || false;
//     isMonthly = filmDetail?.subscription_types.includes('monthly') || false;

//     if (isUserLogin && filmDetail?.subscription_types.includes('sample')) {
//       isSample = true;
//       isSubscriptionEnabled = true;
//       rentExpiryData = filmDetail?.vod_subscription || {};
//       rentExpiryData.titlePrice = titlePrice;
//     } else if (
//       isUserLogin &&
//       filmDetail?.subscription_types.includes('monthly') &&
//       userSubscription === 'monthly'
//     ) {
//       isSubscriptionEnabled = true;
//     } else if (
//       isUserLogin &&
//       filmDetail?.subscription_types.includes('vod') &&
//       titlePrice &&
//       titlePrice > 0
//     ) {
//       if (!filmDetail?.vod_subscription?.rented) {
//         isSubscriptionEnabled = false;
//         rentExpiryData = filmDetail?.vod_subscription || {};
//         rentExpiryData.titlePrice = titlePrice;
//       } else if (
//         filmDetail?.vod_subscription?.rented &&
//         filmDetail?.vod_subscription?.period_end >= currentTimeStamps
//       ) {
//         rentExpiryData = filmDetail?.vod_subscription || {};
//         rentExpiryData.titlePrice = titlePrice;
//         isSubscriptionEnabled = true;
//       }
//     } else if (
//       isUserLogin &&
//       filmDetail?.subscription_types.includes(userSubscription)
//     ) {
//       isSubscriptionEnabled = true;
//     }

//     trailerUrl = filmDetail?.trailer_url || '';

//     const similarData = features.slice(0, 12); // Stubbed value as getStaticProps doesn't have access to request headers
//     similarFilms = similarData || [];

//     const result = await getSavedFilmPosition(filmId, ''); // Stubbed value as getStaticProps doesn't have access to request headers
//     savedPositionSeconds = result?.data?.data?.position_seconds || 0;
//   } catch (error) {
//     // Skip error
//   }

//   return {
//     props: {
//       savedPositionSeconds,
//       filmDetail,
//       isSubscriptionEnabled,
//       trailerUrl,
//       similarFilms,
//       isUserLogin,
//       filmProgress,
//       rentExpiryData,
//       isSample,
//       subscriptionTypes,
//       isVod,
//       isMonthly,
//       userSubscription,
//     },
//   };
// }

export default FilmDetailsPage;
