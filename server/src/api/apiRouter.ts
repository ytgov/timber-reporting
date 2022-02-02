import { Request, Response, Router } from 'express';
import { getPreviousReportPermits, getRequiredReportPermits, savePermitHarvestData } from './apiHandler';
import { IData } from '../db/ClientController';
import { checkToken } from '../app';

const apiRouter = Router();

apiRouter.get('/checkToken', async (req: Request, res: Response) => {
  if (await checkToken(req, res)) {
    res.send({ status: 200 });
  } else {
    res.send({ status: 403, userMessage: 'Not Authorized!' });
  }
});

apiRouter.get('/permits/required-reports', async (req: Request, res: Response) => {
  if (await checkToken(req, res)) {
    res.send({
      status: 'OK',
      permits: await getRequiredReportPermits(res.locals.clientNum),
      clientNum: res.locals.clientNum,
    });
  } else {
    res.status(403).send('Unauthorized');
  }
});

apiRouter.get('/permits/previous-reports', async (req: Request, res: Response) => {
  if (await checkToken(req, res)) {
    let clientNum = res.locals.clientNum;
    if (clientNum > 0) {
      res.send(await getPreviousReportPermits(clientNum));
    } else {
      res.send({ status: 403 });
    }
  } else {
    res.send({ status: 403 });
  }
});

apiRouter.get('/permits/required-reports', async (req: Request, res: Response) => {
  if (await checkToken(req, res)) {
    res.send({
      status: 'OK',
      permits: await getRequiredReportPermits(res.locals.clientNum),
      clientNum: res.locals.clientNum,
    });
  } else {
    res.status(403).send('Unauthorized');
  }
});

apiRouter.post('/permits/report-harvest', async (req: Request, res: Response) => {
  if (await checkToken(req, res)) {
    const clientNum = res.locals.clientNum;
    const x = (req.body as IData[]).map((e) => {
      return savePermitHarvestData(e, clientNum, 'WEBAPP');
    });

    const y = await Promise.all(x);
    if (req.body.length === y.filter((e: any) => e === 1).length) {
      res.send({ status: 'OK' });
    } else {
      res.send({ status: 'KO' });
    }
  } else {
    res.status(403).send('Unauthorized');
  }
});

export { apiRouter };
