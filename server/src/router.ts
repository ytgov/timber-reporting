import Router from 'express';
import { apiRouter } from './api/apiRouter';

const router = Router();

router.use('/api', apiRouter);

export { router };
