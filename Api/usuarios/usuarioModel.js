import mongoose, { Schema } from "mongoose";

const usuarioSchema = new Schema({
    nombre: {
        type: Schema.Types.String,
        required: true
    },
    currentWorld: {
        type: Schema.Types.String,
        required: true
    },
    currentLevel: {
        type: Schema.Types.Number,
        required: true
    },
    points: {
        type: Schema.Types.Number,
        required: true
    },
    failures: {
        type: Schema.Types.Number,
        required: true
    },
    lastPlayed: {
        type: Schema.Types.Date,
        required: true
    },
    worldProgress: {
        type: [Schema.Types.String],
        required: true
    }
});

const usuarioModel = mongoose.model('usuario', usuarioSchema, 'usuarios');
export default usuarioModel;