import mongoose, { Schema } from "mongoose";

const usuarioSchema = new Schema({
    nombre: {
        type: Schema.Types.String,
        required: true
    },
});

const usuarioModel = mongoose.model('usuario', usuarioSchema, 'usuarios');
export default usuarioModel;