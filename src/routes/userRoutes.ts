import express from 'express';
import {UserController} from '../controllers/user/userController';
import {validateCreateUser, validateUpdateUser} from "../validators/userValidator";

const userRouter = express.Router();
const userController = new UserController();

// Define routes for CRUD operations

userRouter.post('/', validateCreateUser , userController.create);
//userRouter.get('/:id', userController.read);
//userRouter.get('/', userController.read);
//userRouter.patch('/:id', validateUpdateUser, userController.update);
//userRouter.delete('/:id', userController.delete);

export default userRouter;



