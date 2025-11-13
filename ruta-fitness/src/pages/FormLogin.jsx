import React from 'react';
import FormLogin from '../components/loginUsuario/FormLogin'; // Importa el componente visual


 
function LoginPage(props) {
    // La Page solo actúa como un puente, pasando todas las props al componente visual
    return <FormLogin {...props} />;
}

export default LoginPage;