import mongoose from "mongoose";
import signale from "signale";

export async function connectToMongo() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/AutomatasJuego');
    } catch (error) {
        signale.error('la conexion con la base de datos ha fallado desde el inicio.\n---error log:---\n', error.message);
    }
}

const conn = mongoose.connection;

export const onMongoConnectionError = new Promise((resolve, reject) => {
    conn.on('error', (error) => {
        signale.error('ha ocurrido un error en la conexion con el servidor de mongo.', error);
        resolve(true);
    });
});

conn.once('open', () => {
    signale.star('conexion a mongo establecida exitosamente.');
});