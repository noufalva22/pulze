import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const handleNotification = (type, message) => {
    if (type === 'Success') {
        toast.success(message, {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            icon: true,
            theme: 'colored',
        });
    }
    if (type === 'Error') {
        toast.error(message, {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            icon: true,
            theme: 'colored',
        });
    }
};