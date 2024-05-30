/* eslint-disable react/jsx-key */
import { useState } from 'react';
import Button from '../common/Button';
import { useForm } from 'react-hook-form';
import { NotificationManager } from 'react-notifications';
import { updateUserBilling } from '../../services/apiService';
import { countries } from '../../config/Constants';

const EditBillingInfoDialog = ({ currentData, onClose }) => {
  const {
    register,
    watch,
    formState: { errors }
  } = useForm();

  const [currentStep, setCurrentStep] = useState('form');

  const newInfo = watch();

  const onConfirm = () => {
    const payload = {
      city: newInfo.city ? newInfo.city : currentData.city,
      line1: newInfo.billingAddressLine1
        ? newInfo.billingAddressLine1
        : currentData.address1,
      line2: newInfo.billingAddressLine2
        ? newInfo.billingAddressLine2
        : currentData.address2,
      country: newInfo.country ? newInfo.country : currentData.country,
      postal_code: newInfo.postalCode
        ? newInfo.postalCode
        : currentData.postalCode,
      phone: newInfo.phone ? newInfo.phone : currentData.phone,
      state: newInfo.state ? newInfo.state : currentData.state
    };

    updateUserBilling(payload)
      .then((res) => {
        if (res.success) {
          if (res.data.status !== 'failure') {
            onClose();
          } else {
            NotificationManager.error(
              res.data.status_msg || 'Something went wrong. Please try again.',
              '',
              4000
            );
          }
        }
      })
      .catch((e) => {
        NotificationManager.error(
          e?.response?.data?.message ||
            'Something went wrong. Please try again.',
          '',
          4000
        );
        reset();
      });
    // onClose();
  };

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
                    ? ' EDIT billing INFORMATION'
                    : 'Is this Information correct?'}
                </h3>
              </div>
              <div className="modal-body px-5 mt-5">
                <>
                  <div>
                    {currentStep === 'form' ? (
                      <BillingAddressInfoForm
                        register={register}
                        errors={errors}
                        currentData={currentData}
                      />
                    ) : (
                      <ConfirmInfoSection
                        newInfo={newInfo}
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
                        <Button
                          variant="contained"
                          onClick={onConfirm}
                          fullWidth>
                          Save
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const BillingAddressInfoForm = ({ register, errors, currentData = {} }) => {
  return (
    <>
      <div className="col col-12">
        <div className="form-group">
          {currentData && currentData.country ? (
            <label htmlFor="currentFirstName">
              {currentData.country
                ? `Current Country "${currentData.country}"`
                : ''}
            </label>
          ) : (
            ''
          )}
          <select
            type=""
            className="form-control auth-form-input mb-0"
            id="country"
            name="country"
            placeholder="Country"
            {...register('country')}>
            <option value="">Select</option>
            {countries.map((c) => (
              <option value={c.code}>{c.name}</option>
            ))}
          </select>

          {errors?.country && (
            <div className="form-group error-label text-danger">
              This field is required.
            </div>
          )}
        </div>
      </div>
      <div className="col col-12">
        <div className="form-group">
          {currentData && currentData.address1 ? (
            <label htmlFor="currentFirstName">
              {currentData.address1
                ? `Current Billing Address (Line 1) "${currentData.address1}"`
                : ''}
            </label>
          ) : (
            ''
          )}
          <input
            type="text"
            className="form-control auth-form-input mb-0"
            id="billingAddressLine1"
            name="billingAddressLine1"
            placeholder="Billing Address (Line 1)"
            {...register('billingAddressLine1')}
          />
          {errors?.billingAddressLine1 && (
            <div className="form-group error-label text-danger">
              This field is required.
            </div>
          )}
        </div>
      </div>
      <div className="col col-12">
        <div className="form-group">
          {currentData && currentData.address2 ? (
            <label htmlFor="currentFirstName">
              {currentData.address2
                ? `Current Billing Address (Line 2) "${currentData.address2}"`
                : ''}
            </label>
          ) : (
            ''
          )}
          <input
            type="text"
            className="form-control auth-form-input mb-0"
            id="billingAddressLine2"
            name="billingAddressLine2"
            placeholder="Billing Address (Line 2)"
            {...register('billingAddressLine2')}
          />
          {errors?.billingAddressLine2 && (
            <div className="form-group error-label text-danger">
              This field is required.
            </div>
          )}
        </div>
      </div>
      <div className="col col-12">
        <div className="form-group">
          {currentData && currentData.city ? (
            <label htmlFor="currentFirstName">
              {currentData.city ? `Current City "${currentData.city}"` : ''}
            </label>
          ) : (
            ''
          )}
          <input
            type="text"
            className="form-control auth-form-input mb-0"
            id="city"
            name="city"
            placeholder="City"
            {...register('city')}
          />
          {errors?.city && (
            <div className="form-group error-label text-danger">
              This field is required.
            </div>
          )}
        </div>
      </div>
      <div className="col col-12">
        <div className="form-group">
          {currentData && currentData.state ? (
            <label htmlFor="currentFirstName">
              {currentData.state ? `Current State "${currentData.state}"` : ''}
            </label>
          ) : (
            ''
          )}
          <input
            type="text"
            className="form-control auth-form-input mb-0"
            id="state"
            name="state"
            placeholder="State"
            {...register('state')}
          />

          {errors?.state && (
            <div className="form-group error-label text-danger">
              This field is required.
            </div>
          )}
        </div>
      </div>
      <div className="row px-3">
        <div
          className={
            currentData ? 'col col-12 col-md-12' : 'col col-12 col-md-6'
          }>
          <div className="form-group">
            {currentData && currentData.postalCode ? (
              <label htmlFor="currentFirstName">
                {currentData.postalCode
                  ? `Current State "${currentData.postalCode}"`
                  : ''}
              </label>
            ) : (
              ''
            )}
            <input
              type="text"
              className="form-control auth-form-input mb-0"
              id="postalCode"
              name="postalCode"
              placeholder="Postal code"
              {...register('postalCode')}
            />
            {errors?.postalCode && (
              <div className="form-group error-label text-danger">
                This field is required.
              </div>
            )}
          </div>
        </div>
        <div
          className={
            currentData ? 'col col-12 col-md-12' : 'col col-12 col-md-6'
          }>
          <div className="form-group">
            {currentData ? (
              <label htmlFor="phone">
                {`Current Phone "${
                  currentData.phone ? currentData.phone : '-'
                }"`}
              </label>
            ) : (
              ''
            )}
            <input
              type="text"
              className="form-control auth-form-input mb-0"
              id="phone"
              name="phone"
              placeholder="Phone"
              {...register('phone')}
            />
            {errors?.phone && (
              <div className="form-group error-label text-danger">
                This field is required.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const ConfirmInfoSection = ({ newInfo, currentData }) => {
  return (
    <div>
      <table cellPadding={10}>
        <tr>
          <td width="50%" style={{ verticalAlign: 'top' }}>
            Billing Address
          </td>
          <td width="50%">
            {newInfo.billingAddressLine1
              ? newInfo.billingAddressLine1
              : currentData.address1}
            <br />
            {newInfo.billingAddressLine2
              ? newInfo.billingAddressLine2
              : currentData.address2}
            <br />
            {newInfo.city ? newInfo.city : currentData.city}
            <br />
            {newInfo.postalCode ? newInfo.postalCode : currentData.postalCode}
            <br />
            {newInfo.phone ? newInfo.phone : currentData.phone}
          </td>
        </tr>
        <tr>
          <td width="50%">Coutry/Region</td>
          <td width="50%">
            {newInfo.country ? newInfo.country : currentData.country}
          </td>
        </tr>
      </table>
    </div>
  );
};

export default EditBillingInfoDialog;
