import React, { useEffect, useState } from 'react';
import Button from '../common/Button';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import {
  createUserProfile,
  deleteUserProfile,
  updateUserProfile,
  validateUser,
} from '../../services/apiService';
import { NotificationManager } from 'react-notifications';

const ProfileFormDialog = ({ selectedProfile, onClose }) => {
  const [selectedView, setSelectedView] = useState('profileForm'); // profileForm, deleteConfirm, deleteMessage

  useEffect(() => {
    setSelectedView('profileForm');
  }, [selectedProfile]);

  const onDeleteConfirm = () => {
    deleteUserProfile(selectedProfile.profileId)
      .then((res) => {
        if (res.success) {
          setSelectedView('deleteMessage');
        } else {
          NotificationManager.error(
            res.message || 'Something went wrong. Please try again.',
            '',
            4000
          );
        }
      })
      .catch((e) => {
        NotificationManager.error(
          e?.response?.data?.message ||
            'Something went wrong. Please try again.',
          '',
          4000
        );
        onClose();
      });
  };

  const onDeleteCancel = () => {
    setSelectedView('profileForm');
  };

  return (
    <div
      id="profile-form-modal"
      className="modal show"
      style={{ display: 'block' }}
      tabIndex="-1"
      role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content  profile-form-modal">
          {selectedView === 'profileForm' && (
            <ProfileForm
              setSelectedView={setSelectedView}
              selectedProfile={selectedProfile}
              onClose={onClose}
            />
          )}
          {selectedView === 'deleteConfirm' && (
            <ConfirmDelete
              selectedProfile={selectedProfile}
              setSelectedView={setSelectedView}
              onConfirm={onDeleteConfirm}
              onCancel={onDeleteCancel}
            />
          )}
          {selectedView === 'deleteMessage' && (
            <ProfileDeleteMessage
              selectedProfile={selectedProfile}
              closeDialog={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileForm = ({ selectedProfile, setSelectedView, onClose }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const hiddenFileInput = React.useRef(null);
  const [preview, setPreview] = useState('/images/user.png');
  const [base64Image, setBase64Image] = useState('');
  const [isShowDelete, setIsShowDelete] = useState(true);
  const [processing, setprocessing] = useState(false);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleChange = async (event) => {
    const fileUploaded = event.target.files[0];

    if (fileUploaded) {
      const objectUrl = URL.createObjectURL(fileUploaded);
      setPreview(objectUrl);
      const converted = await convertBase64(fileUploaded);
      setBase64Image(converted);
    }
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const onSubmit = (data) => {
    const payload = {
      name: data.name,
    };

    if (base64Image) {
      payload.photo_url = base64Image;
    }
    if (selectedProfile && selectedProfile.profileId) {
      setprocessing(true);
      if (payload.name)
        updateUserProfile(selectedProfile.profileId, payload)
          .then((res) => {
            if (res.success) {
              NotificationManager.success(
                'Profile updated successfully.',
                '',
                2000
              );
              setprocessing(false);
              onClose();
            } else {
              setprocessing(false);
              NotificationManager.error(
                res.message || 'Something went wrong. Please try again.',
                '',
                4000
              );
            }
          })
          .catch((e) => {
            setprocessing(false);
            NotificationManager.error(
              e?.response?.data?.message ||
                'Something went wrong. Please try again.',
              '',
              4000
            );
            onClose();
          });
    } else {
      if (payload.name !== '') {
        createUserProfile(payload)
          .then((res) => {
            NotificationManager.success(
              'Profile created successfully.',
              '',
              2000
            );
            setprocessing(false);
            onClose();
          })
          .catch((e) => {
            NotificationManager.error(
              e?.response?.data?.message ||
                'Something went wrong. Please try again.',
              '',
              4000
            );
            setprocessing(false);
            onClose();
          });
      } else {
        NotificationManager.error('Please enter valid data!', '', 4000);
        setprocessing(false);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mainProfile = window.localStorage.getItem('mainProfileEmail');
      if (selectedProfile && selectedProfile.email === mainProfile) {
        setIsShowDelete(false);
      }
    }

    if (selectedProfile) {
      setValue('name', selectedProfile?.name || '');
      setValue('email', selectedProfile?.email || '');
      if (
        selectedProfile?.photo &&
        selectedProfile?.photo !== 'data:image/unknown;base64,' &&
        selectedProfile?.photo !== 'data:application/x-empty;base64,' &&
        selectedProfile?.photo !== 'data:;base64,'
      )
        setPreview(selectedProfile?.photo);
      else setPreview('/images/user.png');
    } else {
      setValue('name', '');
      setValue('email', '');
      setPreview('/images/user.png');
    }
  }, [selectedProfile]);

  const onDelete = () => {
    setSelectedView('deleteConfirm');
  };

  return (
    <>
      <div className="text-center">
        <h3 className="font-weight-bold">
          {selectedProfile
            ? `Edit Profile "${selectedProfile.name || 'prompt'}"`
            : 'Add New Profile'}
        </h3>
      </div>
      <div className="modal-body">
        <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="profile-form-inputs-wrapper px-1 px-sm-5">
            <div className="text-center my-4">
              <img
                width="120px"
                height="120px"
                src={preview}
                alt="user"
                style={{ borderRadius: '50%' }}
              />
              <span onClick={handleClick} className="green-link mt-1">
                Edit Photo
              </span>
              <input
                accept="image/*"
                type="file"
                ref={hiddenFileInput}
                onChange={handleChange}
                style={{ display: 'none' }}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control auth-form-input mb-0"
                id="name"
                name="name"
                placeholder="Enter Profile Name"
                autoComplete="off"
                {...register('name', {
                  required: true,
                })}
              />
              {errors?.name && (
                <div className="form-group error-label text-danger">
                  Please enter proper value.
                </div>
              )}
            </div>

            {/* <div className="form-group">
              <input
                type="email"
                className="form-control auth-form-input mb-0"
                id="email"
                name="email"
                placeholder="Enter Profile Email"
                {...register('email', { required: 'required' })}
              />
              {errors?.email && (
                <div className="form-group error-label text-danger">
                  This field is required.
                </div>
              )}
            </div> */}
          </div>

          <div className="sign-info row px-1 px-sm-5">
            <div className="col col-12 col-md-6 order-sm-last order-md-1 order-last">
              <Button
                fullWidth
                variant="outlined"
                type="button"
                onClick={onClose}>
                Cancel
              </Button>
            </div>
            <div className="col col-12 col-md-6 order-sm-1">
              <div className="d-flex justify-content-center">
                <Button type="submit" fullWidth>
                  {processing ? (
                    <div className="d-flex">
                      <div className="loader"></div>
                      <div className="ml-1"> Processing...</div>
                    </div>
                  ) : (
                    'Save'
                  )}
                </Button>
              </div>
            </div>
            {selectedProfile && isShowDelete ? (
              <>
                <div className="col col-3 mt-lg-2  order-last order-sm-1" />
                <div className="col col-12 col-md-6 text-center mt-md-2  order-sm-2">
                  <Button variant="danger" fullWidth onClick={onDelete}>
                    Delete Profile
                  </Button>
                </div>
                <div className="col col-3 mt-lg-2  order-last" />
              </>
            ) : (
              <></>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

ProfileForm.propTypes = {
  setSelectedView: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedProfile: PropTypes.objectOf(PropTypes.any).isRequired,
};

const ConfirmDelete = ({ selectedProfile, onConfirm, onCancel }) => {
  return (
    <>
      <div className="text-center">
        <h5 className="font-weight-bold">Delete Profile</h5>
      </div>
      <div className="modal-body">
        <div
          style={{
            margin: '8rem 0',
            textAlign: 'center',
            whiteSpace: 'pre-line',
          }}
          className="px-2">
          {`This will totally remove profile "${
            selectedProfile ? selectedProfile.name : ''
          }" from your list of profiles\n Are you sure want to continue?`}
        </div>
        <div className="row px-5 mt-5">
          <div className="col col-12 col-md-6 order-2 order-md-1">
            <Button
              fullWidth
              variant="contained"
              type="button"
              className="mt-1 mt-md-0 mt-0"
              onClick={onCancel}>
              No
            </Button>
          </div>
          <div className="col col-12  col-md-6 order-1">
            <Button variant="danger" onClick={onConfirm} fullWidth>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

ConfirmDelete.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  selectedProfile: PropTypes.objectOf(PropTypes.any).isRequired,
};

const ProfileDeleteMessage = ({ selectedProfile, closeDialog }) => {
  return (
    <>
      <div className="text-center">
        <h5 className="font-weight-bold">Profile Deleted</h5>
      </div>
      <div className="modal-body">
        <div style={{ margin: '8rem 0', textAlign: 'center' }}>
          {`Profile "${
            selectedProfile ? selectedProfile.name : ''
          }" permanently deleted`}
        </div>
        <div className="row px-md-2 mt-5">
          <>
            <div className="col col-3 mt-lg-2" />
            <div className="col col-12 col-sm-6  text-center mt-sm-2">
              <Button
                fullWidth
                variant="contained"
                type="button"
                onClick={closeDialog}>
                Okay
              </Button>
            </div>
            <div className="col col-3 mt-lg-2" />
          </>
        </div>
      </div>
    </>
  );
};

ProfileDeleteMessage.propTypes = {
  closeDialog: PropTypes.func.isRequired,
  selectedProfile: PropTypes.objectOf(PropTypes.any).isRequired,
};

ProfileFormDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  selectedProfile: PropTypes.objectOf(PropTypes.any),
};

ProfileFormDialog.defaultProps = {
  selectedProfile: null,
};

export default ProfileFormDialog;
