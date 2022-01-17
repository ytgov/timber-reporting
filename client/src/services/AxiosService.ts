import axios, { AxiosInstance, AxiosResponse } from 'axios';
import LoadingService from '../components/Loading/LoadingService';

const addErrorHandling = (ax: AxiosInstance) => {
  ax.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: any) => {
      if (error.response && (error.response.status === 502 || error.response.status === 503)) {
        return Promise.reject(error);
      }

  //    if (error.response && error.response.data && error.response.data.userMessage) {
      if (error.response && error.response.data ) {
//        console.log('Error includes UserMessage: ', error.response.data);
        return Promise.reject(error);
      }

      console.log('Issue with request', error);
      return Promise.reject(error);
    }
  );
};

const addLoading = (ax: AxiosInstance) => {
  ax.interceptors.request.use((config) => {
    if (!(config as any).disableLoading) {
      (config as any).loadingKey = LoadingService.add();
    }
    return config;
  });

  ax.interceptors.response.use(
    (response: AxiosResponse) => {
      if ((response.config as any).loadingKey) {
        LoadingService.remove((response.config as any).loadingKey);
      }
      return response;
    },
    (error: any) => {
      if (error.response && error.response.config) {
        if (!error.response.config.disableLoading) {
          if (error.response.config.loadingKey) {
            LoadingService.remove(error.response.config.loadingKey);
          } else {
            console.log('Failed to unregister loading modal from error:', error);
            LoadingService.removeAll();
          }
        }
      }
      return Promise.reject(error);
    }
  );
};
axios.defaults.withCredentials = true;

export const authAxios = axios.create();
export const defaultAxios = axios.create();

[authAxios, defaultAxios].forEach(addErrorHandling);
[authAxios].forEach(addLoading);
