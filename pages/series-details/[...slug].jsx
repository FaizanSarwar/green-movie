import React, { useEffect, useState } from 'react';
import {
  getSeriesList,
  getSimilarDataList,
  validateUser,
} from '../../services/apiService';
import { useRouter } from 'next/router';
import PageRoutes from '../../config/PageRoutes';
import Details from '../../components/details/Details';
import { sequenceSeasons } from '../../utils/formatData';
import SeasonsTab from '../../components/common/SeasonsTab';
import ListSimilar from '../../components/listing/ListSimilar';
import EpisodeListSlider from '../../components/sliders/EpisodeListSlider';
import VideoPlayer from '../../components/player/VideoPlayer';
import NoSubscription from '../../components/subscription/NoSubscription';
import { getSavedFilmPosition } from '../../services/tgcApi';
import SubscribeModel from '../../components/subscription/SubscribeModel';
import CardPayment from '../../components/subscription/CardPayment';
import InfoModel from '../../components/subscription/InfoModel';

let userSubscripton = '';
let isUserLogin = false;
const SeriesDetailsPage = ({ savedPositionSeconds }) => {
  const router = useRouter();
  const params = router.query.slug;

  const sId = Number(params[0] || 0);
  const season = params[1] || '';
  const epsId = Number(params[2] || 0);

  const [seriesData, setSeriesData] = useState();
  const [selectedEpisodeData, setSelectedEpisodeData] = useState();
  const [trailerUrl, setTrailerUrl] = useState('');
  const [reload, setReload] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubcriptionEnable, setIsSubcriptionEnable] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedSeasonData, setSelectedSeasonData] = useState([]);
  const [similarFilms, setSimilarFilms] = useState([]);
  const [openPlayer, setOpenPlayer] = useState(false);
  const [openNoSubscription, setNoSubscription] = useState(false);
  const [playerData, setPlayerData] = useState({});
  const [rentExpiryData, setRentExpiryData] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isOpenSubscribeModel, setIsOpenSubscribeModel] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [buttonText, setButtonText] = useState('Watch Now');
  const [isOpenRent, setIsOpenRent] = useState(false);
  const [isSample, setIsSample] = useState(false);
  const [isInfoModel, setIsInfoModel] = useState(false);
  const [upgradeText, setupgradeText] = useState('');
  const [subscriptionDetail, setSubscriptionDetail] = useState({
    isSample: false,
    isVod: false,
    isMonthly: false,
    isUserLogin: false,
    episodeId: 0,
    episodeTitle: '',
  });

  useEffect(() => {
    validateUser()
      .then((resp) => {
        if (resp.success) {
          isUserLogin = true;
          setSubscriptionDetail({ ...subscriptionDetail, isUserLogin: true });
          userSubscripton = resp.data.data.subscription_type;
          setIsLoggedIn(true);
        }
      })
      .catch(() => {
        // router.push(PageRoutes.SIGNOUT);
      });
  }, [reload]);

  const checkingSubscription = (data) => {
    const currentTimeStamps = Math.round(Date.now() / 1000);
    const titlePrice = Number(data?.vod_subscription?.price) || 4.99;
    if (
      !isUserLogin &&
      data?.subscription_types?.length === 1 &&
      data?.subscription_types?.includes('monthly')
    ) {
      setButtonText('Subscribe to Watch');
    } else if (!isUserLogin && data?.subscription_types?.includes('sample')) {
      setButtonText('Create an Account');
    } else {
      setButtonText('Subscribe to Watch');
    }

    if (isUserLogin && data?.subscription_types?.includes('sample')) {
      setIsSample(true);
      setIsSubcriptionEnable(true);
    } else if (
      isUserLogin &&
      data?.subscription_types?.includes('monthly') &&
      userSubscripton === 'monthly'
    ) {
      setButtonText('Watch Now');
      setIsSubcriptionEnable(true);
    } else if (
      isUserLogin &&
      data?.subscription_types?.includes('vod') &&
      titlePrice &&
      titlePrice > 0
    ) {
      if (!data?.vod_subscription?.rented) {
        setButtonText('Subscribe to Watch');
        setIsSubcriptionEnable(false);
      } else if (
        data?.vod_subscription?.rented &&
        currentTimeStamps >= data?.vod_subscription?.period_start &&
        data?.vod_subscription?.period_end <= currentTimeStamps
      ) {
        setRentExpiryData(data?.vod_subscription || {});
        setIsSubcriptionEnable(true);
      }
    } else if (
      isUserLogin &&
      data?.subscription_types?.includes(userSubscripton)
    ) {
      setIsSubcriptionEnable(true);
    } else if (isUserLogin) {
      setButtonText('Subscribe to Watch');
      setIsSubcriptionEnable(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    validateUser()
      .then((resp) => {
        if (resp.success) {
          isUserLogin = true;
          userSubscripton = resp.data.data.subscription_type;
          setIsLoggedIn(true);
        }
      })
      .catch(() => {
        // router.push(PageRoutes.SIGNOUT);
      });
    getSeriesList()
      .then((res) => {
        if (res.status === 'success') {
          const sData = res.data.filter((s) => s.id === sId)[0];
          if (sData) {
            const seasons = [];
            const seasonsData = {};
            setTrailerUrl(sData.trailer_url);

            Object.entries(sData.seasons).map((s) => {
              var seasonText = s[0]
                .replace(/-/g, ' ')
                .replace(/^./, function (x) {
                  return x.toUpperCase();
                });
              seasons.push({
                id: s[0],
                text: seasonText,
                sId,
              });
              seasonsData[s[0]] = s[1].episodes.map((e) => ({
                id: e.id,
                title: e.title,
                posterUrl: e.poster_url,
                synopsis: e.synopsis,
                duration: e.duration_mins,
                year: e.production_year,
                credit: e.director_and_cast,
                videoUrl: e.film_url,
                season: s[0],
                subscription_types: e?.subscription_types || {},
                vod_subscription: e?.vod_subscription || {},
                sId,
              }));
            });
            const sortSeasons = sequenceSeasons(seasons);
            setSeriesData({
              seasons: sortSeasons || [],
              seasonsData: seasonsData || null,
            });

            const payload = {
              id: sId,
            };
            getSimilarDataList(payload)
              .then((response) => {
                if (
                  response &&
                  response.status === 'success' &&
                  response.data
                ) {
                  setSimilarFilms(response.data);
                }
              })
              .catch(() => {
                // Handle Error
              });

            if (seasons.length > 0) {
              setSelectedSeason(season || sortSeasons[0].id);
              setSelectedSeasonData([]);
              const selectedSeasonData =
                seasonsData?.[season || sortSeasons[0].id];
              if (selectedSeasonData) {
                setSelectedSeasonData(selectedSeasonData);
                const epData = {};
                if (epsId) {
                  const find = selectedSeasonData.filter((f) => f.id === epsId);
                  epData = find[0] || selectedSeasonData[0];
                } else {
                  epData = selectedSeasonData[0];
                }
                checkingSubscription(epData);
                setSelectedEpisodeData({
                  id: epData.id,
                  title: epData.title,
                  posterUrl: epData.posterUrl,
                  synopsis: epData.synopsis,
                  duration: epData.duration,
                  year: epData.year,
                  credit: epData.credit,
                  videoUrl: epData.videoUrl,
                  subscription_types: epData.subscription_types,
                  vod_subscription: epData.vod_subscription,
                });
              }
            }
          } else {
            setNotFound(true);
          }
        }

        setIsLoading(false);
      })
      .catch((e) => {
        //TODO: handle error
        setIsLoading(false);
      });
  }, [sId]);

  useEffect(() => {
    const find = selectedSeasonData.filter((f) => f.id === epsId);
    const epData = find[0];
    if (epData) {
      checkingSubscription(epData);
      setSelectedEpisodeData({
        id: epData.id,
        title: epData.title,
        posterUrl: epData.posterUrl,
        synopsis: epData.synopsis,
        duration: epData.duration,
        year: epData.year,
        credit: epData.credit,
        videoUrl: epData.videoUrl,
      });
    }
  }, [epsId]);

  useEffect(() => {
    setSelectedSeason(season);
    setSelectedSeasonData([]);
    const selectedSeasonData = seriesData?.seasonsData?.[season];
    if (selectedSeasonData) {
      setTimeout(() => {
        setSelectedSeasonData(selectedSeasonData);
      }, 100);

      const epData = {};
      if (epsId) {
        const find = selectedSeasonData.filter((f) => f.id === epsId);
        epData = find[0] || selectedSeasonData[0];
      } else {
        epData = selectedSeasonData[0];
      }
      checkingSubscription(epData);
      setSelectedEpisodeData({
        id: epData.id,
        title: epData.title,
        posterUrl: epData.posterUrl,
        synopsis: epData.synopsis,
        duration: epData.duration,
        year: epData.year,
        credit: epData.credit,
        videoUrl: epData.videoUrl,
      });
    }
  }, [season]);

  const changeSeason = (s) => {
    if (s !== selectedSeason) {
      setSelectedSeason(s);
    }
  };

  const handlePlayer = (d, isTrailer = false) => {
    const url = isTrailer ? trailerUrl : d.videoUrl;
    setPlayerData({
      isSeries: !isTrailer,
      poster: d.posterUrl,
      src: url,
      title: d.title || '',
      synopsis: d.synopsis || '',
      selectedSeasonData,
      startFrom: savedPositionSeconds,
    });
    if (url) {
      setOpenPlayer(true);
    }
  };

  const closePlayer = () => {
    setPlayerData(null);
    setOpenPlayer(false);
  };

  const onWatch = () => {
    if (isLoggedIn && isSubcriptionEnable) {
      handlePlayer(selectedEpisodeData);
    } else if (!isUserLogin || !isSubcriptionEnable) {
      setIsInfoModel(true);
    }
  };

  const openSubscribeModel = () => {
    setNoSubscription(false);
    if (!isLoggedIn) {
      router.push(PageRoutes.SIGNIN);
    } else {
      setIsOpenSubscribeModel(true);
    }
  };

  const confirmPayment = () => {
    setIsOpenSubscribeModel(false);
    setReload(!reload);
  };

  useEffect(() => {
    if (selectedEpisodeData && selectedEpisodeData.duration) {
      setProgress(
        Math.ceil(
          (savedPositionSeconds / (selectedEpisodeData.duration * 60)) * 100
        )
      );
    }
  }, [
    selectedEpisodeData,
    selectedEpisodeData?.duration,
    savedPositionSeconds,
  ]);

  const manageRent = () => {
    setIsOpenRent(!isOpenRent);
  };

  const onEpisodeClick = (data) => {
    const obj = {
      ...subscriptionDetail,
    };
    if (isLoggedIn && data?.vod_subscription?.rented) {
      handlePlayer(data);
    } else if (isLoggedIn && isSubcriptionEnable) {
      handlePlayer(data);
    } else {
      obj.episodeId = data?.id || 0;
      obj.episodeTitle = data?.title || '';
      if (data?.subscription_types.includes('sample')) {
        obj.isSample = true;
      }

      if (data?.subscription_types.includes('vod')) {
        obj.isVod = true;
      }

      if (data?.subscription_types.includes('monthly')) {
        obj.isMonthly = true;
      }
      setSubscriptionDetail(obj);
      setIsInfoModel(true);
    }
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

  return notFound ? (
    <div className="page-container sample-page">No Series Found</div>
  ) : (
    <>
      <div className="page-container">
        <div className="details-container">
          <Details
            data={selectedEpisodeData}
            selectedSeason={selectedSeason}
            openPlayer={handlePlayer}
            trailerUrl={trailerUrl}
            onWatchClick={onWatch}
            isSubscriptionEnabled={isSubcriptionEnable}
            progress={progress}
            buttonText={buttonText}
            rentExpiryData={rentExpiryData}
            manageRent={manageRent}
            isSample={isSample}
            isSeries={true}
          />
          <div>
            <div className="mt-2 container">
              <SeasonsTab
                seasons={seriesData?.seasons || []}
                selectedSeason={selectedSeason}
                onChange={(s) => changeSeason(s)}
              />
            </div>
            {selectedSeasonData.length > 0 && (
              <div className="mt-4 min-h-300">
                <EpisodeListSlider
                  data={selectedSeasonData || []}
                  onEpisodeClick={onEpisodeClick}
                />
              </div>
            )}
          </div>
          {similarFilms && similarFilms.length > 0 && (
            <div className="container">
              <div className="detail-similar-title">You may like</div>
              <ul className="row list-inline p-0 m-0">
                <ListSimilar data={similarFilms} type="series" />
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
                  <VideoPlayer
                    data={playerData}
                    closePlayer={closePlayer}
                    currentEpiId={selectedEpisodeData?.id}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {openNoSubscription && (
          <NoSubscription
            reason="not-subscribed"
            data={{
              title: selectedEpisodeData.title || '',
              synopsis: selectedEpisodeData.synopsis || '',
              posterUrl: selectedEpisodeData.posterUrl,
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
          />
        )}
        {isOpenRent && (
          <CardPayment
            filmId={subscriptionDetail.episodeId}
            title={subscriptionDetail.episodeTitle}
            upgradeText={upgradeText}
            onClose={() => setIsOpenRent(false)}
            onConfirm={() => window.location.reload()}
          />
        )}
        {isInfoModel && (
          <InfoModel
            isSample={subscriptionDetail.isSample}
            isVod={subscriptionDetail.isVod}
            isMonthly={subscriptionDetail.isMonthly}
            isUserLogin={subscriptionDetail.isUserLogin}
            onClose={() => setIsInfoModel(false)}
            onConfirm={(t) => onSuccessInfo(t)}
          />
        )}
      </div>
    </>
  );
};

export const getServerSideProps = async ({ req, res, params }) => {
  let savedPositionSeconds = 0;

  try {
    const filmId = Number(params.id) || 0;
    const result = await getSavedFilmPosition(filmId, req.headers.cookie);

    savedPositionSeconds = result.data.data.position_seconds || 0;
  } catch (error) {
    //skip error
  }

  return {
    props: {
      savedPositionSeconds,
    },
  };
};
export default SeriesDetailsPage;
