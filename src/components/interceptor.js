import axios from 'axios';
import { BaseUrl } from '../constants/api_constants';

const axiosInstance = axios.create({
  baseURL: 'http://143.110.190.217/api/',
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Modify the request config if needed
    console.log('Request:', config);
    return config;
  },
  (error) => {
    // Handle request error
    console.log('Request error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(

  (response) => {
    // Process the response data if needed
    console.log('Response:', response);
    return response;
  },
  (error) => {
    // Handle response error
    console.log('Response error:', error);
    
    // Print the error response
    if (error.response) {
      console.log('Error response:', error.response.data);
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.eject(
    (response) => {
      // Process the response data if needed
      console.log('Response:', response);
      return response;
    },

    (error) => {
      // Handle response error
      console.log('Response error:', error);
      return Promise.reject(error);
    }
  );

export default axiosInstance;
