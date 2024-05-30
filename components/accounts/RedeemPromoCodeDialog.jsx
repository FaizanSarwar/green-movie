import Button from '../common/Button';
import { useForm } from 'react-hook-form';

const RedeemPromoCodeDialog = ({ onClose }) => {
  const {
    register,
    formState: { errors }
  } = useForm();

  const onConfirm = () => {
    onClose();
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
                  Redeem Promotional code
                </h3>
              </div>
              <div className="modal-body px-5" style={{ margin: '6rem 0' }}>
                <p>Please enter the 16 digit promo code</p>
                <div className="row">
                  <div className="form-group col-12 col-sm-3">
                    <input
                      type="text"
                      className="form-control auth-form-input mb-0"
                      id="input1"
                      name="input1"
                      placeholder="XXXX"
                      autoComplete="off"
                      {...register('input1', {
                        required: true
                      })}
                    />

                    {errors?.input1 && (
                      <div className="form-group error-label text-danger">
                        This field is required.
                      </div>
                    )}
                    {errors?.input1 &&
                      errors.chosenPassword.type === 'maxLength' && (
                        <div className="form-group error-label text-danger">
                          Please enter minimum 10 characters password.
                        </div>
                      )}
                  </div>
                  <div className="form-group col-12 col-sm-3">
                    <input
                      type="text"
                      className="form-control auth-form-input mb-0"
                      id="input2"
                      name="input2"
                      placeholder="XXXX"
                      autoComplete="off"
                      {...register('input2', {
                        required: true
                      })}
                    />

                    {errors?.input2 && (
                      <div className="form-group error-label text-danger">
                        This field is required.
                      </div>
                    )}
                  </div>
                  <div className="form-group col-12 col-sm-3">
                    <input
                      type="text"
                      className="form-control auth-form-input mb-0"
                      id="input3"
                      name="input3"
                      placeholder="XXXX"
                      autoComplete="off"
                      {...register('input3', {
                        required: true
                      })}
                    />

                    {errors?.input3 && (
                      <div className="form-group error-label text-danger">
                        This field is required.
                      </div>
                    )}
                  </div>
                  <div className="form-group col-12 col-sm-3">
                    <input
                      type="text"
                      className="form-control auth-form-input mb-0"
                      id="input4"
                      name="input4"
                      placeholder="XXXX"
                      autoComplete="off"
                      {...register('input4', {
                        required: true
                      })}
                    />

                    {errors?.input4 && (
                      <div className="form-group error-label text-danger">
                        This field is required.
                      </div>
                    )}
                  </div>
                </div>
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
                  <Button variant="contained" onClick={onConfirm} fullWidth>
                    OK
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RedeemPromoCodeDialog;
