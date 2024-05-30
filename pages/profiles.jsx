import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import ProfileFormDialog from '../components/profiles/FormDialog';
import Profile from '../components/profiles/Profile';
import { getUserProfiles, validateUser } from '../services/apiService';
import PageRoutes from '../config/PageRoutes';
import { useRouter } from 'next/router';

const ProfilePage = () => {
  const router = useRouter();
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    validateUser()
      .then((resp) => {
        if (resp.success) {
          setIsLoggedIn(true);
        }
      })
      .catch(() => {
        router.push(PageRoutes.HOME);
      });
    getUserProfiles()
      .then((res) => {
        if (res.success) {
          const pData = res.data.data;
          setProfiles(
            pData.map((p) => ({
              name: p.name,
              profileId: p.profile_id,
              photo: p.photo_url,
              email: p.email
            }))
          );
          setDataLoaded(true);
        } else {
          router.push(PageRoutes.HOME);
        }
      })
      .catch(() => {
        router.push(PageRoutes.HOME);
      });
  }, [refreshData]);

  const openModal = (idx) => {
    if (idx !== null) setSelectedProfile(profiles[idx]);
    setFormModalOpen(true);
  };

  return (
    <div className="page-container account-page container py-3">
      <h5 className="font-weight-bold">Profiles</h5>
      <button
        className="btn add-profile-btn"
        onClick={() => {
          openModal(null);
        }}
        disabled={!isLoggedIn}
        data-target="#exampleModalCenter">
        Add Profile
      </button>
      {!dataLoaded &&
        [1, 2, 3].map((lp) => (
          <Skeleton
            key={lp}
            height="120px"
            borderRadius="10px"
            width="400px"
            baseColor="#202020"
            highlightColor="#444"
          />
        ))}
      {dataLoaded &&
        profiles &&
        profiles.length > 0 &&
        profiles.map((profile, idx) => (
          <Profile
            key={idx}
            profileData={profile}
            onClick={() => {
              openModal(idx);
            }}
          />
        ))}

      {formModalOpen && (
        <ProfileFormDialog
          isOpen={formModalOpen}
          onClose={() => {
            setFormModalOpen(false);
            setSelectedProfile(null);
            setRefreshData(!refreshData);
          }}
          selectedProfile={selectedProfile}
        />
      )}
    </div>
  );
};

export default ProfilePage;
