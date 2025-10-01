// Obtener el mensaje de error y el formulario
const mensajeError = document.getElementsByClassName("error")[0];
const form = document.getElementById("login_form");

// Inicializar el mensaje de error como escondido
mensajeError.classList.add("escondido");

// Evento de envío del formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const elems = form.elements;
  const payload = {
    tipo_documento: elems["tipo-documento"].value,
    num_documento: elems["num-documento"].value,
    password: elems["password"].value,
  };

  // Validación de campos vacíos
  if (!payload.tipo_documento || !payload.num_documento || !payload.password) {
    mensajeError.textContent = "Por favor, completa todos los campos.";
    mensajeError.classList.remove("escondido");
    return;
  }

  try {
    // Realizar la solicitud POST al backend
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    // Si hay un error en la respuesta del backend
    if (!res.ok) {
      mensajeError.textContent = data.message || "Error al iniciar sesión.";
      mensajeError.classList.remove("escondido");
      return;
    }

    // Si la autenticación es exitosa, guardar el token
    localStorage.setItem("token", data.token);

    // Redirigir al área admin u otra página indicada por el backend
    window.location.href = data.redirect || "/";
  } catch (err) {
    console.error("Error en fetch:", err);
    mensajeError.textContent = "No se pudo conectar al servidor.";
    mensajeError.classList.remove("escondido");
  }
});
