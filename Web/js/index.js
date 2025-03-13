document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const feedback = document.getElementById('feedback');
    if (username) {
        feedback.textContent = "Iniciando sesión...";
        feedback.style.color = "#3498db";
        feedback.classList.remove('hidden');
        const usuario = await getUsuario(username);
        
        if (usuario) {
            feedback.textContent = "¡Inicio de sesión exitoso!";
            feedback.style.color = "#27ae60";
            
           
            localStorage.setItem('username', username);
            
            setTimeout(() => {
                alert("Redirigiendo al panel principal...");
                window.location.href = "./inicio.html";
            }, 1500);
        } else {
            // Si el usuario no existe
            feedback.textContent = "Usuario no encontrado.";
            feedback.style.color = "#e74c3c";
            feedback.classList.remove('hidden');
        }
    } else {
        feedback.textContent = "Por favor, completa todos los campos";
        feedback.style.color = "#e74c3c";
        feedback.classList.remove('hidden');
    }
});

async function getUsuario(nombre) {
    try {
        const response = await fetch('http://localhost:9000/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre })
        });
        if (!response.ok) {
            return null;
        }

        const parsedResponse = await response.json();
        return parsedResponse.usuario;
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        return null;
    }
}
