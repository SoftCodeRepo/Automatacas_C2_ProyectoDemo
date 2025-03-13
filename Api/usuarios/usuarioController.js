import usuarioModel from "./usuarioModel.js";

export async function getUsuario(req, res) {
    const { nombre } = req.body;
    const usuario = await usuarioModel.findOne({ nombre: nombre });
    if (!usuario) {
        return res.status(404).json({
            success: false,
            message: "no se pudo obtener el usuario requerido, probablemente no exista o ha ocurrido un error con la base de datos."
        });
    }
    return res.status(200).json({
        success: true,
        message: "usuario obtenido con exito",
        usuario
    });
}

export async function postUsuario(req, res) {
    const { nombre, currentWorld, currentLevel, points, failures, lastPlayed, worldProgress } = req.body;
    const newUsuario = new usuarioModel({ nombre, currentWorld, currentLevel, points, failures, lastPlayed, worldProgress });
    await newUsuario.save();
    return res.status(201).json({
        success: true,
        message: "usuario creado con exito",
        usuario: newUsuario
    });
}

export async function putUsuario(req, res) {
    const usuario = await usuarioModel.findOne({ nombre: nombre });
    if (!usuario) {
        return res.status(404).json({
            success: false,
            message: "usuario no encontrado para modificar."
        });
    }
    Object.entries(req.body).forEach(([key, value]) => {
        if (value !== undefined) usuario[key] = value;
    });
    await usuario.save();
    return res.status(200).json({
        success: true,
        message: "usuario actualizado con exito"
    });
}