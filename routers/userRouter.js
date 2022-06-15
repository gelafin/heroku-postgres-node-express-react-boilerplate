import express from 'express';

import { asyncHandler, ErrorResponse } from './routerUtils/responseUtils.js';
import { getAllUsers, insertToUsers, updateUsers, deleteFromUsers } from '../database/users.js';

const userRouter = express.Router();

// returns data for all users
userRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    try {
      const tableData = await getAllUsers();
      res.send(tableData);
    } catch (error) {
      console.log('error getting user data with these GET headers:', req?.headers);
      console.error(error);
      throw new ErrorResponse('could not get user data');
    }
  })
);

// inserts a user with any favorites
userRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    try {
      const { userData } = req?.body;
      await insertToUsers(userData);
      res.sendStatus(200);
    } catch (error) {
      console.log('error inserting user with this userData:', req?.body?.userData);
      console.error(error);

      // notify devs if storage exceeded
      if (error.name === 'DbStorageLimitError') {
        console.error('Db storage limit exceeded');
      }

      // notify client
      throw new ErrorResponse(error.message);
    }
  })
);

// updates a user
userRouter.put(
  '/',
  asyncHandler(async (req, res) => {
    try {
      const { userData } = req?.body;
      await updateUsers(userData);
      res.sendStatus(200);
    } catch (error) {
      console.log('error updating user with this userData:', req?.body?.userData);
      console.error(error);
      throw new ErrorResponse('could not update user');
    }
  })
);

// deletes a user
userRouter.delete(
  '/:userId',
  asyncHandler(async (req, res) => {
    try {
      await deleteFromUsers(req?.params?.userId);
      res.sendStatus(200);
    } catch (error) {
      console.log('error deleting user with this userData:', req?.body?.userIdToDelete);
      console.error(error);
      throw new ErrorResponse('could not delete user');
    }
  })
);

export default userRouter;
