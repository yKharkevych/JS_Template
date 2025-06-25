const input = document.querySelector('.search-box input');
const button = document.querySelector('.search-box button');
const locationEl = document.querySelector('.weather-location h2');
const countryEl = document.querySelector('.country');
const tempEl = document.querySelector('.temperature');
const descEl = document.querySelector('.description');
const detailsEl = document.querySelector('.details');
const forecastContainer = document.querySelector('.weather-forecast');
const iconEl = document.querySelector('.weather-icon img');
const popup = document.getElementById('popup');
const popupInfo = document.getElementById('popup-info');
const closePopup = document.querySelector('.popup .close');

let forecastData = [];
const API_KEY = 'VVYYJCBZJQ2ZCNYWBYR6NAJZ6'; 
document.addEventListener('DOMContentLoaded', () => {
  fetchWeather('Kyiv');
});
button.addEventListener('click', () => {
  const city = input.value.trim();
  if (city) fetchWeather(city);
});

async function fetchWeather(city) {
  try {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(city)}?unitGroup=metric&key=${API_KEY}&contentType=json`);
    const data = await response.json();
    updateMainWeather(data);
    updateForecast(data.days);
    forecastData = data.days;
  } catch (error) {
    alert("Error fetching weather");
  }
}

function updateMainWeather(data) {
  locationEl.textContent = data.address.split(',')[0];
  countryEl.textContent = data.resolvedAddress.split(',').pop();
  const today = data.days[0];
  tempEl.textContent = `${Math.round(today.temp)}°C`;
  descEl.textContent = today.conditions;
  detailsEl.innerHTML = `
    <span>Wind: ${today.windspeed} km/h</span><br>
    <span>Humidity: ${today.humidity}%</span>
  `;
  iconEl.src = getIcon(today.icon);
}

function updateForecast(days) {
  forecastContainer.innerHTML = '';
  days.slice(0, 10).forEach((day, index) => {
    const card = document.createElement('div');
    card.classList.add('day-card');
    card.innerHTML = `
      <div class="day">${new Date(day.datetime).toLocaleDateString('en-US', { weekday: 'short' })}</div>
      <img src="${getIcon(day.icon)}" alt="${day.icon}">
      <div class="temp-max">${Math.round(day.tempmax)}°C</div>
      <div class="temp-min">${Math.round(day.tempmin)}°C</div>
    `;
    card.addEventListener('click', () => updateDetails(index));
    card.querySelector('.temp-max').addEventListener('click', (e) => {
      e.stopPropagation();
      showPopup(day);
    });
    forecastContainer.appendChild(card);
  });
}

function updateDetails(index) {
  const day = forecastData[index];
  tempEl.textContent = `${Math.round(day.temp)}°C`;
  descEl.textContent = day.conditions;
  detailsEl.innerHTML = `
    <span>Wind: ${day.windspeed} km/h</span><br>
    <span>Humidity: ${day.humidity}%</span>
  `;
  iconEl.src = getIcon(day.icon);
  locationEl.textContent = city;
}

function getIcon(condition) {
  if (condition.includes("rain")) return "rainy.png";
  if (condition.includes("cloud")) return "cloudy.png";
  return "sunny.png";
}
