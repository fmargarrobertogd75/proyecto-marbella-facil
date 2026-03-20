// src/api.js
const API_URL = import.meta.env.VITE_API_URL;

export const loginUsuario = async (credenciales) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(credenciales)
        });

        if (!response.ok) throw new Error('Error en el login');

        return await response.json();
    } catch (error) {
        console.error("Error de conexión:", error);
        return { error: "No se pudo conectar con Laravel" };
    }
};