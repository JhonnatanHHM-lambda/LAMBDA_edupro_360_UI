import { useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../../../../services/api'

const useTokenRefresh = () => {
    useEffect(() => {
        const checkTokenExpiration = async () => {
            const accessToken = localStorage.getItem('access_token');
            const refreshToken = localStorage.getItem('refresh_token');

            if (!accessToken || !refreshToken) return;

            try {
                // Decodificar el token (sin librerías externas)
                const payload = JSON.parse(atob(accessToken.split('.')[1]));
                const exp = payload.exp * 1000; // exp está en segundos → milisegundos
                const now = Date.now();
                const timeLeft = exp - now;
                const twoMinutes = 2 * 60 * 1000;

                if (timeLeft > 0 && timeLeft <= twoMinutes) {
                    // Mostrar alerta solo una vez
                    if (localStorage.getItem('token_warning_shown') === 'true') return;
                    localStorage.setItem('token_warning_shown', 'true');

                    const result = await Swal.fire({
                        title: 'Sesión por expirar',
                        text: 'Tu sesión está por expirar. ¿Deseas mantenerla activa?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, mantener sesión',
                        cancelButtonText: 'No, cerrar sesión',
                        timer: 120000, // 2 minutos
                        timerProgressBar: true,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    });

                    localStorage.removeItem('token_warning_shown');

                    if (result.isConfirmed) {
                        // Refrescar token
                        try {
                            const response = await api.post('/refresh/', {
                                refresh: refreshToken,
                            });

                            // Guardar nuevo access token
                            localStorage.setItem('access_token', response.data.access);
                            Swal.fire('Sesión renovada', 'Puedes seguir trabajando', 'success');
                        } catch (err) {
                            Swal.fire('Error', 'No se pudo renovar la sesión', 'error');
                            logout();
                        }
                    } else {
                        logout();
                    }
                }
            } catch (err) {
                console.error('Error al decodificar token:', err);
            }
        };

        const logout = () => {
            localStorage.clear();
            window.location.href = '/';
        };

        // Verificar cada 30 segundos
        const interval = setInterval(checkTokenExpiration, 30000);
        checkTokenExpiration(); // primera verificación inmediata

        return () => clearInterval(interval);
    }, []);
};

export default useTokenRefresh;