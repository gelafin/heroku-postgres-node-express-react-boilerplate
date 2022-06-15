import express from 'express';

import userRouter from './userRouter.js';
// import other routers here

const baseRouter = express.Router();

baseRouter.use('/users', userRouter);
// define other routers here

// if none of the above were triggered, there was a server-side syntax error
baseRouter.use((err, req, res, next) => {
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send(err.message);
});

export default baseRouter;
