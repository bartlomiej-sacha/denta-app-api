import express from 'express';
import usersRouter from './users';
import doctorsRouter from './doctors';

const apiRouter = express.Router();

apiRouter.use('/users', usersRouter)
apiRouter.use('/doctors', doctorsRouter)

export default apiRouter;