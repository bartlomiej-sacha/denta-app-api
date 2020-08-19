import express from 'express';
import usersRouter from './users';
import doctorsRouter from './doctors';
import newsRouter from './news';

const apiRouter = express.Router();

apiRouter.use('/users', usersRouter)
apiRouter.use('/doctors', doctorsRouter)
apiRouter.use('/news', newsRouter)

export default apiRouter;