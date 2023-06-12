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
// login
userRouter.post('/login', userController.login);
// logout
userRouter.post('/logout', userController.logout);
// refresh token

/*
userRouter.post('/refresh-token', userController.refreshToken);
// forgot password
userRouter.post('/forgot-password', userController.forgotPassword);
// reset password
userRouter.post('/reset-password', userController.resetPassword);
// change password
userRouter.post('/change-password', userController.changePassword);
// get user
userRouter.get('/me', userController.getMe);
// update user
userRouter.patch('/me', validateUpdateUser, userController.updateMe);
// delete user
userRouter.delete('/me', userController.deleteMe);
// upload image
userRouter.post('/upload-image', userController.uploadImage);
// get image
userRouter.get('/get-image/:id', userController.getImage);
// get all users
userRouter.get('/all', userController.getAll);
// get user by id
userRouter.get('/:id', userController.getById);
// update user by id
*/
export default userRouter;



