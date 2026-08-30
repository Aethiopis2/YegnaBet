import axios from 'axios';

export const API = axios.create({
    baseURL:'http://localhost:5150/api'
});


export const ASSET_URL:string = `http://localhost:5150/`;