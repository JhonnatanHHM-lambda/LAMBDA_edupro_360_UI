import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../../../services/api';
import { useUser } from '../../../../context/UserContext';


const useAuth = () => {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useUser();

    useEffect(() => {
        localStorage.clear();
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault();
        setErrors({});

        // Mostrar carga
        Swal.fire({
            title: 'Iniciando sesión...',
            didOpen: () => {
                Swal.showLoading();
            },
            background: '#333',
            color: '#fff',
            allowOutsideClick: false,
            allowEscapeKey: false,
        });

        try {
            const response = await api.post('login/', { correo, password });

            // Si la petición fue exitosa, cerramos el loading
            Swal.close();

            // Guardamos token
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

            const userData = {
                user_id: response.data.user.id,
                cedula: response.data.user.cedula,
                correo: response.data.user.correo,
                nombres: response.data.user.nombres,
                apellidos: response.data.user.apellidos,
                nombre_completo: response.data.user.nombre_completo,
                genero: response.data.user.genero,
                codigo: response.data.user.codigo,
                fecha_nacimiento: response.data.user.fecha_nacimiento,
                telefono: response.data.user.telefono,
                rol: response.data.user.rol,
                permisos_rol: response.data.user.permisos_rol,
                estado: response.data.user.estado,
                creado: response.data.user.creado,
                modificado: response.data.user.modificado,
            };

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));

            // Notificación de éxito
            Swal.fire({
                icon: 'success',
                title: '¡Sesión iniciada!',
                text: 'Bienvenido.',
                background: '#333',
                color: '#fff',
                timer: 2500,
                timerProgressBar: true,
                showConfirmButton: false,
            });

            const from = location.state?.from?.pathname || '/app/inicio';
            navigate(from);

        } catch (error) {
            Swal.close();

            if ("error" in error.response.data) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response.data.error || 'Error al iniciar sesión.',
                    background: '#333',
                    color: '#fff',
                });
            } else {
                setErrors(error.response.data);
                Swal.fire({
                    icon: 'error',
                    title: 'Credenciales incorrectas',
                    text: 'Por favor, verifica tu correo y contraseña.',
                    background: '#333',
                    color: '#fff',
                });
            }
        }
    };

    return {
        correo,
        password,
        errors,
        setCorreo,
        setPassword,
        handleLogin,
    };
};

export default useAuth;
