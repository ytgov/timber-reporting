import VoiceResponse = require('twilio/lib/twiml/VoiceResponse');
import { Request } from 'express';
import { SayLanguage, SayVoice } from 'twilio/lib/twiml/VoiceResponse';
import {
  IPermit,
  IPermitReportMonthData,
  IData,
  getValidReportsORCL,
  selectRequiredReportsRegistrationNumberORCL,
  IMonthReportData,
  insertPermitReportMonthDataORCL,
  IMonthReport,
  insertMultiplePermitReportMonthDataORCL,
} from '../db/ClientController';

const months = [
  { name: 'January 2019', number: 1 },
  { name: 'February 2019', number: 2 },
  { name: 'March 2019', number: 3 },
  { name: 'April 2019', number: 4 },
  { name: 'May 2019', number: 5 },
  { name: 'June 2019', number: 6 },
  { name: 'July 2019', number: 7 },
  { name: 'August 2019', number: 8 },
  { name: 'September 2019', number: 9 },
  { name: 'October 2019', number: 10 },
  { name: 'November 2019', number: 11 },
  { name: 'December 2019', number: 12 },
  { name: 'January 2020', number: 13 },
  { name: 'February 2020', number: 14 },
  { name: 'March 2020', number: 15 },
  { name: 'April 2020', number: 16 },
  { name: 'May 2020', number: 17 },
  { name: 'June 2020', number: 18 },
  { name: 'July 2020', number: 19 },
  { name: 'August 2020', number: 20 },
  { name: 'September 2020', number: 21 },
  { name: 'October 2020', number: 22 },
  { name: 'November 2020', number: 23 },
  { name: 'December 2020', number: 24 },
  { name: 'January 2021', number: 25 },
  { name: 'February 2021', number: 26 },
  { name: 'March 2021', number: 27 },
  { name: 'April 2021', number: 28 },
  { name: 'May 2021', number: 29 },
  { name: 'June 2021', number: 30 },
  { name: 'July 2021', number: 31 },
  { name: 'August 2021', number: 32 },
  { name: 'September 2021', number: 33 },
  { name: 'October 2021', number: 34 },
  { name: 'November 2021', number: 35 },
  { name: 'December 2021', number: 36 },
];

const monthMap = new Map();
months.forEach((val) => monthMap.set(val.number, val.name));

const talkablePermitNum = (permitNum: string) => permitNum.split('').join(',').replace('-', ' dash ');

export const defaultVoiceAttributes: { voice: SayVoice; language: SayLanguage } = {
  voice: 'alice',
  language: 'en-CA',
};

export const welcome = async () => {
  const voiceResponse = new VoiceResponse();

  const gather = voiceResponse.gather({
    action: '/ivr/validate-crn',
    timeout: 10,
    finishOnKey: '#',
    method: 'POST',
    actionOnEmptyResult: true,
  });
  gather.say(
    { ...defaultVoiceAttributes },
    `Welcome to the Yukon Government’s Timber harvest volume reporting phone service. Use this service to report the volume in cubic metres of commercial timber or firewood harvest.Please enter your corporate registry number followed by the pound key.`
  );
  gather.pause();
  gather.pause();
  gather.say(
    { ...defaultVoiceAttributes },
    `Welcome to the Yukon Government’s Timber harvest volume reporting phone service. Use this service to report the volume in cubic metres of commercial timber or firewood harvest.Please enter your corporate registry number followed by the pound key.`
  );
  return voiceResponse.toString();
};

export const validateCRN = async (digit: any, req: Request) => {
  console.log(`Validate Registration -  Number: ${digit}`);
  const validClient = await getValidReportsORCL(digit);
  console.log(`Result ${validClient}`);
  console.log('request.session: ', req.session);
  (req.session as any).regNum = digit;
  (req.session as any).clientNum = validClient;
  console.log('set reg num');
  return validClient ? redirectPermitSelection() : redirectWelcome();
};

export const gatherPermitSelection = async (req: Request) => {
  console.log('--gatherPermitSelection-------------------------------------------------------');
  console.log(req.session);
  console.log('------------------------------------------------------------------------------');
  const voiceResponse = new VoiceResponse();

  let permitSelections: any[] = [];
  if (!(req.session as any).dataRetrieved) {
    permitSelections = await selectRequiredReportsRegistrationNumberORCL((req.session as any).regNum);
    (req.session as any).permitSelections = permitSelections;
    (req.session as any).dataRetrieved = true;
  } else {
    permitSelections = (req.session as any).permitSelections;
  }

  if (permitSelections.length === 0) {
    return endTextEndCall();
  } else {
    const gather = voiceResponse.gather({
      action: '/ivr/gather-permit-month-selection',
      finishOnKey: '#',
      method: 'POST',
      actionOnEmptyResult: true,
    });

    gather.say(
      { ...defaultVoiceAttributes },
      `You have ${permitSelections.length} permits that require reporting. ` +
        permitSelections.map(
          (p, index) =>
            `Press ${index + 1} followed by the pound key to report on permit ${talkablePermitNum(p.permitNum)} `
        )
    );
    gather.pause();
    gather.pause();

    return voiceResponse.toString();
  }
};

export const gatherPermitMonthSelection = async (req: Request) => {
  console.log('--gatherPermitMonthSelection-------------------------------------------------------');
  console.log(req.session);
  console.log('------------------------------------------------------------------------------');
  const digits = req.body.Digits;

  let permitSelection: IPermit | undefined = undefined;

  const permitSelections = (req.session as any).permitSelections as IPermit[];
  if (digits && digits > 0 && digits <= permitSelections.length) {
    permitSelection = permitSelections[digits - 1];
    (req.session as any).permit = permitSelection;
  } else {
    permitSelection = (req.session as any).permit;
  }

  if (permitSelection) {
    const voiceResponse = new VoiceResponse();
    const monthSelections: IMonthReport[] = permitSelection.data;
    (req.session as any).permitMonthSelections = monthSelections;

    if (monthSelections.length > 0) {
      const gather = voiceResponse.gather({
        action: '/ivr/handle-permit-month-selection',
        finishOnKey: '#',
        method: 'POST',
        actionOnEmptyResult: true,
      });

      gather.say(
        { ...defaultVoiceAttributes },
        `You have ${monthSelections.length} months that require reporting. Please select option followed by the pound key. You can press 9 9 to report 0 for all outstanding months. ` +
          monthSelections.map((p, index) => `Press ${index + 1} to report on ${p.month} `)
      );

      return voiceResponse.toString();
    } else {
      (req.session as any).permitSelections = (req.session as any).permitSelections.filter(
        (p: IPermit) => p.permitId !== permitSelection!.permitId
      );
      return redirectPermitSelection(
        `You have no months that require reporting on permit ${talkablePermitNum(permitSelection.permitNum)}`
      );
    }
  } else {
    return redirectPermitSelection();
  }
};

export const handlePermitMonthSelection = async (req: Request) => {
  console.log('--handlePermitMonthSelection-------------------------------------------------------');
  console.log('--Digits--' + req.body.Digits);
  console.log(req.session);
  console.log('------------------------------------------------------------------------------');

  const digits = req.body.Digits;

  const permitMonthSelections = (req.session as any).permitMonthSelections as IMonthReport[];

  let permitMonth: IMonthReport | undefined = undefined;
  if (digits) {
    if (digits === '99') {
      return gatherConfirmZeroRemainingData(req);
    }
    if (digits > 0 && digits <= permitMonthSelections.length) {
      permitMonth = permitMonthSelections[digits - 1];
    }
  } else {
    permitMonth = (req.session as any).permitMonth;
  }
  if (permitMonth) {
    (req.session as any).permitMonth = permitMonth;
    const productToReport = permitMonth.data.find((m) => !m.quantity);
    if (productToReport) {
      (req.session as any).permitReportId = productToReport.permitReportId;
      return gatherPermitMonthData(req);
    } else {
      const voiceResponse = new VoiceResponse();
      voiceResponse.redirect('/ivr/gather-confirm-permit-month-data');

      return voiceResponse.toString();
    }
  } else {
    return redirectGatherPermitMonthSelection();
  }
};

export const gatherConfirmZeroRemainingData = async (req: Request) => {
  console.log('--gatherConfirmZeroRemainingData------------------------------------------------');
  console.log(req.session);
  console.log('------------------------------------------------------------------------------');

  const voiceResponse = new VoiceResponse();

  const gather = voiceResponse.gather({
    action: '/ivr/handle-confirm-zero-remaining-data',
    finishOnKey: '#',
    method: 'POST',
    actionOnEmptyResult: true,
  });

  const permitMonthSelections = (req.session as any).permitMonthSelections as IMonthReport[];
  const zeroMonths = permitMonthSelections.map((e) => e.month).join(', ');

  gather.say(
    { ...defaultVoiceAttributes },
    `You will enter 0 for ${zeroMonths} if this is correct please press 1 to save or press 2 to cancel.`
  );

  return voiceResponse.toString();
};

export const handleConfirmZeroRemainingData = async (req: Request) => {
  console.log('--handleConfirmZeroRemainingData------------------------------------------------');
  console.log(req.session);
  console.log('------------------------------------------------------------------------------');

  const digits = req.body.Digits;
  const clientNum = (req.session as any).clientNum;

  if (digits === '1' && clientNum) {
    const permitMonthSelections = (req.session as any).permitMonthSelections as IMonthReport[];

    const dateToInsert = permitMonthSelections.flatMap((e) => {
      return e.data.map((f) => {
        return { ...f, quantity: '0' };
      });
    });
    await insertMultiplePermitReportMonthDataORCL(dateToInsert, clientNum, 'PHONE');

    (req.session as any).permitSelections = (req.session as any).permitSelections.filter(
      (p: IPermit) => p.permitId !== (req.session as any).permit.permitId
    );
    return redirectPermitSelection('Entry saved');
  } else {
    return redirectGatherPermitMonthSelection();
  }
};

export const gatherPermitMonthData = async (req: Request) => {
  console.log('--gatherPermitMonthData-------------------------------------------------------');
  console.log(req.session);
  console.log('------------------------------------------------------------------------------');

  const permitMonth = (req.session as any).permitMonth as IMonthReport;
  const permitReportId = (req.session as any).permitReportId;
  const permitToReport = permitMonth.data.find((e) => e.permitReportId === permitReportId);

  if (permitMonth && permitToReport) {
    const voiceResponse = new VoiceResponse();
    const gather = voiceResponse.gather({
      action: '/ivr/handle-permit-month-data',
      finishOnKey: '#',
      method: 'POST',
      actionOnEmptyResult: true,
    });

    console.log('PERMIT MONTH: ', permitMonth.month, permitToReport.month);

    gather.say(
      { ...defaultVoiceAttributes },
      `Please enter the cubic meters harvested of ${permitToReport.productType} for ${permitMonth.month} followed by the pound key. Use the star key as a decimal place.`
    );
    gather.pause();
    gather.pause();

    return voiceResponse.toString();
  }
};

export const handlePermitMonthData = async (req: Request) => {
  console.log('--handlePermitMonthData------------------------------------------------');
  console.log(req.session);
  console.log('------------------------------------------------------------------------------');

  const digits = req.body.Digits.replace('*', '.');
  if (!digits) {
    const voiceResponse = new VoiceResponse();
    voiceResponse.redirect('/ivr/gather-permit-month-data');

    return voiceResponse.toString();
  }
  const permitMonth = (req.session as any).permitMonth as IMonthReport;
  const permitReportId = (req.session as any).permitReportId;
  const newData = {
    ...permitMonth.data.find((e) => e.permitReportId === permitReportId),
    quantity: digits,
  } as IMonthReportData;
  const data = [...permitMonth.data.filter((e) => e.permitReportId !== permitReportId), newData];

  (req.session as any).permitMonth = {
    ...permitMonth,
    data: data,
  } as IMonthReport;

  const voiceResponse = new VoiceResponse();
  voiceResponse.redirect('/ivr/handle-permit-month-selection');

  return voiceResponse.toString();
};

export const gatherConfirmPermitMonthData = async (req: Request) => {
  console.log('--gatherConfirmPermitMonthData------------------------------------------------');
  console.log(req.session);
  console.log('------------------------------------------------------------------------------');

  const voiceResponse = new VoiceResponse();

  const data = (req.session as any).permitMonth as IMonthReport;
  const gather = voiceResponse.gather({
    action: '/ivr/handle-confirm-permit-month-data',
    finishOnKey: '#',
    method: 'POST',
    actionOnEmptyResult: true,
  });

  const quantities = data.data.map((e) => `${e.quantity} cubic meters of ${e.productType}`).join(' , ');

  gather.say(
    { ...defaultVoiceAttributes },
    `You entered ${quantities} if this is correct please press 1 to save or press 2 to reenter.`
  );

  return voiceResponse.toString();
};

export const handleConfirmPermitMonthData = async (req: Request) => {
  console.log('--handleConfirmPermitMonthData------------------------------------------------');
  console.log(req.session);
  console.log('------------------------------------------------------------------------------');

  const digits = req.body.Digits;

  if (digits === '1') {
    const permitMonth = (req.session as any).permitMonth as IMonthReport;
    const clientNum = (req.session as any).clientNum;
    const x = permitMonth.data.map((e) => {
      insertPermitReportMonthDataORCL(e, clientNum, 'PHONE');
    });

    await x;
    // (req.session as any).permit = (req.session as any).permit.data.filter((d: IMonthReport) => d.month !== permitMonth.month);
    (req.session as any).permit = {
      ...(req.session as any).permit,
      data: (req.session as any).permit.data.filter((month: IMonthReport) => month.month !== permitMonth.month),
    };
    (req.session as any).permitMonth = undefined;
    return redirectGatherPermitMonthSelection('Entry saved');
  } else {
    const permitMonth = (req.session as any).permitMonth as IMonthReport;
    const newData: IMonthReportData[] = permitMonth.data.map((e: IData) => ({ ...e, quantity: null })) as any[];

    (req.session as any).permitMonth = {
      ...permitMonth,
      data: newData,
    } as IMonthReport;
    (req.session as any).permitReportId =
      newData.length > 0 ? newData[0].permitReportId : (req.session as any).permitReportId;

    const twiml = new VoiceResponse();
    twiml.redirect('/ivr/gather-permit-month-data');
    return twiml.toString();
  }
};

export const handleNoMonthsLeftToReport = async (req: Request) => {
  console.log('--handleNoMonthsLeftToReport------------------------------------------------');
  console.log(req.session);
  console.log('------------------------------------------------------------------------------');

  const twiml = new VoiceResponse();
  twiml.say(
    defaultVoiceAttributes,
    'Thank you for reporting. You will be invoiced for the outstanding stumpage. For questions about reporting the amount of timber harvested, contact the Forest Management Branch at 867-456-3999, toll free in Yukon 1-800-661-0408, extension 3 9 9 9. Collection of this information is authorized under the authority of section 22(1)(h) and 24(1)(i) of the Forest Resources Act and section 15(a) & (c)(i) of the Access to Information and Protection of Privacy Act and will be used to fulfill reporting obligations under the Forest Resources Act and Regulations.'
  );
  twiml.hangup();
  return twiml.toString();
};

const endTextEndCall = () => {
  const twiml = new VoiceResponse();
  twiml.redirect('/ivr/handle-no-months-left-to-report');
  return twiml.toString();
};

const redirectGatherPermitMonthSelection = (redirectMessage?: string) => {
  const twiml = new VoiceResponse();

  if (redirectMessage) {
    twiml.say(defaultVoiceAttributes, redirectMessage);
  }
  twiml.redirect('/ivr/gather-permit-month-selection');

  return twiml.toString();
};

const redirectPermitSelection = (redirectMessage?: string) => {
  const twiml = new VoiceResponse();
  if (redirectMessage) {
    twiml.say(defaultVoiceAttributes, redirectMessage);
  }
  twiml.redirect('/ivr/gather-permit-selection');

  return twiml.toString();
};

const redirectWelcome = () => {
  const twiml = new VoiceResponse();

  twiml.say(defaultVoiceAttributes, 'Invalid Registration Number, please check your number and try again.');

  twiml.redirect('/ivr/welcome');

  return twiml.toString();
};
