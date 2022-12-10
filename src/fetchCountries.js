'use strict';

export const fetchCountries = name => {
  const urlRestCountries = 'https://restcountries.com/v3.1/name/';
  const fieldsRestCountries = '?fields=name,capital,population,flags,languages';

  const trimName = name.trim();

  if (trimName.length === 0) {
    return;
  }

  return fetch(urlRestCountries + trimName + fieldsRestCountries)
    .then(res => {
      if (!res.ok) {
        throw new Error(res.status);
      }
      return res.json();
    })
    .then(data => {
      console.log(`Wyszukane wartości dla: ${trimName}`);
      console.log(data);

      return data;
    })
    .catch(err => {
      console.error(err);
    });
};
