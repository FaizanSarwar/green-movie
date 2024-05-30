import { useEffect } from 'react';
import ProductPlanPage from '../components/pages/ProductPlanLandingPage';
import { useRouter } from 'next/router';
import PageRoutes from '../config/PageRoutes';

const ProductPlans = ({ isLoggedIn,}) => {
  const router = useRouter();
  useEffect(() => {
    if (isLoggedIn) {
      router.push(PageRoutes.BROWSE);
    };
  }, [isLoggedIn]);
  return <ProductPlanPage/>;
};

export default ProductPlans;
