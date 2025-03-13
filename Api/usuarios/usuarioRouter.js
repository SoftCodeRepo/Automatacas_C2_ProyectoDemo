import { Router } from "express";
import { getUsuario, postUsuario, putUsuario } from "./usuarioController.js";

export const usuarioRouter = Router();

usuarioRouter.post("", async (req, res) => {
    return await getUsuario(req, res);
});

usuarioRouter.post("/register", async(req, res) => {
    return await postUsuario(req, res);
});

usuarioRouter.put("", async (req, res) => {
    return await putUsuario(req, res); 
});