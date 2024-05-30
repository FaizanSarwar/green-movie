/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import '@videojs/http-streaming';
import 'videojs-plus';
import 'videojs-plus/dist/videojs-plus.css';
import formatDuration from '../../utils/Time';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { getFilmPosition, saveFilmPosition } from '../../services/apiService';
import Seo from '../common/Seo';

const VideoPlayer = ({ data, currentEpiId }) => {
  const router = useRouter();
  const pageSeo = {
    title: 'Start Watching Environmental Movies with The Green Channel',
    description:
      "Watch today's top nature, animal, and environmental movies or series with The Green Channel online streaming service. Not a member yet? Sign up today!",
    keyword: 'environmental movies',
  };

  const params = router.query.slug;

  const epsId = data.isSeries ? Number(params[2] || 0) : 0;

  const playerId = 'my-player';
  const playerRef = useRef();

  const vPRef = useRef();
  const playerObj = {
    currentData: null,
    isFullScreen: false,
    isPlaying: false,
  };
  let currentEpisodeIndex = -1;
  let lastVideoWatchProgress = 0;
  let player = null;
  let playerTimerLimit = 10;
  let nextEpiTimer = null;

  const videoPlayerOptions = {
    responsive: true,
    controls: true,
    autoplay: false,
    poster: data.poster,
    aspectRatio: '16:7',
    html5: {
      hls: {
        withCredentials: true,
      },
    },
  };

  const getNextEpisodeData = () => {
    if (data.isSeries) {
      const isNextEpisodeAvailable =
        data.selectedSeasonData[currentEpisodeIndex + 1];
      if (isNextEpisodeAvailable) {
        return {
          id: data.selectedSeasonData[currentEpisodeIndex + 1].id,
          poster: data.selectedSeasonData[currentEpisodeIndex + 1]?.posterUrl,
          src: data.selectedSeasonData[currentEpisodeIndex + 1].url,
          title: data.selectedSeasonData[currentEpisodeIndex + 1].title || '',
          synopsis:
            data.selectedSeasonData[currentEpisodeIndex + 1].synopsis || '',
          year: data.selectedSeasonData.year,
          duration:
            data.selectedSeasonData[currentEpisodeIndex + 1].duration || '',
        };
      }
    }
    return null;
  };

  if (data.isSeries) {
    currentEpisodeIndex = data.selectedSeasonData.indexOf(
      data.selectedSeasonData.find((e) => e.id === currentEpiId)
    );
    currentEpisodeIndex =
      currentEpisodeIndex < 0 ? -1 : currentEpisodeIndex - 1;

    const currentEpiData = getNextEpisodeData();
    playerObj.currentData = currentEpiData;
  } else {
    const fId = Number(router.query.id || 0);
    playerObj.currentData = {
      id: fId,
      poster: data.posterUrl,
      src: data.url,
      title: data.title || '',
      synopsis: data.synopsis || '',
      year: data.year,
      duration: data.duration || '',
    };
    currentEpisodeIndex = 0;
  }

  const addDetailOverlay = () => {
    return `
    <div class="overlay-detail-section-wrapper">
      <div class="overlay-detail-section ${
        playerObj.isFullScreen ? `pt-100` : ``
      }">
          <a class="navbar-brand" id="logo-link">
            <img
              width="40"
              height="40"
              class="icon-logo img"
              src="/images/tgc-logo-icon.png"
              alt="The Green Channel"
            />
          </a>
          <div class="detail-title clamp-2line">${
            playerObj.currentData?.title
          }</div>
          <div class="detail-synopsis clamp-3line w-50">${
            playerObj.currentData?.synopsis
          }</div>
      </div>
    </div>
    `;
  };

  const resumeOptions = () => {
    return `
      <div id="resume-options" class="resume-section">
          <div class="detail-title clamp-2line">Do you want to resume play?</div>
          <div class="d-flex w-100 p-2">
            <button id="restart-play-btn" class="btn green-outlined-button mt-3 w-50 mr-3">Restart</button>
            <button id="resume-btn" class="btn green-filled-button mt-3 mr-1 w-40">Continue from last time</button>
          </div>
      </div>`;
  };

  const removeResumeOptions = () => {
    window.jQuery(`#${playerId} #resume-options`).remove();
  };

  const playNextEpisode = () => {
    if (nextEpiTimer) {
      clearTimeout(nextEpiTimer);
    }

    if (data.isSeries) {
      if (vPRef.current) {
        if (!vPRef.current?.paused) {
          vPRef.current?.pause();
        }
        const nextData = getNextEpisodeData();
        playerObj.currentData = nextData;
        currentEpisodeIndex = currentEpisodeIndex + 1;

        vPRef.current?.src({
          src: data?.selectedSeasonData[currentEpisodeIndex + 1].src,
        });
        vPRef.current?.poster(
          data?.selectedSeasonData[currentEpisodeIndex].posterUrl
        );

        vPRef.current?.load();
        setResumeProgress(true);
      }
      removeNextEpisode();
    }
  };

  const setResumeProgress = (defaultPlay = false) => {
    const lastPosition = 0;
    if (lastPosition > 0) {
      player.pause();
      window
        .jQuery(`#${playerId} .vjs-play-toggle-layer`)
        .html(addDetailOverlay());
      window.jQuery(`#${playerId}`).append(resumeOptions());

      window.jQuery(`#restart-play-btn`).on('click', () => {
        player.currentTime(0);
        player.play();
      });
      window.jQuery(`#resume-btn`).on('click', () => {
        player.currentTime(lastPosition);
        player.play();
      });
    } else if (defaultPlay) {
      player.currentTime(0);
      player.play();
    }
    getFilmPosition(playerObj.currentData.id)
      .then((res) => {
        if (res.success) {
          const lastPosition = res.data.data.position_seconds;
          if (lastPosition > 0) {
            player.pause();
            window
              .jQuery(`#${playerId} .vjs-play-toggle-layer`)
              .html(addDetailOverlay());
            window.jQuery(`#${playerId}`).append(resumeOptions());

            window.jQuery(`#restart-play-btn`).on('click', () => {
              player.currentTime(0);
              player.play();
            });
            window.jQuery(`#resume-btn`).on('click', () => {
              player.currentTime(lastPosition);
              player.play();
            });
          } else if (defaultPlay) {
            player.currentTime(0);
            player.play();
          }
        }
      })
      .catch(() => {
        player.currentTime(0);
        player.play();
      });
  };

  const getMinsString = (mins) => {
    if (mins.length > 1) return `${mins}:00 mins`;
    return `0${mins}:00 mins`;
  };

  const setNextEpisodeTimer = () => {
    if (playerTimerLimit === 0) {
      playNextEpisode();
    }

    if (playerTimerLimit > 0) {
      nextEpiTimer = setTimeout(() => {
        playerTimerLimit -= 1;
        window.jQuery('.next-episode-timer').html(`${playerTimerLimit}s`);
        setNextEpisodeTimer();
      }, 1000);
    } else {
      window.jQuery('.next-episode-timer').html(`0s`);
      playerTimerLimit = 10;
    }
  };

  const nextEpisodeOverlay = (nextEpisodeData) => {
    const duration = getMinsString(nextEpisodeData?.duration) || '';
    return `<div
        key=${nextEpisodeData.id}
        id="end-screen-overlay"
        class="end-screen-container w-100">
        <div class="container w-100 d-flex flex-row">
          <div class="pr-2 d-flex justify-content-center" style="width: 30%">
            <div
              class="d-flex flex-column  align-items-center align-items-xs-start"
              style="font-size: 1.5rem: text-align: center">
              <h6 style="font-weight: bolder">Playing next video in</h6>
              <h1 class="next-episode-timer my-2 px-5">${playerTimerLimit}s</h1>
              <div class="px-0 px-xs-5  next-episode-btn-container d-flex flex-xs-row flex-md-column">
                <button id="next-episode-btn" class="btn green-filled-button mt-3 mr-1 mb-1">Watch next episode</button>
                <button id="close-player" class="btn green-outlined-button mt-3">
                  Cancel
                </button>
              </div>
            </div>
          </div>
          <div class="pr-2 d-flex justify-content-center" style="width: 30%">
            <div
              class="next-episode-image"
              style="background-image: url(${
                nextEpisodeData?.poster
              }); position: relative">
              <div class="next-episode-image-info d-flex justify-content-between">
                <span>${duration}</span>
                <span>${nextEpisodeData.year || ''}</span>
              </div>
            </div>
          </div>
          <div style="width: 30%">
            <h6 style="font-size: 1.5rem; font-weight: bold">
              ${nextEpisodeData?.title || ''}
            </h6>
            <div class="next-episode-synopsis">
              <p class="mt-2 ">${nextEpisodeData?.synopsis || ''}</p>
            </div>
          </div>
        </div>
      </div>`;
  };

  const handleNextEpisode = () => {
    const nextEpisodeData = getNextEpisodeData();
    if (nextEpisodeData) {
      window.jQuery(`#${playerId}`).append(nextEpisodeOverlay(nextEpisodeData));
      nextEpiTimer = setTimeout(() => setNextEpisodeTimer(), 1000);
      window.jQuery(`#next-episode-btn`).on('click', () => {
        playNextEpisode();
      });
      window.jQuery(`#close-player`).on('click', () => {
        window.jQuery('.player-close').click();
      });
    }
  };

  const removeNextEpisode = () => {
    window.jQuery(`#${playerId} #end-screen-overlay`).remove();
  };

  useEffect(() => {
    removeNextEpisode();

    if (data.isSeries) {
      const epsiodeArray = data.selectedSeasonData.map((f) => f.id);
      const cEpIdx = epsiodeArray.indexOf(epsId);
      if (cEpIdx >= 0) {
        currentEpisodeIndex = cEpIdx;
      }
    }

    player = vPRef.current = videojs(playerId, videoPlayerOptions, () => {
      player.src({
        src: data.src,
        withCredentials: true,
      });

      player.on('play', () => {
        removeResumeOptions();
        playerObj.isPlaying = true;
        window.jQuery(`#player-back`).remove();
        window.jQuery(`#${playerId} .vjs-play-toggle-layer`).html('');
        window.jQuery(`#play-pause-icon`).html(`<i class="ri-pause-fill"></i>`);
      });
      player.on('pause', () => {
        removeResumeOptions();
        playerObj.isPlaying = false;
        window
          .jQuery(`#${playerId} .vjs-play-toggle-layer`)
          .html(addDetailOverlay());

        window.jQuery(`#play-pause-icon`).html(`<i class="ri-play-fill"></i>`);
        if (playerObj.isFullScreen) {
          window
            .jQuery(`#${playerId}`)
            .append(
              `${
                playerObj.isFullScreen
                  ? `<div id="player-back" class="player-back-icon"><i class="ri-arrow-left-line"></i></div>`
                  : ''
              }`
            );
          window.jQuery('#player-back').on('click', () => {
            window.jQuery('.vjs-fullscreen-control').click();
          });
        }
      });
      player.on('loadedmetadata', () => {
        const duration = formatDuration(Math.floor(player.duration()));
        window.jQuery(`#${playerId} #total-time`).html(duration);
      });
      player.on('timeupdate', () => {
        const currentTimeInSec = Math.floor(player.currentTime());
        const currentDuration = formatDuration(currentTimeInSec);
        window.jQuery(`#${playerId} #current-time`).html(currentDuration);

        if (
          currentTimeInSec % 5 === 0 &&
          lastVideoWatchProgress !== currentTimeInSec
        ) {
          lastVideoWatchProgress = currentTimeInSec;
          try {
            saveFilmPosition({
              filmId: playerObj.currentData.id,
              posInSec: currentTimeInSec,
            });
          } catch (error) {
            //skip error
          }
        }
      });
      player.on('fullscreenchange', (e) => {
        const isOnFullScreen = player.isFullscreen();
        playerObj.isFullScreen = isOnFullScreen;
        if (!isOnFullScreen) {
          window.jQuery(`#player-back`).remove();
        }
        if (!playerObj.isPlaying) {
          window
            .jQuery(`#${playerId} .vjs-play-toggle-layer`)
            .html(addDetailOverlay());

          window
            .jQuery(`#${playerId}`)
            .append(
              `${
                isOnFullScreen
                  ? `<div id="player-back" class="player-back-icon"><i class="ri-arrow-left-line"></i></div>`
                  : ''
              }`
            );
          window.jQuery('#player-back').on('click', () => {
            window.jQuery('.vjs-fullscreen-control').click();
          });
        }
      });
      player.on('ended', () => {
        handleNextEpisode();
        window.jQuery(`#${playerId} .vjs-play-toggle-layer`).html('');
      });
    });
    window
      .jQuery(`#${playerId} .vjs-play-toggle-layer`)
      .html(addDetailOverlay());

    window.jQuery(`#${playerId} .vjs-control-bar .middle`).remove();
    window.jQuery(`#${playerId} .vjs-control-bar .vjs-volume-control`).remove();
    window.jQuery(`#${playerId} .vjs-control-bar .vjs-current-time`).remove();
    window.jQuery(`#${playerId} .vjs-control-bar .vjs-time-divider`).remove();
    window.jQuery(`#${playerId} .vjs-control-bar .vjs-duration`).remove();
    window.jQuery(`#${playerId} .vjs-progress-control`).append(
      `<div class="player-time">
          <div id="current-time">00:00:00</div>
          &nbsp;/&nbsp;
          <div id="total-time">00:00:00</div>
        </div>`
    );
    window
      .jQuery(
        `#${playerId} .vjs-control-bar .bottom .vjs-custom-control-spacer`
      )
      .append(
        `<div class="custom-control-container">
          <div id="rw-icon" class="rw-icon"><img
              width="25"
              height="25"
              class="icon-logo img"
              src="/images/rw-icon.png"
              alt="Rewind"
            /></div>
          <div id="play-pause-icon" class="play-pause-icon"><i class="ri-play-fill"></i></div>
          <div id="ff-icon" class="ff-icon">
          <img
              width="25"
              height="25"
              class="icon-logo img"
              src="/images/ff-icon.png"
              alt="Fast Forward"
            /></div>
        </div>`
      );

    window.jQuery(`#play-pause-icon`).on('click', () => {
      if (playerObj.isPlaying) {
        player.pause();
        window.jQuery(`#play-pause-icon`).html(`<i class="ri-play-fill"></i>`);
        playerObj.isPlaying = false;
      } else {
        player.play();
        window.jQuery(`#play-pause-icon`).html(`<i class="ri-pause-fill"></i>`);
        playerObj.isPlaying = true;
      }
    });
    window.jQuery(`#rw-icon`).on('click', () => {
      const now = player.currentTime();
      player.currentTime(now - 10);
    });
    window.jQuery(`#ff-icon`).on('click', () => {
      const now = player.currentTime();
      player.currentTime(now + 10);
    });

    setResumeProgress();

    return () => {
      player.dispose();
    };
  }, []);

  return (
    <div>
      <Seo seo={pageSeo} />
      <video
        ref={playerRef}
        id={playerId}
        className="video-js vjs-default-skin vjs-fill"
        width="auto"
        height="auto"
        style={{ objectFit: 'cover' }}
        crossOrigin="anonymous"
      />
    </div>
  );
};

VideoPlayer.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  currentEpiId: PropTypes.number.isRequired,
};

export default VideoPlayer;
