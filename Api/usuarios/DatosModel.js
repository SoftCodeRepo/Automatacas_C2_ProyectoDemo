import mongoose, { Schema } from "mongoose";

const WorldProgressSchema = new Schema({
    vocals: Schema.Types.Boolean,
    consonants: Schema.Types.Boolean,
    tildes: Schema.Types.Boolean
});

const datosSchema = new Schema({    
    nombreUsuario: {
        type: Schema.Types.String
    },
    currentWorld: {
        type: Schema.Types.String
    },
    currentLevel: {
        type: Schema.Types.Number
    },
    points: {
        type: Schema.Types.Number
    },
    failures: {
        type: Schema.Types.Number
    },
    lastPlayed: {
        type: Schema.Types.Date
    },
    worldProgress: {
        type: WorldProgressSchema
    }
});

const datosModel = mongoose.model('datos', datosSchema, 'datos');
export default datosModel;