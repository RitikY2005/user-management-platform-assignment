import {Router} from 'express';
import { loginUser, logoutUser, refreshAccessToken, registerAdmin } from '../controllers/auth-controllers.js';
import { isAuthenticated} from '../middewares/auth-middleware.js';
import { AdminRegisterSchema, LoginSchema } from '../schema/auth-schema.js';
import validateSchema from '../middewares/schema-validate-middleware.js';

const router=Router();


// /api/auth/register -> only admin , by default admin previlegae  
// /api/auth/login -> anyone can login ADMIN,USER,ORGANIZER 

router.post('/register',validateSchema(AdminRegisterSchema),registerAdmin);
router.post('/login',validateSchema(LoginSchema),loginUser);
router.post('/logout',isAuthenticated,logoutUser);
router.post('/refresh',refreshAccessToken);


export default router;