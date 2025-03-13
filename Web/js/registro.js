document
  .getElementById("register-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const feedback = document.getElementById("feedback");

    // Validación de nombre vacío
    if (nombre === "") {
      feedback.textContent = "Por favor, ingresa tu nombre.";
      feedback.style.color = "red";
      feedback.classList.remove("hidden");
      return;
    }

    feedback.textContent = "Registrando...";
    feedback.style.color = "#3498db";
    feedback.classList.remove("hidden");

    let width = 0;
    const progressInterval = setInterval(() => {
      if (width >= 100) {
        clearInterval(progressInterval);
        postUsuario(nombre);
      } else {
        width += 5;
      }
    }, 100);
  });

async function postUsuario(usuario) {
  const response = await fetch("http://localhost:9000/usuarios/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nombre: usuario }),
  });

  const feedback = document.getElementById("feedback");

  if (!response.ok) {
    feedback.textContent = "Error al registrar. Intenta nuevamente.";
    feedback.style.color = "red";
    return;
  }

  const parsedResponse = await response.json();

  if (parsedResponse && parsedResponse.success) {
    feedback.textContent = `¡Registro exitoso, bienvenido ${usuario}!`;
    feedback.style.color = "#27ae60";
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  } else {
    feedback.textContent = "Error desconocido. Intenta nuevamente.";
    feedback.style.color = "red";
  }
}
