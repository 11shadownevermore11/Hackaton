import {default as axiosLib} from "axios";

const axios = axiosLib.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 1000
});

export default axios;
