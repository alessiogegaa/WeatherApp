import axios from 'axios'
import { apiKey } from '../constants/constants'

const forecastEndpoint = params => `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`;
const locationEndpoint = params => `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`;

const apiCall = async(endpoint)=>{
    const options = {
        method: `GET`,
        url: endpoint
    }
    try{
       const response =await axios.request(options);
       return response.data;
    }
    catch(err)
    {
        console.log(err);
        return null;
    }
}

export const fetchweatherForecast = params =>{
    let forecast = forecastEndpoint(params);
    return apiCall(forecast);
}
export const fetchLocations = params =>{
    let forecast = locationEndpoint(params);
    return apiCall(forecast);
}