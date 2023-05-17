import axios from 'axios';
import { useEffect } from 'react'
import {createNavigationContainerRef } from '@react-navigation/native';


const instance = axios.create({
    baseURL:  'http://143.110.190.217/api/'
})

const AxiosInterceptor = ({ children }) => {

    const navigationRef = createNavigationContainerRef();

    useEffect(() => {

        const resInterceptor = response => {
            console.log(response);
            return response;
        }

        const errInterceptor = error => {

            if (error.response.status === 401) {
                navigationRef.navigate('sign_in');
            }

            return Promise.reject(error);
        }


        const interceptor = instance.interceptors.response.use(resInterceptor, errInterceptor);

        return () => instance.interceptors.response.eject(interceptor);

    }, [navigationRef])

    return children;
}


export default instance;
export { AxiosInterceptor }