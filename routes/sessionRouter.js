import express from 'express';
import * as sessionController from "../controller/sessionController.js";

import auth from '../middleware/auth.js';

const router = express.Router();

// View account sessions.
router.get("/view/:id", auth, sessionController.getSessions);

// Create a new session.
router.post("/new/:id", auth, sessionController.createSession);

// Delete a session.
router.delete("/delete/:id", auth, sessionController.deleteSession);

// Update a sessions settings.
router.post("/update/:id", auth, sessionController.updateSession);


export default router;