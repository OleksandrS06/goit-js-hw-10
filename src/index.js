import './css/styles.css';
import fetchCountries from './fetchCountries';
import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector("#search-box");
const countryinfoEl = document.querySelector(".country-info");
const countryListEl = document.querySelector(".country-list");

// колбек функція, яка спрацьовує на інпут
function onInputElCountrySearch(event) {
  let name = event.target.value.trim();
  
  if (!name) {
    clearDisplayedInfo();
    return
  }
  // викликаємо функцію імпортовану з іншого файлу і передаємо їй значення введене в інпут,
  // вона зробить запит на сервер і поверне нам проміс в якому містяться дані з сервера (дані в масиві)
  fetchCountries(name)
    // використовуємо метод then - тут data масив об'єктів
    .then(data => {
      // перевірки що робити в залежності від повернутої кількості об'єктів в масиві 
      if (data.length > 10) {
        tooManyMatches();
      }
      else if (data.length === 1) { 
        countryinfoEl.innerHTML = createOneCountryMarkup(data);
      }
      else if (data.length >= 2 && data.length < 10) {
        countryListEl.innerHTML = createCountryList(data);
      }
    })
    // якщо запит неправильний або є помилка, її відловлюємо методом catch 
    .catch(err => {
    if (err.message === '404') {
      countryNotFound();
    }
  });
};
    // слухач на інпут
    inputEl.addEventListener("input", debounce(onInputElCountrySearch, DEBOUNCE_DELAY));

  // функція в якій створюється розмітка якщо в масиві один об'єкт, тобто повне співпадіння
function createOneCountryMarkup(countryDataArray) {
  clearDisplayedInfo();
  const { name, capital, population, languages } = countryDataArray[0];
  return `<div class = "country-info-container"><img src = "${countryDataArray[0].flags.svg}" alt = "country flag image" width = "45">
  <span class = "country-info__name">${name.official}</span></div>
  <div class = "country-info">Capital: ${capital.join(", ")}</div>
  <div class = "country-info">Population: ${population}</div>
  <div class = "country-info">Languages: ${Object.values(languages).join(", ")}</div>
  `
};
// функція в якій створюється розмітка у випадку співпадіння від 2-х до 10 ел
function createCountryList(countryData) {
  clearDisplayedInfo();
  return countryData.map((el) => {
    return `<li class = "country-item">
    <img src = "${el.flags.svg}" class = "country-image" alt = "country flag image" width = "25">
  <span class = "country-item__name">${el.name.official} </span></li>
  `}).join("");
};
// доп. функція видає повідомлення що забагато співпадінь ( > 10)
function tooManyMatches() {
  Notify.info("Too many matches found. Please enter a more specific name.");
};
// доп. функція з повідомленням про помилку
function countryNotFound() {
  Notify.failure("Oops, there is no country with that name");
};
// очистник
function clearDisplayedInfo() {
  countryinfoEl.innerHTML = '';
  countryListEl.innerHTML = '';
}