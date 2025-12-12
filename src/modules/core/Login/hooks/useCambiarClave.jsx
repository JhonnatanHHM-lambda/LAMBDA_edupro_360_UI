import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../../../services/api';

const useCambiarClave = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Validación del token al cargar
    useEffect(() => {
        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'Enlace inválido',
                text: 'No se encontró el token necesario para cambiar la contraseña.',
                confirmButtonText: 'Ir al inicio',
                confirmButtonColor: '#6366f1',
                allowOutsideClick: false,
            }).then(() => {
                navigate('/');
            });
        }
    }, [token, navigate]);

    const handleChangePassword = async (event) => {
        event.preventDefault();
        setErrors({}); // Limpiar errores previos

        // Mostrar loading bonito
        Swal.fire({
            title: 'Cambiando contraseña...',
            text: 'Por favor espera',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            await api.post('confirmar-recuperacion/', {
                token,
                password: newPassword,
            });

            // Éxito: contraseña cambiada
            Swal.fire({
                icon: 'success',
                title: '¡Contraseña cambiada!',
                text: 'Tu contraseña ha sido actualizada correctamente.',
                confirmButtonText: 'Iniciar sesión',
                confirmButtonColor: '#6366f1',
                allowOutsideClick: false,
                timer: 5000,
                timerProgressBar: true,
            }).then((result) => {
                if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
                    navigate('/');
                }
            });

        } catch (error) {
            Swal.close(); // Cerrar loading

            const data = error.response?.data || {};

            // Guardar errores para mostrar en el formulario (rojo en inputs)
            setErrors(data);

            let errorMessage = 'Error al cambiar la contraseña. Por favor, intenta de nuevo.';

            if (data.error) {
                errorMessage = data.error;
            } else if (data.new_password) {
                errorMessage = data.new_password.join(' ');
            } else if (data.token) {
                errorMessage = 'El enlace ha expirado o es inválido.';
            }

            // Mostrar error claro y bonito
            Swal.fire({
                icon: 'error',
                title: 'No se pudo cambiar la contraseña',
                text: errorMessage,
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#ef4444',
            });
        }
    };

    return {
        token,
        newPassword,
        setNewPassword,
        errors,
        handleChangePassword,
    };
};

export default useCambiarClave;