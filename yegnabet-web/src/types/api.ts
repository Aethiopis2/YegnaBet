import axios from 'axios';

export const BASE_URL_STRING = 'http://localhost:5150';

export const API = axios.create({
    baseURL:'http://localhost:5150/api'
});


export const ASSET_URL:string = `http://localhost:5150`;

export const BASE_URL = axios.create({
    baseURL: `${BASE_URL_STRING}`
});

export const API_BASE = axios.create({
    baseURL: `${BASE_URL_STRING}/api`
});