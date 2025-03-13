import express from "express";
import cors from "cors";
import helmet from "helmet";
import signale from "signale";
import http from "http";
import { onMongoConnectionError, connectToMongo } from "./database/mongo.js";
import { usuarioRouter } from "./usuarios/usuarioRouter.js";

const app = express();

app.use(express.json());
app.use(cors({
    origin: '*'
}));
app.use(helmet());
app.use("/usuarios", usuarioRouter);

const server = http.createServer(app);

const PORT = 9000;

(async () => {
    connectToMongo().then(() => {
        server.listen(PORT, () => {
            signale.success("servidor inicializado en el servidor: http://localhost:" + PORT);
        });
    });
    onMongoConnectionError.then(() => {
        server.close(() => {
            signale.info('cerrando el servidor.');
        });
    });
})();