import { Router } from "express";
import {isAuthenticated, restrictRoles} from '../middewares/auth-middleware.js';
import { createUser, deleteUser, getMe, getUser, getUsers, updateMe, updateUser } from "../controllers/user-controller.js";
import validateSchema from "../middewares/schema-validate-middleware.js";
import { createUserSchema, deleteUserSchema, getUserSchema, getUsersSchema, updateMeSchema, updateUserSchema } from "../schema/user-schema.js";

const router=Router();

// self routes


router.get('/me',isAuthenticated,getMe);
router.put('/me/update',isAuthenticated,validateSchema(updateMeSchema),updateMe);

router.get(
  "/",
  isAuthenticated,
  restrictRoles("ADMIN", "MANAGER"),
  validateSchema(getUsersSchema),
  getUsers
);

router.get(
  "/:userId",
  isAuthenticated,
  validateSchema(getUserSchema),
  restrictRoles("ADMIN", "MANAGER"),
  getUser
);

router.post(
  "/",
  isAuthenticated,
  restrictRoles("ADMIN"),
  validateSchema(createUserSchema),
  createUser
);

router.put(
  "/:userId",
  isAuthenticated,
  restrictRoles("ADMIN", "MANAGER"),
  validateSchema(updateUserSchema),
  updateUser
);

router.delete(
  "/:userId",
  isAuthenticated,
  validateSchema(deleteUserSchema),
  restrictRoles("ADMIN"),
  deleteUser
);

export default router;