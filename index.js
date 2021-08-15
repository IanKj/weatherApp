const gifImg = document.querySelector('img')
const searchButton = document.querySelector('#searchBtn')

async function getWeather(cityName) {
    try {
        const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName},us&units=imperial&appid=f61aea896ee8f387a5e6519e80d4f0b2`)

        if (resp.ok) {
            const data = await resp.json()
            console.log(data)
            return data
        } else throw new Error()
    }
    catch (error) {
        console.log(`${error}`)
    }

}

async function getData(city) {
    try {
        let data = await getWeather(city)
        let weatherData = {
            location: data.name,
            temperature: data.main.temp,
            weatherDescription: data.weather[0].description,
            humidity: data.main.humidity,
            sunrise: getDate(data.sys.sunrise),
            sunset: getDate(data.sys.sunset),
            windSpeed: data.wind.speed
        }
        return weatherData
    }
    catch (error) {
        console.log(error)
    }

}

function getDate(num) {
    let unix = num * 1000
    let dateTime = new Date(unix).toLocaleTimeString()
    console.log(dateTime)
    return dateTime
}

async function getImage(query) {
    try {
        const resp = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=ygNDtvwKTze1STUBZztFasjhbmAOdU8d&s=${query}+weather`, { mode: 'cors' })
        const imgData = await resp.json()
        console.log(imgData)
        gifImg.src = imgData.data.images.original.url
    } catch (error) {
        {
            console.error('Error: couldn\'t find a matching GIF, please try another search...', error)
            getImage('https://api.giphy.com/v1/gifs/translate?api_key=ygNDtvwKTze1STUBZztFasjhbmAOdU8d&s=404')
        }
    }
}

async function populateWeatherInfo(weatherData) {
    console.log(weatherData)
    const { humidity, location, sunrise, sunset, temperature, weatherDescription, windSpeed } = weatherData

    const infoContainer = document.querySelector('.weatherInfo')
    const header = document.createElement('h3')
    header.innerText = location
    infoContainer.appendChild(header)
    let weatherDescriptionText = weatherDescription
    weatherDescriptionText = weatherDescriptionText.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
    const weatherDescriptionDOM = document.createElement('p')
    weatherDescriptionDOM.innerText = `${weatherDescriptionText}`
    const temperatureDOM = document.createElement('p')
    temperatureDOM.innerText = `${temperature}\u00B0 F`
    const humidityDOM = document.createElement('p')
    humidityDOM.innerText = `Humidity: ${humidity}`
    const windSpeedDOM = document.createElement('p')
    windSpeedDOM.innerText = `Wind Speed: ${windSpeed}`
    const sunriseDOM = document.createElement('p')
    sunriseDOM.innerText = `Sunrise: ${sunrise}`
    const sunsetDOM = document.createElement('p')
    sunsetDOM.innerText = `Sunset: ${sunset}`


    infoContainer.append(weatherDescriptionDOM, temperatureDOM, humidityDOM, windSpeedDOM, sunriseDOM, sunsetDOM)
}


async function displayWeather(city) {
    const weatherData = await getData(city)
    getImage(weatherData.weatherDescription)
    populateWeatherInfo(weatherData)
    console.log(weatherData)
    //remove loader animation
    searchButton.classList.remove('searching')
}


searchButton.addEventListener('click', function () {
    const searchInput = document.querySelector('.searchField input')
    const searchVal = searchInput.value

    //add loading animation
    searchButton.classList.add('searching')
    clearData()
    displayWeather(searchVal).catch((error) => {
        console.log(error.name, error.message)
        handleError(error)
    })


})
function handleError(error) {
    if (error.name === 'TypeError') {
        clearData()
        const weatherInfo = document.querySelector('.weatherInfo')
        const alertField = document.createElement('div')
        alertField.classList.add('alertField')
        const message = document.createElement('p')
        message.innerText = `Oops, something went wrong. It looks like you probably had a typo. Search again please.`
        weatherInfo.append(message)

        //edit css
        weatherInfo.classList.add('error')
        searchButton.classList.remove('searching')
    }
}
function clearData() {
    const weatherInfo = document.querySelector('.weatherInfo')
    weatherInfo.querySelectorAll('*').forEach(n => n.remove())
}


displayWeather('Fairbanks')

//check for error with search entry
//if no match => clear data fields => populate with error code and message...unable to find that city, try again

//todo => remove error box on new search => 404 gif on error => styles => reorganize card layout => change to celcius => 