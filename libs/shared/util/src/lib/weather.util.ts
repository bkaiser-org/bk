import { format } from 'date-fns';
import { DateFormat, getWeekdayI18nKey } from './date.util';
import { getDirectionFromAzimuth } from './geo.util';

export const FIREBASE_FUNCTIONS_BASE_URL = 'https://us-central1-scs-weather.cloudfunctions.net';

export interface Property {
    date: string,
    value: string
}

export interface ForecastData {
    interval: number,
    date: string,
    weekday: string,
    sunrise: string,
    sunset: string,
    tempMin: string,
    tempMax: string,
    tempMorning: string,
    tempFeelsMorning: string,
    pressure: number,
    humidity: number,
    windSpeed: number,
    windDir: string,
    clouds: number | undefined; // cloud cover, %
    uvi: number | undefined; // UV index
    pop: number, // probability of precipitation, 0-1
    rain1: number, // precipitation, mm/h
    snow1: number, // snow, mm/h
    weatherCondition: number, // WeatherCondition
}

export interface MeteoData {
    sunrise: string | undefined;
    sunset: string | undefined;
    tempAir: number | undefined;    // air temperature, °C
    tempFelt: number | undefined;   // felt temperature, °C
    pressure: number | undefined; // atmosperic pressure at sea level, hPa
    humidity: number | undefined; // relative humidity, %
    clouds: number | undefined; // cloud cover, %
    uvi: number | undefined; // UV index
    windSpeed: number | undefined;  // wind speed, m/s
    windDir: string | undefined;    // wind direction
    rain1: number | undefined;    // precipitation, mm/h
    snow1: number | undefined;      // snow, mm/h
    weatherCondition: number | undefined;   // WeatherCondition
    forecast: ForecastData[] | undefined;
}

/* -------------------------------------- open weather -------------------------------------- */
export interface OpenWeatherTempInfo {
    day: number,
    min?: string,
    max?: string,
    night: number,
    eve: number,
    morn: number
}
export interface OpenWeatherInfo {
    id: number,
    main: string,
    description: string,
    icon: string
}

export interface OpenWeatherDailyInfo {
    dt: number,
    sunrise: number,
    sunset: number,
    moonrise: number,
    moonset: number,
    moon_phase: number,
    temp: number | OpenWeatherTempInfo,
    feels_like: OpenWeatherTempInfo,
    pressure: number,
    humidity: number,
    dew_point: number,
    wind_speed: number,
    wind_gust: number,
    wind_deg: number,
    clouds: number,
    uvi: number,
    pop: number,
    rain: {
        '1h': number
    },
    snow: {
        '1h': number
    },
    weather: [OpenWeatherInfo]
}

export interface OpenWeatherData {
    lat: number,
    lon: number,
    timezone: string,
    timezone_offset: number,
    current: OpenWeatherDailyInfo,
    daily: [OpenWeatherDailyInfo]
}

export function convertOpenWeatherData(openWeatherData: OpenWeatherData): MeteoData {
    const _forecast = [];
    for (let i = 0; i < openWeatherData.daily.length; i++) {
        _forecast.push(convertDailyForecast(openWeatherData.daily[i], i));
    }
    return {
        sunrise: format(new Date(openWeatherData.current.sunrise * 1000), DateFormat.Time),
        sunset: format(new Date(openWeatherData.current.sunset * 1000), DateFormat.Time),
        tempAir: (typeof (openWeatherData.current.temp) === 'number') ? openWeatherData.current.temp : openWeatherData.current.temp.day,
        tempFelt: (typeof(openWeatherData.current.feels_like) === 'number') ? openWeatherData.current.feels_like : openWeatherData.current.feels_like.day,
        pressure: openWeatherData.current.pressure,
        humidity:   openWeatherData.current.humidity,
        clouds:     openWeatherData.current.clouds,
        uvi:    openWeatherData.current.uvi,
        windSpeed:   openWeatherData.current.wind_speed,
        windDir:    getDirectionFromAzimuth(openWeatherData.current.wind_deg),
        rain1:  !openWeatherData.current.rain ? 0 : openWeatherData.current.rain["1h"],
        snow1: !openWeatherData.current.snow ? 0 : openWeatherData.current.snow["1h"],
        weatherCondition: convertOpenWeatherMapCondition(openWeatherData.current.weather[0].id),
        forecast: _forecast
    }
}

function convertDailyForecast(daily: OpenWeatherDailyInfo, index: number): ForecastData {
    let _tempMin = '';
    let _tempMax = '';
    let _tempMorning = '';
    let _tempFeelsMorning = '';
    if (typeof(daily.temp) === 'number') {
        _tempMin = daily.temp.toString();
        _tempMax = daily.temp.toString();
        _tempMorning = daily.temp.toString();
        _tempFeelsMorning = daily.temp.toString();
    } else { // OpenWeatherTempInfo
        _tempMin = daily.temp.min ? daily.temp.min.toString() : '';
        _tempMax = daily.temp.max ? daily.temp.max.toString() : '';
        _tempMorning = daily.temp.morn.toString();
        _tempFeelsMorning = daily.feels_like.morn.toString();
    }
    return {
        interval: index + 1,
        date: format(new Date(daily.dt * 1000), DateFormat.StoreDate),
        weekday: getWeekdayI18nKey(new Date(daily.dt * 1000)),
        sunrise: format(new Date(daily.sunrise * 1000), DateFormat.Time),
        sunset: format(new Date(daily.sunset * 1000), DateFormat.Time),
        tempMin: _tempMin,
        tempMax: _tempMax,
        tempMorning: _tempMorning,
        tempFeelsMorning:  _tempFeelsMorning,
        pressure: daily.pressure,
        humidity: daily.humidity,
        windSpeed: daily.wind_speed,
        windDir: getDirectionFromAzimuth(daily.wind_deg),
        clouds: daily.clouds ,
        uvi: daily.uvi,
        pop: Math.trunc(daily.pop * 100),
        rain1: !daily.rain ? 0 : daily.rain["1h"],
        snow1: !daily.snow ? 0 : daily.snow["1h"],
        weatherCondition: convertOpenWeatherMapCondition(daily.weather[0].id)
    }
}

export enum SpeedFormat {
    Kmh = 'km/h',
    Ms = 'm/sec'
}

/**
 * Convert a speed from one format to another.
 * @param value the speed number to convert.
 * @param fromFormat the speed format that the value should have
 * @param toFormat the speed format for the result
 */
export function convertSpeedFormat(value: number | string, fromFormat = SpeedFormat.Ms, toFormat = SpeedFormat.Kmh): number
{
    if (!value) return 0;
    if (typeof(value) === 'string') value = Number(value);
    if (fromFormat === SpeedFormat.Ms) {
        return toFormat === SpeedFormat.Kmh ? value * 3.6 : value;
    } else {    // fromFormat = SpeedFormat.Kmh
        return toFormat === SpeedFormat.Kmh ? value : value / 3.6;
    }
}

export function convertOpenWeatherMapCondition(openWeatherId: number): number {
    if (openWeatherId >= 200 && openWeatherId < 300) {
        return 0; // Thunderstorm;
    } else if (openWeatherId >= 300 && openWeatherId < 500) {
        return 1; // Drizzle;
    } else if (openWeatherId >= 500 && openWeatherId < 505) {
        return 2; // Rain;
    } else if (openWeatherId === 511) {
        return 3; // Hail;
    } else if (openWeatherId >= 512 && openWeatherId < 600) {
        return 4; // Shower;
    } else if (openWeatherId >= 600 && openWeatherId < 700) {
        return 5; // Snow;
    } else if (openWeatherId >= 700 && openWeatherId < 800) {
        return 6; // Fog;
    } else if (openWeatherId === 800) {
        return 7; // Clear;
    } else if (openWeatherId === 801) {
        return 8; // FewClouds;
    } else if (openWeatherId === 802) {
        return 9; // ScatteredClouds;
    } else if (openWeatherId === 803 || openWeatherId === 804) {
        return 10; // OvercastClouds;
    } else {
        return 8; // FewClouds;
    }
}

