import { useEffect, useState } from 'react';
import { search } from '../services/apiService';
import ListSimilar from '../components/listing/ListSimilar';
import { NotificationManager } from 'react-notifications';

const SearchPage = ({ query }) => {
  const [searchData, setSearchData] = useState(null);
  const [isSearching, setIsSearching] = useState(true);

  useEffect(() => {
    search(query.query)
      .then((res) => {
        if (res.success && res.data.status === 'success') {
          setSearchData(res.data.data);
        }
        setIsSearching(false);
      })
      .catch((e) => {
        NotificationManager.error(
          res.message || 'Something went wrong. Please try again.',
          '',
          4000
        );
      });
  }, [query]);

  return (
    <>
      <div className="page-container">
        <div className="details-container">
          <div className="container">
            <div className="detail-similar-title">
              <h4 className="page-heading">
                Search Result {query && ` - ${query.query}`}
              </h4>
            </div>
            <ul className="row-list-slider row list-inline p-0 m-0 mt-5">
              {searchData ? (
                <ListSimilar data={searchData} />
              ) : (
                <div className="col-12 mb-4 d-flex justify-content-center mt-5">
                  {isSearching ? 'Searching...' : 'No result found.'}
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

SearchPage.defaultProps = {
  query: ''
};

export const getServerSideProps = async ({ query, req }) => {
  return {
    props: {
      query: query
    }
  };
};

export default SearchPage;
