import express from "express";
import cors from "cors";
import helmet from "helmet";
import signale from "signale";
import http from "http";
import { onMongoConnectionError, connectToMongo } from "./database/mongo";

const app = express();

app.use(cors({
    origin: '*'
}));
app.use(helmet());
app.use(express.json());

const server = http.createServer(app);

const PORT = 9000;

(async () => {
    await connectToMongo().then(() => {
        server.listen(PORT, () => {
            signale.success("servidor inicializado en el servidor: http://localhost:" + PORT);
        });
    });
    await onMongoConnectionError.then(() => {
        server.close(() => {
            signale.info('cerrando el servidor.');
        });
    });
})();