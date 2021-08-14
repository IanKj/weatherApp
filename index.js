async function getWeather(cityName) {
    const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName},us&units=imperial&appid=f61aea896ee8f387a5e6519e80d4f0b2`)
    const data = await resp.json()
    return data
}

async function getData() {
    let data = await getWeather('fairbanks')
    let weatherData = {
        location: data.name,
        weatherDescription: data.weather[0].description,
        humidity: data.main.humidity,
        sunrise: getDate(data.sys.sunrise),
        sunset: getDate(data.sys.sunset),
        windSpeed: data.wind.speed
    }
    return weatherData
}

function getDate(num) {
    let unix = num * 1000
    let dateTime = new Date(unix).toLocaleTimeString()
    console.log(dateTime)
}

async function getImage(query) {
    try {
        const resp = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=ygNDtvwKTze1STUBZztFasjhbmAOdU8d&s=${query}`, { mode: 'cors' })
        const imgData = await resp.json()
        console.log(imgData)
        img.src = imgData.data.images.original.url
    } catch (error) {
        {
            console.error('Error: couldn\'t find a matching GIF, please try another search...', error)
            getImage('https://api.giphy.com/v1/gifs/translate?api_key=ygNDtvwKTze1STUBZztFasjhbmAOdU8d&s=404')
        }
    }
}
const gifImg = document.querySelector('img')

async function populateImage() {
    const weatherData = await getData('Fairbanks')
    console.log(weatherData)
}
populateImage()

// location, US
// humidity
// sunrise and sunset
// weather description
// wind speed