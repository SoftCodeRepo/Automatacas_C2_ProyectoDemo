import usuarioModel from "./usuarioModel.js";

export async function registerUsuario(req, res) {
    const { nombre } = req.body;
    if (!nombre) {
        return res.status(400).json({
            success: false,
            message: "El nombre es requerido."
        });
    }
    const existingUsuario = await usuarioModel.findOne({ nombre: nombre });
    if (existingUsuario) {
        return res.status(409).json({
            success: false,
            message: "El usuario ya existe."
        });
    }
    const newUsuario = new usuarioModel({ nombre });

    try {
        await newUsuario.save();
        return res.status(201).json({
            success: true,
            message: "Usuario registrado exitosamente.",
            usuario: newUsuario
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Hubo un problema al registrar el usuario. Intenta nuevamente."
        });
    }
}

export async function loginUsuario(req, res) {
    const { nombre } = req.body;

    // Verificar si el nombre de usuario fue proporcionado
    if (!nombre) {
        return res.status(400).json({
            success: false,
            message: "El nombre de usuario es requerido."
        });
    }

    // Verificar si el usuario existe
    const existingUsuario = await usuarioModel.findOne({ nombre });
    if (!existingUsuario) {
        return res.status(404).json({
            success: false,
            message: "El usuario no existe."
        });
    }

    // Si el usuario existe, se considera un inicio de sesión exitoso
    return res.status(200).json({
        success: true,
        message: "Inicio de sesión exitoso.",
        usuario: existingUsuario
    });
}