import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PageRoutes from '../../config/PageRoutes';
import { getUserProfiles, selectUserProfile } from '../../services/apiService';
import { NotificationManager } from 'react-notifications';

const ProfileSelection = () => {
  const router = useRouter();

  const [profiles, setProfiles] = useState([]);

  const handleProfileSelection = (selectedProfile) => {
    selectUserProfile(selectedProfile.profileId)
      .then((res) => {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(
            'selectedProfileId',
            selectedProfile.profileId
          );
        }
        router.replace(PageRoutes.BROWSE);
      })
      .catch((e) => {
        NotificationManager.error(
          e?.response?.data?.message ||
          'Something went wrong. Please try again.',
          '',
          4000
        );
      });
  };

  useEffect(() => {
    // if (typeof window !== 'undefined') {
    //   window.localStorage.clear();
    // }
    getUserProfiles().then((res) => {
      if (res.success) {
        const pData = res.data.data;

        if (pData.length === 1) {
          handleProfileSelection({
            name: pData[0].name,
            profileId: pData[0].profile_id,
            photo: pData[0].photo_url,
            email: pData[0].email
          });
        } else {
          setProfiles(
            pData.map((p) => ({
              name: p.name,
              profileId: p.profile_id,
              photo: p.photo_url,
              email: p.email
            }))
          );
        }
      }
    }).catch(() => {
      router.push(PageRoutes.SIGNOUT);
    })
  }, []);

  return (
    <div style={{ minHeight: 300 }}>
      <div className="row justify-content-center">
        {profiles.map((p, idx) => {
          return (
            <div
              key={idx}
              className="col-6 pointer-cursor"
              onClick={() => {
                handleProfileSelection(p);
              }}>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <img
                  className="img-fluid avatar-90 rounded-circle"
                  width="140px"
                  src={
                    p?.photo &&
                      p?.photo !== 'data:image/unknown;base64,' &&
                      p?.photo !== 'data:application/x-empty;base64,' &&
                      p?.photo !== 'data:;base64,'
                      ? p.photo
                      : '/images/user.png'
                  }
                  alt={p.name}
                />
                <span
                  style={{ fontWeight: 'bolder', fontSize: 28 }}
                  className="mt-2">
                  {p.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileSelection;
