import axios from 'axios';

// Define la URL base de tu backend de Django. 
// ¡Ajusta el puerto 8000 si tu servidor backend usa uno diferente!
const API_BASE_URL = 'http://localhost:8000/api'; 

// 1. Crea la instancia de Axios
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/*
    2. Interceptor de Peticiones
    Este interceptor adjunta automáticamente el token de autenticación 
    (Bearer Token) a todas las peticiones salientes.
*/
api.interceptors.request.use(
    (config) => {
        // Obtenemos el token almacenado en el localStorage
        const token = localStorage.getItem('accessToken');
        
        // Si el token existe, lo adjuntamos al encabezado de autorización
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Manejo de errores de configuración
        return Promise.reject(error);
    }
);


export default api;