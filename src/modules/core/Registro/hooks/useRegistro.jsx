import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../../../services/api';

const useRegistro = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        cedula: '',
        correo: '',
        nombres: '',
        apellidos: '',
        password: '',
        genero: '',
        fecha_nacimiento: '',
        telefono: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar error del campo al escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        Swal.fire({
            title: 'Creando cuenta...',
            text: 'Por favor espera',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => Swal.showLoading(),
        });

        try {
            await api.post('/registro/', formData);

            Swal.fire({
                icon: 'success',
                title: '¡Registro exitoso!',
                text: 'Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.',
                confirmButtonText: 'Ir al login',
                confirmButtonColor: '#10b981',
                timer: 5000,
                timerProgressBar: true,
            }).then(() => {
                navigate('/');
            });

        } catch (error) {
            Swal.close();

            const serverErrors = error.response?.data || {};

            // Si el backend devuelve un error general
            if (serverErrors.error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: serverErrors.error,
                    confirmButtonColor: '#ef4444',
                });
            }

            // Errores por campo
            setErrors(serverErrors);

            if (Object.keys(serverErrors).length > 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Datos incorrectos',
                    text: 'Por favor revisa los campos marcados en rojo.',
                    confirmButtonColor: '#ef4444',
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
    };
};

export default useRegistro;