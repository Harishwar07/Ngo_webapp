import express from "express";
import { login } from "../controllers/auth.controller.js";
import { refreshToken } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/refresh-token", refreshToken);


export default router;
