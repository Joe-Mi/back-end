import express from 'express';
import * as userController from "../controller/userController.js";
import * as authController from "../controller/authController.js";

import auth from '../middleware/auth.js';

const router = express.Router();

router.post("/login", authController.User_auth);

// Register an account.
router.post("/signIn", userController.User_register);

// Delete an account.
router.delete("/account/:id/delete", userController.User_delete_account);

// Update an account.
router.post("/account/:id/update", auth, userController.User_update_account);

export default router;
