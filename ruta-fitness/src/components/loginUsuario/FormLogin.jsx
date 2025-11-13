import React from 'react';
import './FormLogin.css' // Asumo que este archivo existe y tiene los estilos

// Este componente solo se encarga de mostrar la interfaz
function FormLogin({ username, password, setUsername, setPassword, onSubmit, error, loading, onNavigate }) {
    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Iniciar Sesión</h2>
                {/* El formulario llama a la función onSubmit que viene del contenedor (LoginPage) */}
                <form onSubmit={onSubmit} className="login-form">
                    <div className="form-group">
                        <label className="form-label">Usuario:</label>
                        <input
                            type="text"
                            className="form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Contraseña:</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {/* Muestra errores de la API */}
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Cargando...' : 'Acceder'}
                    </button>
                </form>

                <p className="register-text">
                    ¿No tienes cuenta?
                    {/* Botón para navegar a la página de registro */}
                    <button onClick={() => onNavigate("Registro")} className="navigate-button">
                        Regístrate aquí
                    </button>
                </p>
            </div>
        </div>
    );
}


export default FormLogin;