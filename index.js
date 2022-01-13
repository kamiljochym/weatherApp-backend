require('dotenv').config()
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const { response } = require('express')

const app = express()
app.use(express.json())

app.use(cors())

app.use(express.static('build'))

const google_maps_api_key = process.env.GOOGLE_MAPS_API_KEY
const weather_api_key = process.env.WEATHER_API_KEY

app.get('/', (req, res) => {
    res.send("backend wokring baby")
})

app.get('/autocomplete/:location', (req,res) => {

    axios
        .get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${req.params.location}&types=geocode&key=${google_maps_api_key}`)
        .then(response => {
            res.json(response.data)
        })
    
    })

app.post('/coords', (req, res) => {
    const locationName = req.body.name.replace(", ", "+")
    axios
        .get(encodeURI(`https://maps.googleapis.com/maps/api/geocode/json?address=${locationName}&key=${google_maps_api_key}`))
        .then(response => {
            const lat = response.data.results[0].geometry.location.lat
            const lng = response.data.results[0].geometry.location.lng
            return axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=metric&exclude=minutely,alerts&appid=${weather_api_key}`)
        })
        .then(response => {
            console.log(response.data);
            res.send(response.data)
        })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})