import { Request, Response, Router } from 'express';
import {
  gatherConfirmPermitMonthData,
  gatherPermitMonthData,
  gatherPermitMonthSelection,
  gatherPermitSelection,
  handleConfirmPermitMonthData,
  handleConfirmZeroRemainingData, handleNoMonthsLeftToReport,
  handlePermitMonthData,
  handlePermitMonthSelection,
  validateCRN,
  welcome,
} from './handler';

const ivrRouter = Router();

// POST: /ivr/welcome
ivrRouter.post('/welcome', async (req: Request, res: Response) => {
  const w = await welcome();
  res.send(w);
});

// POST: /ivr/welcome
ivrRouter.get('/test', async (req: Request, res: Response) => {
  res.send('test');
});

// POST: /ivr/validate-client
ivrRouter.post('/validate-crn', async (req: Request, res: Response) => {
  const digit = req.body.Digits;
  res.send(await validateCRN(digit, req));
});

// POST: /ivr/gather-permit-selection
ivrRouter.post('/gather-permit-selection', async (req: Request, res: Response) => {
  res.send(await gatherPermitSelection(req));
});

// POST: /ivr/gather-permit-month-selection
ivrRouter.post('/gather-permit-month-selection', async (req: Request, res: Response) => {
  res.send(await gatherPermitMonthSelection(req));
});

// POST: /ivr/gather-permit-month-dead-data
ivrRouter.post('/gather-permit-month-data', async (req: Request, res: Response) => {
  res.send(await gatherPermitMonthData(req));
});

// POST: /ivr/handle-permit-month-dead-data
ivrRouter.post('/handle-permit-month-data', async (req: Request, res: Response) => {
  res.send(await handlePermitMonthData(req));
});

// POST: /ivr/handle-permit-month-data
ivrRouter.post('/handle-permit-month-selection', async (req: Request, res: Response) => {
  res.send(await handlePermitMonthSelection(req));
});

// POST: /ivr/handle-confirm-zero-remaining-data
ivrRouter.post('/handle-confirm-zero-remaining-data', async (req: Request, res: Response) => {
  res.send(await handleConfirmZeroRemainingData(req));
});

// POST: /ivr/gather-permit-month-data
ivrRouter.post('/gather-confirm-permit-month-data', async (req: Request, res: Response) => {
  res.send(await gatherConfirmPermitMonthData(req));
});

// POST: /ivr/handle-confirm-permit-month-data
ivrRouter.post('/handle-confirm-permit-month-data', async (req: Request, res: Response) => {
  res.send(await handleConfirmPermitMonthData(req));
});

// POST: /ivr/handle-no-months-left-to-report
ivrRouter.post('/handle-no-months-left-to-report', async (req: Request, res: Response) => {
  res.send(await handleNoMonthsLeftToReport(req));
});

export { ivrRouter };
