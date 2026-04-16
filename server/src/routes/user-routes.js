import { Router } from "express";
import {isAuthenticated} from '../middewares/auth-middleware.js';
import { getMe, updateMe } from "../controllers/user-controller.js";
import validateSchema from "../middewares/schema-validate-middleware.js";
import { updateMeSchema } from "../schema/user-schema.js";

const router=Router();

// self routes


router.get('/me',isAuthenticated,getMe);
router.put('/me/update',isAuthenticated,validateSchema(updateMeSchema),updateMe);

export default router;