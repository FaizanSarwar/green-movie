import { useState } from 'react';
import Button from '../common/Button';
import { useForm } from 'react-hook-form';
import { updateUserProfile } from '../../services/apiService';

const EditAccountInfoDialog = ({ currentData, onClose }) => {
  const {
    register,
    watch,
    formState: { errors }
  } = useForm();

  const [currentStep, setCurrentStep] = useState('form');

  const newData = watch();

  const onConfirm = async () => {
    const payload = {
      name:
        newData.firstName && newData.lastName
          ? `${newData.firstName} ${newData.lastName}`
          : currentData.name,
      photo_url: currentData.photo_url
    };
    await updateUserProfile(currentData.profileId, payload);
    onClose();
  };

  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const email = watch('email');

  return (
    <>
      <div
        id="edit-account-modal"
        className="modal show"
        style={{ display: 'block' }}
        tabIndex="-1"
        role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content app-modal">
            <div>
              <div className="text-center">
                <h3 className="font-weight-bold text-uppercase">
                  {currentStep === 'form'
                    ? 'EDIT ACCOUNT INFORMATION'
                    : 'Is this Information correct?'}
                </h3>
              </div>
              <div className="modal-body px-5 my-5">
                {currentStep === 'form' ? (
                  <AccountInfoForm
                    currentData={currentData}
                    register={register}
                    errors={errors}
                  />
                ) : (
                  <ConfirmInfoSection
                    newInfo={{ firstName, lastName, email }}
                    currentData={currentData}
                  />
                )}
              </div>

              <div className="row px-5 mt-5">
                <div className="col col-12 col-md-6 order-2 order-md-1">
                  <Button
                    fullWidth
                    variant="outlined"
                    type="button"
                    className="mt-1 mt-md-0 mt-0"
                    onClick={onClose}>
                    Cancel
                  </Button>
                </div>
                <div className="col col-12  col-md-6 order-1">
                  {currentStep === 'form' ? (
                    <Button
                      variant="contained"
                      onClick={() => {
                        setCurrentStep('infoConfirm');
                      }}
                      fullWidth>
                      OK
                    </Button>
                  ) : (
                    <Button variant="contained" onClick={onConfirm} fullWidth>
                      Save
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const AccountInfoForm = ({ currentData, register, errors }) => {
  return (
    <>
      <div className="form-group  my-3">
        <label htmlFor="currentFirstName">
          {`Current First Name "${
            currentData.firstName ? currentData.firstName : '-'
          }"`}
        </label>
        <input
          type="text"
          className="form-control auth-form-input mb-0"
          id="firstName"
          name="firstName"
          placeholder="First Name"
          autoComplete="off"
          {...register('firstName', {
            required: true
          })}
        />

        {errors?.firstName && (
          <div className="form-group error-label text-danger">
            This field is required.
          </div>
        )}
      </div>
      <div className="form-group  my-3">
        <label htmlFor="currentLastName">
          {`Current Last Name "${
            currentData.LastName ? currentData.LastName : '-'
          }"`}
        </label>
        <input
          type="text"
          className="form-control auth-form-input mb-0"
          id="lastName"
          name="lastName"
          placeholder="Last Name"
          autoComplete="off"
          {...register('lastName', {
            required: true
          })}
        />
        {errors?.lastName && (
          <div className="form-group error-label text-danger">
            This field is required.
          </div>
        )}
      </div>
      <div className="form-group my-3">
        <label htmlFor="currentEmail">
          {`Current Email "${currentData.email ? currentData.email : '-'}"`}
        </label>
        <input
          type="text"
          className="form-control auth-form-input mb-0"
          id="email"
          name="email"
          placeholder="Enter your email"
          autoComplete="off"
          {...register('email', {
            required: true
          })}
        />
        {errors?.email && (
          <div className="form-group error-label text-danger">
            Please enter proper value.
          </div>
        )}
      </div>
    </>
  );
};

const ConfirmInfoSection = ({ newInfo, currentData }) => {
  return (
    <div>
      <table cellPadding={10}>
        <tr>
          <td width="50%">First Name</td>
          <td width="50%">
            {newInfo.firstName ? newInfo.firstName : currentData.firstName}
          </td>
        </tr>
        <tr>
          <td width="50%">Last Name</td>
          <td width="50%">
            {newInfo.lastName ? newInfo.lastName : currentData.lastName}
          </td>
        </tr>
        <tr>
          <td width="50%">Email</td>
          <td width="50%">
            {newInfo.email ? newInfo.email : currentData.email}
          </td>
        </tr>
      </table>
    </div>
  );
};

export default EditAccountInfoDialog;
