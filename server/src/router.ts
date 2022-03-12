import Router from 'express';
import { apiRouter } from './api/apiRouter';
import { ivrRouter } from './ivr/router';

const router = Router();

router.use('/api', apiRouter);
router.use('/ivr', ivrRouter);

export { router };
