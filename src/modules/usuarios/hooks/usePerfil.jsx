import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../../services/api'; 

const usePerfil = () => {
    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        correo: '',
        telefono: '',
        fecha_nacimiento: '',
        genero: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    navigate('/');
                    return;
                }

                const response = await api.get('usuarios/yo/');
                const data = response.data;

                setUserData(data);
                setFormData({
                    nombres: data.nombres || '',
                    apellidos: data.apellidos || '',
                    correo: data.correo || '',
                    telefono: data.telefono || '',
                    fecha_nacimiento: data.fecha_nacimiento || '',
                    genero: data.genero || '',
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Sesión expirada',
                    text: 'Por favor inicia sesión nuevamente.',
                    confirmButtonColor: '#ef4444',
                });
                localStorage.removeItem('access_token');
                navigate('/');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        Swal.fire({
            title: 'Guardando cambios...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

        try {
            const response = await api.patch('usuarios/yo/', formData);

            setUserData(response.data);
            setIsEditing(false);

            Swal.fire({
                icon: 'success',
                title: '¡Perfil actualizado!',
                text: 'Tus datos han sido guardados correctamente.',
                timer: 3000,
                confirmButtonColor: '#10b981',
            });
        } catch (error) {
            const data = error.response?.data || {};
            setErrors(data);

            Swal.fire({
                icon: 'error',
                title: 'Error al guardar',
                text: 'Revisa los campos en rojo',
                confirmButtonColor: '#ef4444',
            });
        }
    };

    return {
        userData,
        formData,
        errors,
        isLoading,
        isEditing,
        setIsEditing,
        handleChange,
        handleSubmit,
    };
};

export default usePerfil;