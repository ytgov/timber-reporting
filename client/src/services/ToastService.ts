import { toast } from 'react-toastify';

const options = {
  position: toast.POSITION.BOTTOM_RIGHT,
  hideProgressBar: true,
  autoClose: 3000,
};

export const notifySuccess = (text: string) => {
  toast.success(text, options);
};

export const notifyError = (text: string) => {
  toast.error(text, options);
};
