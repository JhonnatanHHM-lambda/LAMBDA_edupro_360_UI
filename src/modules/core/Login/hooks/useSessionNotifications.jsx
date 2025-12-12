import { useEffect } from 'react';
import Swal from 'sweetalert2';

const useSessionNotifications = () => {
    useEffect(() => {

        const sessionExpired = localStorage.getItem('session_expired');
        if (sessionExpired) {
            Swal.fire({
                icon: 'error',
                title: 'Sesión expirada',
                text: 'Su sesión ha caducado. Por favor, inicie sesión nuevamente.',
                background: '#333',
                color: '#fff',
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
            });
            localStorage.removeItem('session_expired');
        }

        const closedSession = localStorage.getItem('closed_session');
        if (closedSession) {
            Swal.fire({
                icon: 'success',
                title: 'Sesión cerrada',
                text: 'Sesión cerrada correctamente.',
                background: '#333',
                color: '#fff',
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
            });
            localStorage.removeItem('closed_session');
        }

    }, []);
};

export default useSessionNotifications;
