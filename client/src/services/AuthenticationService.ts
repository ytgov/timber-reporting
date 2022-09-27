import { authAxios } from './AxiosService';

export const checkToken = async () => {
  return await authAxios.get('/api/checkToken').then(
    (response) => {
      return response.status === 200 ? 'OK' : 'KO';
    },
    (error) => {
      if (error.response.data === 'Auth Email Not Verified') {
        return 'Email_Unverified';
      } else if (error.response.data.userMessage === 'Not Authorized!') {
        return 'No_Acct_Found';
      }
      let status = 0;
      if (error.response !== undefined) {
        status = error.response.status;
      }

      if (status === 502 || status === 503) {
        window.setTimeout(() => checkToken(), 1000);
      }
      return 'KO';
    }
  );
};
