const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const apikey = 'ad452a8ebb03439229162890a93e8e60';
const input = $('#input');
const infoText = $('.info-text');
const container = $('.container');
const header = $('header');
const returnBtn = $('header i');
const weatherImg = $('img');
const locationBtn = $('.input-content button');
let nameCountry;

window.addEventListener('keypress', e => {
    const valueInput = input.value;
    if (e.key === 'Enter' && valueInput) {
        fetchApi(valueInput);
    }
});

locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser not support geolocation api");
    }
});

const onError = (error) => {
    infoText.innerText = error.message;
    infoText.classList.add('error');
}

const onSuccess = async(position) => {
    pending();
    const { latitude, longitude } = position.coords;
    const apiLocationUrl = `https://api.openweathermap.org/data/2.5/find?lat=${latitude}&lon=${longitude}&cnt=10&appid=${apikey}&lang=vi&units=metric`;
    const res = await axios.get(apiLocationUrl);
    setTimeout(() => {
        weatherDetails(res.data.list[0]);
    }, 300);
}

const fetchApi = async(value) => {
    pending();
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=${apikey}&lang=vi&units=metric`
    try {
        const res = await axios.get(apiUrl);
        setTimeout(() => {
            weatherDetails(res.data);
        }, 300);
    } catch (err) {
        infoText.classList.replace('pending', 'error');
        infoText.innerText = `${value} isn't a valid city name`;
    }
}

// Loading when fetch API
const pending = () => {
    infoText.classList.add('pending');
    infoText.innerText = 'Getting weather details...';
}

// show box weather details
const showBoxWeather = () => {
    container.classList.add('active');
    header.classList.add('show');
}

// return default to search new city
const returnDefault = () => {
    container.classList.remove('active');
    header.classList.remove('show');
    infoText.classList.remove('pending');
    infoText.classList.remove('error');
    input.value = '';
}

// Change name country
const changeNameCountry = (country) => {
    for (let key in countryList) {
        if (key === country) {
            nameCountry = countryList[key];
        }
    }

    if (!nameCountry) {
        nameCountry = country;
    }
}

const weatherDetails = data => {
    showBoxWeather();
    const city = data.name;
    const { country } = data.sys;
    const { temp, feels_like, humidity } = data.main;
    const { id, description } = data.weather[0];
    changeNameCountry(country);

    $('.temp .numb-temp').innerText = Math.floor(temp);
    $('.weather').innerText = description;
    $('.location span').innerText = `${city}, ${nameCountry}`;
    $('.details .temp .numb').innerText = Math.floor(feels_like);
    $('.humidity .details span').innerText = humidity + '%';

    if (id == 800) {
        weatherImg.src = "./img/clear.svg";
    } else if (id >= 200 && id <= 232) {
        weatherImg.src = "./img/storm.svg";
    } else if (id >= 600 && id <= 622) {
        weatherImg.src = "./img/snow.svg";
    } else if (id >= 701 && id <= 781) {
        weatherImg.src = "./img/haze.svg";
    } else if (id >= 801 && id <= 804) {
        weatherImg.src = "./img/cloud.svg";
    } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
        weatherImg.src = "./img/rain.svg";
    }
}

// return default
returnBtn.addEventListener('click', returnDefault);