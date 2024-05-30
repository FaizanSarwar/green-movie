import React from 'react';
import PropTypes from 'prop-types';

const Profile = ({ onClick, profileData }) => {
  return (
    <div className="profile-item-container">
      <div className="d-flex align-items-center">
        {profileData.photo &&
        profileData.photo !== 'data:;base64,' &&
        profileData.photo !== 'data:image/unknown;base64,' &&
        profileData.photo !== 'data:application/x-empty;base64,' ? (
          <img
            width="80px"
            src={profileData.photo}
            className="img-fluid avatar-80 rounded-circle"
            alt="user"
          />
        ) : (
          <img
            width="80px"
            src={'/images/user.png'}
            className="img-fluid avatar-80 rounded-circle"
            alt="user"
          />
        )}
        <div className="ml-3 w-50">
          <h6
            className="mb-0 text-wrap"
            style={{
              overflowWrap: 'break-word',
            }}>
            {profileData.name || 'prompt'}
          </h6>
          <span className="green-link mw-auto" onClick={onClick}>
            Edit
          </span>
        </div>
      </div>
    </div>
  );
};

Profile.propTypes = {
  onClick: PropTypes.func.isRequired,
  userDetails: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Profile;
