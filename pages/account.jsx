import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import EditBillingInfoDialog from '../components/accounts/EditBillingAddressInfoDialog';
import EditAccountInfoDialog from '../components/accounts/EditAccountInfoDialog';
import RedeemPromoCodeDialog from '../components/accounts/RedeemPromoCodeDialog';
import Button from '../components/common/Button';
import PageRoutes from '../config/PageRoutes';
import { parseCookies } from '../utils/CookieFormatter';
import EditCardInfoDialog from '../components/accounts/EditCardInfoDialog';
import {
  validateUser,
  userBillingInfo,
  getUserProfiles,
  cancelSubscription,
} from '../services/apiService';
import SubscribeModel from '../components/subscription/SubscribeModel';
import Product from '../components/common/Product';

const AccountSummary = () => {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState({ name: '', email: '' });
  const [openAccountInfoForm, setOpenAccountInfoForm] = useState(false);
  const [refresh, setRefresh] = useState(true);

  const getUserData = async () => {
    const mainProfile = window.localStorage.getItem('mainProfileEmail');
    const userData = await getUserProfiles();
    if (userData.success) {
      const pData = userData.data.data;
      pData.map((d) => {
        if (d.email === mainProfile) {
          setUserDetails({
            name: d.name,
            email: d.email,
            profileId: d.profile_id,
            photo_url: d.photo_url,
          });
        }
      });
    } else {
      router.push(PageRoutes.SIGNOUT);
    }
  };


  useEffect(() => {
    getUserData();
  }, [refresh]);

  const editAccountInfo = () => {
    setOpenAccountInfoForm(true);
  };

  return (
    <div className="account-page-container">
      <div className="my-3">
        <h6 className="font-weight-bold">Account Summary</h6>
        <div className="account-item-container my-1">
          <span>User:</span>
          <span>{userDetails.name}</span>
          <span className="green-link" onClick={editAccountInfo}>
            Edit
          </span>
        </div>
        <div className="account-item-container my-1">
          <span>Email:</span>
          <span>{userDetails.email}</span>
          <span onClick={editAccountInfo} className="green-link ">
            Edit
          </span>
        </div>
      </div>
      {openAccountInfoForm && (
        <EditAccountInfoDialog
          currentData={userDetails}
          onClose={() => {
            setRefresh(true);
            setOpenAccountInfoForm(false);
          }}
        />
      )}
    </div>
  );
};

const AccountBillingInformation = ({ uerData }) => {
  const router = useRouter();
  const [billingInformation, setBillingInformation] = useState({
    paymentType: '',
    address: '',
  });
  const [openBillingInfoForm, setOpenBillingInfoForm] = useState(false);
  const [billingInfo, setBillingInfo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openCardInfoForm, setOpenCardInfoForm] = useState(false);
  const [reload, setReload] = useState(true);
  const [isOpenSubscribeModel, setIsOpenSubscribeModel] = useState(false);
  const [isOpenProductModel, setIsOpenProductModel] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState('');
  // const [openPromoCodeDialog, setOpenPromoCodeDialog] = useState(false);

  useEffect(() => {
    if (reload) {
      setReload(false);
      userBillingInfo()
        .then((res) => {
          if (res.success && res.data.status === 'success') {
            const address = res.data.status_msg.address;
            const data = {
              paymentType: '',
              address: '',
            };
            if (res?.data?.status_msg?.payment_type) {
              data.paymentType = res.data.status_msg.payment_type;
            }
            if (address) {
              data.address = `${address.line1},${address.line2},${address.city}, ${address.state}, ${address.country}, ${address.postal_code}, ${res.data.status_msg.phone}`;
              const billingData = {
                city: address.city,
                address1: address.line1,
                address2: address.line2,
                country: address.country,
                postalCode: address.postal_code,
                phone: res.data.status_msg.phone,
                state: address.state,
              };
              setBillingInfo(billingData);
            }
            setBillingInformation(data);
            setLoading(false);
          } else {
            setLoading(false);
          }
        })
        .catch(() => {
          setLoading(false);
          // router.push(PageRoutes.HOME);
          // Skip error
        });
    }
  }, [reload]);

  const editBillingInfo = () => {
    setOpenBillingInfoForm(true);
  };

  const openSubscribeModel = () => {
    setIsOpenProductModel(true);
    // setIsOpenSubscribeModel(true);
  };

  const confirmProduct = (type) => {
    setSubscriptionType(type);
    setIsOpenProductModel(false);
    setTimeout(() => {
      setIsOpenSubscribeModel(true);
    }, 500);
  };

  const confirmPayment = () => {
    setIsOpenSubscribeModel(false);
    setReload(!reload);
  };

  return (
    <>
      {!loading && (
        <div className="account-page-container">
          <div className="my-3">
            <h6 className="font-weight-bold">Billing Information</h6>
            {uerData?.subscription_state === 'payment_succeeded' ||
            billingInformation.paymentType ? (
              <>
                <div className="account-item-container my-1">
                  <span>Payment Type</span>
                  <span>{billingInformation.paymentType}</span>
                  {/* <span
                  onClick={() => {
                    setOpenCardInfoForm(true);
                  }}
                  className="green-link">
                  Edit
                </span> */}
                </div>
                {billingInformation.address && (
                  <div className="account-item-container my-1">
                    <span>Billing address</span>
                    <span style={{ whiteSpace: 'pre-line' }}>
                      {billingInformation.address.split(',').join('\n')}
                    </span>
                    <span onClick={editBillingInfo} className="green-link">
                      Edit
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="d-flex account-item-container my-1">
                Seems your subscription is not active,&nbsp;
                <div
                  onClick={openSubscribeModel}
                  className="click-text"
                  style={{ fontSize: '1rem !important' }}>
                  click here&nbsp;
                </div>
                to continue.
              </div>
            )}
            {/* <div className="account-item-container py-2 my-1">
          <span
            className="green-link"
            onClick={() => {
              setOpenPromoCodeDialog(true);
            }}>
            Redeem Promotional Code
          </span>
        </div> */}
          </div>
        </div>
      )}
      {openBillingInfoForm && (
        <EditBillingInfoDialog
          currentData={billingInfo}
          onClose={() => {
            setReload(true);
            setOpenBillingInfoForm(false);
          }}
        />
      )}

      {openCardInfoForm && (
        <EditCardInfoDialog
          currentData={billingInformation}
          onClose={() => {
            setOpenCardInfoForm(false);
          }}
        />
      )}
      {isOpenSubscribeModel && (
        <SubscribeModel
          nameClass="account-page-container"
          onClose={() => setIsOpenSubscribeModel(false)}
          onConfirm={() => confirmPayment()}
          subscriptionType={subscriptionType}
        />
      )}
      {isOpenProductModel && (
        <Product
          nameClass="account-page-container"
          onClose={() => setIsOpenProductModel(false)}
          onConfirm={(type) => confrmProiduct(type)}
          type="subscription"
          page="account"
        />
      )}
    </>
  );
};

const CancelSubscription = ({ uerData }) => {
  const router = useRouter();
  const [platform, setPlatform] = useState('');
  const [isShowCancelMessage, setIsShowCancelMessage] = useState(false);
  const [isCancelPopup, setIsCancelPopup] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [cancelDate, setCancelDate] = useState('');

  useEffect(() => {
    if (
      uerData.subscription_enabled &&
      uerData.subscription_platform &&
      uerData.subscription_platform === 'web' &&
      uerData.subscription_state === 'cancel_at_end_of_period'
    ) {
      const d = new Date(Number(uerData.subscription_period_end) * 1000);
      setCancelDate(d.toISOString().split('T')[0]);
      setIsShowCancelMessage(true);
    }
  }, [isRefresh]);

  const cancelProcess = async () => {
    setIsProcessing(true);
    const res = await cancelSubscription();
    if (res && res.status === 'success') {
      setIsProcessing(false);
      setIsCancelPopup(false);
      setIsRefresh(!isRefresh);
    } else {
      router.push(PageRoutes.SIGNOUT);
    }
  };

  return (
    <>
      {uerData?.subscription_platform === 'web' && !isShowCancelMessage && (
        <div className="account-page-container">
          <div className="my-3">
            <h6 className="font-weight-bold">Subscription</h6>
            <div className="account-item-container my-1">
              <span
                className="red-link"
                onClick={() => {
                  setIsCancelPopup(true);
                }}>
                Cancel Subscription
              </span>
            </div>
          </div>
        </div>
      )}
      {isShowCancelMessage && (
        <div className="account-page-container">
          <div className="my-3">
            <h6 className="font-weight-bold">Subscription</h6>
            <div className="account-item-container my-1">
              <span>
                {`Your subscription will be cancelled at ${cancelDate}.`}
              </span>
            </div>
          </div>
        </div>
      )}
      {isCancelPopup && (
        <>
          <div
            className="profile-form-modal subscription-model"
            style={{
              marginTop: '-5rem',
            }}>
            <div className="text-center mb-5">
              <h3 className="font-weight-bold text-uppercase">
                Cancel Subscription
              </h3>
            </div>
            <div className="d-flex justify-content-center align-items-center min-heig">
              Are you sure you want to cancel your current subscription?
            </div>
            <div className="sign-info row px-md-2 mt-5">
              <div className="col col-12 col-md-6 order-2 order-md-1">
                <Button
                  id="cencel-btn"
                  fullWidth
                  variant="outlined"
                  disabled={isProcessing}
                  onClick={() => {
                    setIsCancelPopup(false);
                  }}>
                  No
                </Button>
              </div>
              <div className="col col-12 col-md-6 order-1">
                <div className="d-flex justify-content-center">
                  <Button
                    fullWidth
                    form="subscribe-form"
                    className="px-5 cancel-sub-btn"
                    type="submit"
                    disabled={isProcessing}
                    onClick={() => {
                      cancelProcess();
                    }}>
                    {' '}
                    Yes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

const TermsAndConditions = () => {
  const router = useRouter();
  return (
    <div className="account-page-container">
      <div className="my-3">
        <h6 className="font-weight-bold">Terms And Conditions</h6>
        <div className="account-item-container my-1">
          <span
            className="green-link"
            onClick={() => {
              router.push(PageRoutes.TERMS);
            }}>
            Terms of Use
          </span>
          <span
            className="green-link"
            onClick={() => {
              router.push(PageRoutes.PRIVACY);
            }}>
            Privacy policy
          </span>
        </div>
      </div>
    </div>
  );
};

const AccountPage = () => {
  const router = useRouter();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    validateUser()
      .then((res) => {
        if (res?.success) {
          setData(res?.data?.data);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        router.push(PageRoutes.SIGNOUT);
      });
  }, []);

  return (
    <div className="page-container account-page container py-3">
      <h5 className="font-weight-bold"> Account Settings</h5>
      {!isLoading && <AccountSummary />}
      {!isLoading && <AccountBillingInformation uerData={data} />}
      {!isLoading && <CancelSubscription uerData={data} />}
      {!isLoading && <TermsAndConditions />}
    </div>
  );
};

export default AccountPage;
