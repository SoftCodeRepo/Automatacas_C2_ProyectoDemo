import usuarioModel from "./usuarioModel.js";
import datosModel from "./DatosModel.js";

export async function getUsuario(req, res) {
    const { nombre } = req.body;
    const usuario = await usuarioModel.findOne({ nombre: nombre });
    const datos = await datosModel.findOne({ nombreUsuario: usuario.nombre });
    if (!usuario || !datos) {
        return res.status(404).json({
            success: false,
            message: "El nombre es requerido."
        });
    }
    return res.status(200).json({
        success: true,
        message: "usuario obtenido con exito",
        usuario,
        datos
    });
}

export async function postUsuario(req, res) {
    const { nombre } = req.body;
    const newUsuario = new usuarioModel({ nombre });
    const newDatos = new datosModel({ nombreUsuario: nombre });
    await newDatos.save();
    await newUsuario.save();
    return res.status(201).json({
        success: true,
        message: "usuario creado con exito",
        usuario: newUsuario
    });
}

export async function putDatos(req, res) {
    try {
        const args = req.body.args;
        const nombre = req.body.nombre;
        
        if (!nombre) {
            return res.status(400).json({
                success: false,
                message: "Datos incompletos."
            });
        }

        const datos = await datosModel.findOne({ nombreUsuario: nombre });
        if (!datos) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado."
            });
        }

        Object.keys(args).forEach((key) => {
            if (key !== "_id") { // Evita sobrescribir el ID
                datos[key] = args[key] !== undefined ? args[key] : datos[key];
            }
        });

        await datos.save();

        return res.status(200).json({
            success: true,
            message: "Datos actualizados",
            data: datos
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor.",
            error: error.message
        });
    }
}
