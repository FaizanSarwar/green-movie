import React, { createContext, useState } from 'react';
export const DataContext = createContext({
  subGenres: [],
  setSubGenres: () => true,
  selectedGenre: '',
  setSelectedGenre: () => true
});

export function DataProvider({ children }) {
  const [subGenres, setSubGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');

  return (
    <DataContext.Provider
      value={{ subGenres, setSubGenres, selectedGenre, setSelectedGenre }}>
      {children}
    </DataContext.Provider>
  );
}
