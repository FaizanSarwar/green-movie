import Link from 'next/link';
import { generateSeasonUrl } from '../../utils/urlGenerator';

const SeasonsTab = ({ seasons, selectedSeason, onChange }) => {
  return (
    <>
      {seasons.map((s) => (
        <Link passHref href={generateSeasonUrl(s.sId, s.id)} key={s.id}>
          <button
            className={`btn season-outlined-button mr-3 ${
              s.id === selectedSeason ? `season-outlined-button-selected` : ``
            }`}>
            {s.text}
          </button>
        </Link>
      ))}
    </>
  );
};

export default SeasonsTab;
