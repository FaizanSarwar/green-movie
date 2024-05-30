import React from 'react';
import Button from '../common/Button';
import 'videojs-plus/dist/videojs-plus.css';

const NoSubscription = ({ onConfirm, onClose, reason, data }) => {
  const confirmBtnText =
    reason === 'not-subscribed' ? 'Click to Continue' : 'Yes';
  const displayMessage =
    reason === 'not-subscribed'
      ? 'You are just one step away from watching this film, all you have to do is subscribe and you are good to go.'
      : 'Dear User, your subscription to this service has expired, would you like to renew your membership?';

  return (
    <div
      style={{ backgroundImage: `url(${data?.posterUrl})` }}
      className="no-subscription-container">
      <div className="overlay-detail-section pt-0">
        <a className="navbar-brand" id="logo-link">
          <img
            width="40"
            height="40"
            className="icon-logo img"
            src="/images/tgc-logo-icon.png"
            alt="The Green Channel"
          />
        </a>
        <div className="detail-title clamp-2line">{data.title}</div>
        <div className="detail-synopsis clamp-6line">{data.synopsis}</div>
        <div style={{ position: 'absolute', bottom: 80, width: '90%' }}>
          <div className="d-flex">
            <div className="progress-dot"></div>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                aria-valuenow="0"
                aria-valuemin="0"
                aria-valuemax="100"></div>
            </div>
            <div style={{ marginTop: -10, paddingLeft: 1 }}>
              00:00:00/01:40:00
            </div>
          </div>
          <div className="row  align-items-center justify-content-center">
            <div className="col-2">
              <i
                className="ri-volume-up-fill pointer-cursor"
                style={{ width: 30, height: 30 }}></i>
            </div>
            <div className="col-8">
              <div className="custom-control-container">
                <div id="rw-icon" className="rw-icon">
                  <img
                    width="25"
                    height="25"
                    className="icon-logo img"
                    src="/images/rw-icon.png"
                    alt="Rewind"
                  />
                </div>
                <div id="play-pause-icon" className="play-pause-icon">
                  <i className="ri-play-fill"></i>
                </div>
                <div id="ff-icon" className="ff-icon">
                  <img
                    width="25"
                    height="25"
                    className="icon-logo img"
                    src="/images/ff-icon.png"
                    alt="Fast Forward"
                  />
                </div>
              </div>
            </div>
            <div className="col-2">
              <i
                className="ri-fullscreen-fill pointer-cursor"
                style={{ width: 30, height: 30 }}></i>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="profile-form-modal no-subscription">
          <div className="text-center">
            <h3 className="font-weight-bold text-uppercase">
              {reason === 'not-subscribed' ? 'Click to continue' : 'Login'}
            </h3>
          </div>
          <div className="modal-body">
            <div className="profile-moal-body">{displayMessage}</div>
            <div className="row px-5 mt-5">
              <div className="col col-12 col-md-6 order-2 order-md-1">
                <Button
                  fullWidth
                  variant="outlined"
                  type="button"
                  className="mt-1 mt-md-0 mt-0"
                  onClick={onClose}>
                  Not at this time
                </Button>
              </div>
              <div className="col col-12  col-md-6 order-1">
                <Button variant="contained" onClick={onConfirm} fullWidth>
                  {confirmBtnText}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoSubscription;
