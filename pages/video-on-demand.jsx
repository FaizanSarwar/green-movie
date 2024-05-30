import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import tgcLogo from '/public/images/tgc-logo.png';
import { getSampleContent } from '../services/apiService';
import ListSimilar from '../components/listing/ListSimilar';

const SampleContent = ({ data }) => {
  return (
    <>
      <div className="index-page-container">
        {data.length > 0 ? (
          <div className="container">
            <ul className="row-list-slider row list-inline p-1 m-0 mt-5">
              <ListSimilar data={data} type="film" from="sample" />
            </ul>
          </div>
        ) : (
          <div className="page-container d-flex justify-content-center align-items-center">
            No samples available.
          </div>
        )}
      </div>
    </>
  );
};

export const getServerSideProps = async () => {
  let sampleData = [];
  const res = await getSampleContent();

  if (res.success) {
    const resData = res?.data?.data;
    resData.forEach((s) => {
      sampleData.push({
        id: s.id,
        imageUrl: s.poster_url,
        type: 'films',
        subscriptionType: s.subscription_types,
      });
    });
  }

  return { props: { data: sampleData } };
};

export default SampleContent;
