import {
  getValidCodeORCL,
  IData,
  insertPermitReportMonthDataORCL,
  selectPastReportsORCL,
  selectRequiredReportsORCL,
} from '../db/ClientController';

export const validateClientORCL = async (email: string) => {
  return await getValidCodeORCL(email);
};

export const getRequiredReportPermits = async (clientNum: number) => {
  return selectRequiredReportsORCL(clientNum);
};

export const getPreviousReportPermits = async (clientNum: number) => {
  return await selectPastReportsORCL(clientNum);
};
export const savePermitHarvestData = async (data: IData, clientNum: number, source: string) => {
  return await insertPermitReportMonthDataORCL(data, clientNum, source);
};
