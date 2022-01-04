import { authAxios } from './AxiosService';

export const checkToken = async () => {
  return await authAxios.get('/api/checkToken').then(
    (response) => {
      return response.statusText === 'OK';
    },
    (error) => {
  //    console.log('GPR error is ', error);
      let status = 0;
      if (error.response !== undefined) {
        status = error.response.status;
      }

      if (status === 502 || status === 503) {
        window.setTimeout(() => checkToken(), 1000);
      } else {
        //    console.error('JWT Error handler', error);
      }

      return false;
    }
  );
};
