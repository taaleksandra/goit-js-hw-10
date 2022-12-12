'use strict';

import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputCountryName = document.querySelector('input#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

// Funckja obsługująca dodanie pozycji do listy wyszukiwanych krajów
const renderCountryList = countries => {
  const countryArray = countries.map(({ name, flags }) => {
    const countryItem = document.createElement('li');
    countryItem.classList.add('item');
    countryItem.innerHTML = `<img class="item-img" src=${flags.svg}> <p class="item-country">${name.common}</p>`;

    return countryItem;
  });
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
  countryList.append(...countryArray);
};

// Funckja obsługująca dodanie szczegółowych informacji o kraju
const renderCountryInfo = ({ name, flags, capital, population, languages }) => {
  const langArr = Object.values(languages);
  const langArrJoined = langArr.join(', ');

  let cap = capital;
  if (capital.length === 0) {
    cap = '-';
  }

  let lang = 'Languages';
  if (langArr.length === 1) {
    lang = 'Language';
  }

  countryList.innerHTML = '';
  countryInfo.innerHTML = `<div class="country-info"> <img class="country-info__img" src=${flags.svg}> <h3 class="country-info__country">${name.common}</h3> </div> <div> <p class="country-info-text"><span class="country-info__caption">Capital:</span> ${cap}</p> <p class="country-info__text"><span class="country-info__caption">Population:</span> ${population}</p> <p class="country-info__text"><span class="country-info__caption">${lang}:</span> ${langArrJoined}</p> </div>`;
};

// Funckja do obsługi pola tekstowego
const inputHandler = () => {
  const countryName = inputCountryName.value;

  fetchCountries(countryName)
    .then(countries => {
      if (countries.length > 10) {
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length === 1) {
        return renderCountryInfo(countries[0]);
      } else {
        renderCountryList(countries);
      }
    })
    .catch(err => {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
};

// Obsługa zdarzenia po wpisaniu nazwy kraju w pole tekstowe
inputCountryName.addEventListener(
  'input',
  debounce(() => {
    inputHandler();
  }, DEBOUNCE_DELAY)
);
