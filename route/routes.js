import express from 'express';
import userController from '../controller/userController.js';
import  middleware  from '../service/bcryptService.js';
import { createNewGroupController, getCreatedGroupController, getAllCreatedGroupController,
addMemberIntoGroupController, deleteGroupController, removeMemberIntoGroupController, upadateGroupNameController , getNonExistingUsersIntoGroupController} from '../controller/groupController.js';
import { sendGroupMessage, likeGroupMessageByUser, getAllMessagesByGroupId } from '../controller/messageController.js';
const router = express.Router();

router.post('/login', userController.login);
router.post('/logout', middleware.logout);
router.post('/register',middleware.isAuthenticatedAdmin, userController.registration);
router.post('/edit-user',middleware.isAuthenticatedAdmin, userController.updateExistingUser);

router.post('/create-group', middleware.isLoginAuthenticated, createNewGroupController);
router.put('/change-group-name', middleware.isLoginAuthenticated, upadateGroupNameController);
router.post('/add-member', middleware.isLoginAuthenticated, addMemberIntoGroupController);
router.get('/get-all-groups/:group_name?', middleware.isLoginAuthenticated, getAllCreatedGroupController);
router.get('/get-group/:gid', middleware.isLoginAuthenticated, getCreatedGroupController);
router.get('/get-non-group-members/:gid', middleware.isLoginAuthenticated, getNonExistingUsersIntoGroupController);
router.post('/remove-member', middleware.isLoginAuthenticated, removeMemberIntoGroupController);
router.delete('/delete-group/:gid', middleware.isLoginAuthenticated, deleteGroupController);

router.post('/send-grpmessage', middleware.isLoginAuthenticated, sendGroupMessage);
router.post('/like-grpmessage', middleware.isLoginAuthenticated, likeGroupMessageByUser);
router.get('/get-all-messages/:gid', middleware.isLoginAuthenticated, getAllMessagesByGroupId);


export default router;