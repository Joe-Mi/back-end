import express from 'express';
import * as promptController from "../controller/promptController.js";

import auth from '../middleware/auth.js';

const router = express.Router();

// List prompts and responses for a session.
router.get("/session/:id/prompts", auth, promptController.getPrompts);

// Add a prompt to a session.
router.post("/prompt/:id/send", auth, promptController.createPrompt);

export default router;