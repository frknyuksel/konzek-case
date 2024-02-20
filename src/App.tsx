import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import './App.css';
import Flag from './components/Flag';

const GET_COUNTRIES = gql`
  query GetCountries($tt: String!) {
    countries(filter: { name: { regex: $tt } }) {
      code
      name
      capital
    }
  }
`;

interface Language {
  name: string;
  code: string;
}

interface Continent {
  name: string;
  code: string;
}

interface State {
  name: string;
}

interface Country {
  code: string;
  name: string;
  capital: string;
  emoji: string;
  flagCode: string;
  phone: string;
  currency: string;
  native: string;
  languages: Language[];
  continent: Continent;
  states: State[];
}

interface CountryResponse {
  countries: Country[];
}

const App: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(10);

  const { loading, error, data, refetch } = useQuery<CountryResponse>(GET_COUNTRIES, { variables: { tt: "" } });

  useEffect(() => {
    if (!loading && data?.countries.length) {
      const indexToSelect = data.countries.length > 10 ? 9 : data.countries.length - 1;
      setSelectedIndex(indexToSelect);
    }
  }, [loading, data]);

  const handleItemClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchString = event.target.value;
    setText(searchString);
    const parsedSearch = parseSearchString(searchString);
    if (parsedSearch != null) {
      setIsValid(true);
      refetch({ tt: parsedSearch.search });
    } else {
      setIsValid(false);
    }
  };


  function parseSearchString(input: string): { search: string, group: number } | null {
    const regex = /^search:(.+)\s+group:(\d+)$/;
    const match = input.match(regex);
    if (match) {
      const search = match[1].trim();
      const group = parseInt(match[2]);
      console.log({ search, group });
      return { search, group };
    }
    return null;
  }

  return (
    <div className="container">
      <h1>Countries</h1>
      <input
        type="text"
        value={text}
        onChange={handleFilterChange}
        placeholder="Filter by name or capital..."
      />
      {!isValid && <h6>Please Enter in the format: 'search:keyword group:number'</h6>}
      <ul>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {data?.countries.map((country, index) => (
          <li
            key={index}
            onClick={() => handleItemClick(index)}
            className={selectedIndex === index ? 'selected' : ''}
          >
            <div className="country-info">
              <Flag countryCode={country.code} className="flag" />
              <span>{country.name}</span>
              <span>{country.capital}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;