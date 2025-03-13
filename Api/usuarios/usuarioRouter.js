import { Router } from "express";
import { registerUsuario , loginUsuario } from "./usuarioController.js";

export const usuarioRouter = Router();

// Ruta para registrar un usuario (POST)
usuarioRouter.post("/register", async (req, res) => {
    return await registerUsuario(req, res); // Usar registerUsuario para el registro
});

usuarioRouter.post("/login", async (req, res) => {
    return await loginUsuario(req, res);
});