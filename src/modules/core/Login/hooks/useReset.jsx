import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../../../services/api';

const useReset = () => {
    const [correo, setCorreo] = useState('');
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleReset = async (event) => {
        event.preventDefault();
        setErrors({}); // Limpiar errores previos

        Swal.fire({
            title: 'Enviando correo...',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            const response = await api.post('/recuperar-contrasena/', { correo });

            // Éxito
            setSuccess(true);
            Swal.close(); // Cierra el loading

            
        } catch (error) {
            Swal.close(); // Cierra el loading

            const serverErrors = error.response?.data || {};
            setErrors(serverErrors);

            let errorMessage = 'Error al recuperar la contraseña. Por favor, verifica el correo ingresado.';
            
            if (serverErrors.error) {
                errorMessage = serverErrors.error;
            } else if (serverErrors.correo) {
                errorMessage = serverErrors.correo.join(' ');
            }

            Swal.fire({
                icon: 'error',
                title: '¡Oops!',
                text: errorMessage,
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#ef4444',
            });
        }
    };

    return {
        correo,
        setCorreo,
        errors,
        handleReset,
        success,
        setSuccess, 
    };
};

export default useReset;