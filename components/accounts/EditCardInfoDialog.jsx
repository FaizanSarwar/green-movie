import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../common/Button';

const EditCardInfoDialog = ({ currentData, onClose }) => {
  const {
    register,
    watch,
    formState: { errors }
  } = useForm();

  const [currentStep, setCurrentStep] = useState('form');

  const onConfirm = () => {
    onClose();
  };

  const newInfo = watch();

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
              <div className="modal-body px-5 my-5">
                {currentStep === 'form' ? (
                  <CardInfoForm register={register} errors={errors} />
                ) : (
                  <ConfirmInfoSection newInfo={newInfo} />
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

const CardInfoForm = ({ register, errors }) => {
  return (
    <>
      <div className="row">
        <div className="col-12  form-group">
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

        <div className="col-12 form-group">
          <input
            type="text"
            className="form-control auth-form-input mb-0"
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            {...register('lastName', { required: true })}
          />
          {errors?.lastName && (
            <div className="form-group error-label text-danger">
              This field is required.
            </div>
          )}
        </div>
      </div>
      <div className="form-group">
        <input
          type="text"
          className="form-control auth-form-input mb-0"
          id="cardNumber"
          name="cardNumber"
          placeholder="Card Number"
          {...register('cardNumber')}
        />
        {errors?.cardNumber && (
          <div className="form-group error-label text-danger">
            This field is required.
          </div>
        )}
      </div>
      <div className="sign-info row mt-4">
        <div className="col col-12 col-md-6">
          <div className="form-group">
            <input
              type="text"
              className="form-control auth-form-input mb-0"
              id="cardExpiryDate"
              name="cardExpiryDate"
              placeholder="Card Expiry Date"
              {...register('cardExpiryDate')}
            />
            {errors?.cardExpiryDate && (
              <div className="form-group error-label text-danger">
                This field is required.
              </div>
            )}
          </div>
        </div>
        <div className="col col-12 col-md-6">
          <div className="form-group">
            <input
              type="text"
              className="form-control auth-form-input mb-0"
              id="cardCvv"
              name="cardCvv"
              placeholder="CVV"
              {...register('cardCvv')}
            />
            {errors?.cardCvv && (
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

const ConfirmInfoSection = ({ newInfo }) => {
  return (
    <div>
      <table cellPadding={10}>
        <tr>
          <td width="50%">First Name</td>
          <td width="50%">{newInfo.firstName}</td>
        </tr>
        <tr>
          <td width="50%">Last Name</td>
          <td width="50%">{newInfo.lastName}</td>
        </tr>
        <tr>
          <td width="50%">Card Number</td>
          <td width="50%">{newInfo.cardNumber}</td>
        </tr>
        <tr>
          <td width="50%">Card Expiry Date</td>
          <td width="50%">{newInfo.cardExpiryDate}</td>
        </tr>
        <tr>
          <td width="50%">Card Cvv</td>
          <td width="50%">{newInfo.cardCvv}</td>
        </tr>
      </table>
    </div>
  );
};

export default EditCardInfoDialog;
