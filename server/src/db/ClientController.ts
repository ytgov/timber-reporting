import oracledb from 'oracledb';

export interface IPermit {
  permitId: string;
  permitNum: string;
  data: IMonthReport[];
}

export interface IMonthReport {
  month: string;
  data: IMonthReportData[];
}

export interface IMonthReportData {
  permitNum: string;
  reportedDate: string;
  rate: string;
  productType: string;
  month: string;
  quantity: string;
  permitReportId: string;
  permitProductId: string;
  permitScheduleId: string;
}

export interface IData {
  reportedDate: string;
  rate: string;
  productType: string;
  quantity: string;
  permitReportId: string;
  permitProductId: string;
  permitScheduleId: string;
}

export interface IPermitReportMonthData {
  customerName: string;
  permitId: string;
  permitNum: string;
  month: string;
  monthSelection: string;
  thp: string;
  operatingUnit: string;
  blockNumber: string;
  data: IData[];
}

export const dbCheck = async (): Promise<boolean> => {
  let connection: any;
  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      connectString: process.env.DB_CONNECT,
    });
    let sql = 'SELECT sysdate FROM dual';
    let options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
    };
    const result = await connection.execute(sql, [], options);

    return result.rows.length > 0;
  } catch (e) {
    return false;
  } finally {
    if (connection) {
      try {
        await connection.close(); // always release the connection back to the pool
      } catch (err) {
        console.error(err);
      }
    }
  }
};

export const selectRequiredReportsORCL = async (clientNum: number) => {
  let connection: any;
  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      connectString: process.env.DB_CONNECT,
    });

    let sql =
      'SELECT distinct TEN_APPL_COMMERCIAL_ID, TEN_PERMIT_SCHEDULE_ID from fmb.harvest_reports_due_vw where ten_applicant_id = :1 order by  TEN_PERMIT_SCHEDULE_ID';
    let binds = [clientNum];
    let options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
      // resultSet: true
      // extendedMetaData: true,               // get extra metadata
      // prefetchRows:     100,                // internal buffer allocation size for tuning
      fetchArraySize: 100, // internal buffer allocation size for tuning
      maxRows: 200,
    };
    const result = await connection.execute(sql, binds, options);
    const x = result.rows.map(async (e: any, i: number) => {
      const innerSQL =
        'SELECT * from fmb.harvest_reports_due_vw where ten_appl_commercial_id = :1 and ten_permit_schedule_id = :2 and ten_applicant_id = :3';
      let binds = [e.TEN_APPL_COMMERCIAL_ID, e.TEN_PERMIT_SCHEDULE_ID, clientNum];

      const retInner = await connection.execute(innerSQL, binds, options);

      const data = retInner.rows.map((f: any) => {
        return {
          rate: f.RATE,
          productType: f.PRODUCT + ' ' + f.TIMBER_TYPE + ' ' + f.REMAINING_VOLUME + ' m\u00B3 remaining',
          // quantity: f.VOLUME || 0,
          quantity: f.VOLUME,
          permitReportId: f.TEN_PERMIT_SCHED_PROD_ID,
          permitProductId: f.TEN_PERMIT_PRODUCT_ID,
          permitScheduleId: f.TEN_PERMIT_SCHEDULE_ID,
          remainingVolume: f.REMAINING_VOLUME,
        };
      });

      const y = {
        customerName: retInner.rows[0].BUSINESS_NAME,
        permitId: retInner.rows[0].TEN_CUTTING_PERMIT_ID,
        permitNum: retInner.rows[0].PERMIT_NUMBER,
        month: retInner.rows[0].PERIOD,
        monthSelection: (i + 1).toString(),
        thp: retInner.rows[0].PLANNING_AREA_DESC,
        operatingUnit: retInner.rows[0].OPERATING_UNIT_DESC,
        blockNumber: retInner.rows[0].BLOCK_NUMBER,
        data: data,
      };
      return y as IPermitReportMonthData;
    });
    return await Promise.all(x);
  } catch (error) {
    console.log(error);
    return [] as IPermitReportMonthData[];
  } finally {
    if (connection) {
      try {
        await connection.close(); // always release the connection back to the pool
      } catch (err) {
        console.error(err);
      }
    }
  }
};

export const selectPastReportsORCL = async (clientNum: number) => {
  let connection: any;
  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      connectString: process.env.DB_CONNECT,
    });

    let sql =
      'SELECT distinct TEN_APPL_COMMERCIAL_ID, TEN_PERMIT_SCHEDULE_ID from fmb.harvest_reports_submitted_vw where ten_applicant_id = :1 order by  TEN_PERMIT_SCHEDULE_ID';
    let binds = [clientNum];
    let options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
      fetchArraySize: 100, // internal buffer allocation size for tuning
      maxRows: 200,
    };
    const result = await connection.execute(sql, binds, options);
    const x = result.rows.map(async (e: any, i: number) => {
      const innerSQL =
        'SELECT * from fmb.harvest_reports_submitted_vw where ten_appl_commercial_id = :1 and ten_permit_schedule_id = :2 and ten_applicant_id = :3 order by ten_permit_product_id]';
      let binds = [e.TEN_APPL_COMMERCIAL_ID, e.TEN_PERMIT_SCHEDULE_ID, clientNum];

      const retInner = await connection.execute(innerSQL, binds, options);

      const data = retInner.rows.map((f: any) => {
        return {
          reportedDate: f.REPORT_SUBMITTED_DATE,
          rate: f.RATE,
          productType: f.PRODUCT + ' ' + f.TIMBER_TYPE,
          quantity: f.VOLUME,
          permitReportId: f.TEN_PERMIT_SCHED_PROD_ID,
          permitProductId: f.TEN_PERMIT_PRODUCT_ID,
          permitScheduleId: f.TEN_PERMIT_SCHEDULE_ID,
        };
      });

      const y = {
        customerName: retInner.rows[0].BUSINESS_NAME,
        permitId: retInner.rows[0].TEN_CUTTING_PERMIT_ID,
        permitNum: retInner.rows[0].PERMIT_NUMBER,
        month: retInner.rows[0].PERIOD,
        monthSelection: (i + 1).toString(),
        thp: retInner.rows[0].PLANNING_AREA_DESC,
        operatingUnit: retInner.rows[0].OPERATING_UNIT_DESC,
        blockNumber: retInner.rows[0].BLOCK_NUMBER,
        data: data,
      };
      return y as IPermitReportMonthData;
    });
    return await Promise.all(x);
  } catch (error) {
    console.log(error);
    return [] as IPermitReportMonthData[];
  } finally {
    if (connection) {
      try {
        await connection.close(); // always release the connection back to the pool
      } catch (err) {
        console.error(err);
      }
    }
  }
};

export const insertPermitReportMonthDataORCL = async (data: any, clientNum: number, source: string) => {
  let connection: any;
  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      connectString: process.env.DB_CONNECT,
    });
    let sql =
      'MERGE into FMB.TEN_PERMIT_SCHED_PROD_STAGE t1 ' +
      'using (SELECT :1 a,:2 b, :3 c , :4 d, :5 e, :6 f from dual) t2 ' +
      'on (t1.TEN_PERMIT_SCHED_PROD_ID = t2.a) ' +
      'when matched then ' +
      '  UPDATE set t1.VOLUME = t2.b, t1.TEN_PERMIT_PRODUCT_ID = t2.c, t1.TEN_PERMIT_SCHEDULE_ID = t2.d, t1.REC_LAST_MOD_DATE=sysdate, ' +
      "             t1.STATUS = 'PENDING', t1.REC_LAST_MOD_USER=:5, t1.SOURCE = t2.f " +
      'when not matched then ' +
      '  INSERT (TEN_PERMIT_SCHED_PROD_ID, VOLUME, STATUS, REC_CREATE_DATE, REC_CREATE_USER, TEN_PERMIT_PRODUCT_ID,TEN_PERMIT_SCHEDULE_ID,SOURCE) ' +
      "               values(:1,:2,'PENDING', sysdate, :5,:3,:4,:6)";

    let binds = [
      data.permitReportId,
      data.quantity.toString(),
      data.permitProductId,
      data.permitScheduleId,
      clientNum,
      source,
    ];
    let options = {
      //outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
      //resultSet: true
      // extendedMetaData: true,               // get extra metadata
      // prefetchRows:     100,                // internal buffer allocation size for tuning
      //fetchArraySize:   100,               // internal buffer allocation size for tuning
      // maxRows:          200,
      // autocommit:          true
    };
    await connection.execute(sql, binds, options);
    await connection.commit();
    return 1;
  } catch (error) {
    console.error(error);
    return 0;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

export const getValidCodeORCL = async (email: string) => {
  let connection: any;
  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      connectString: process.env.DB_CONNECT,
    });
    const result = await connection.execute(`begin :p3 := fmb.app_sec_pkg.valid_user(:p1);end;`, {
      p1: email,
      p3: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    });
    return result.outBinds.p3;
  } catch (error) {
    console.error(error);
    return 0;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

export const getValidReportsORCL = async (corporateRegistrationNumber: number) => {
  let connection: any;
  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      connectString: process.env.DB_CONNECT,
    });
    const result = await connection.execute(`begin :p3 := fmb.app_sec_pkg.valid_user(:p1);end;`, {
      p1: corporateRegistrationNumber,
      p3: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    });
    return result.outBinds.p3;
  } catch (error) {
    console.error(error);
    return 0;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};



export const selectRequiredReportsRegistrationNumberORCL = async (regNum: number) => {
  let connection: any;
  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      connectString: process.env.DB_CONNECT,
    });

    let sql = 'SELECT distinct TEN_APPL_COMMERCIAL_ID from fmb.ten_appl_commercial where registration_number = :1';
    let binds = [regNum];
    let options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
      fetchArraySize: 100, // internal buffer allocation size for tuning
      maxRows: 200,
    };
    const result = await connection.execute(sql, binds, options);

    const innerSQL = 'SELECT * from fmb.harvest_reports_due_vw where ten_appl_commercial_id = :1 order by  TEN_PERMIT_SCHEDULE_ID';
    let binds2 = [result.rows[0].TEN_APPL_COMMERCIAL_ID];
    const retInner = await connection.execute(innerSQL, binds2, options);


    let uniquePermitIds: string[] = [];
    retInner.rows.forEach((r: any) => {
      if(!uniquePermitIds.includes(r.TEN_CUTTING_PERMIT_ID)){
        uniquePermitIds = uniquePermitIds.concat(r.TEN_CUTTING_PERMIT_ID)
      }
    })

    const y = uniquePermitIds.map((permitId: string) => {
      const filteredRows = retInner.rows.filter((r: any) => r.TEN_CUTTING_PERMIT_ID === permitId)
      let months: string[] = [];
      filteredRows.forEach((r: any) => {
        if(!months.includes(r.PERIOD)){
          months = months.concat(r.PERIOD);
        }
      })

      const data = months.map((month : string) => {
        const monthfilteredRows = filteredRows.filter((r: any) => r.PERIOD === month)

        const innerData = monthfilteredRows.map((g: any) => {
          return {
            permitNum: g.PERMIT_NUMBER,
            rate: g.RATE,
            productType: g.PRODUCT + ' ' + g.TIMBER_TYPE + ' with ' + g.REMAINING_VOLUME + ' m\u00B3 remaining',
            month: g.PERIOD,
            quantity: g.VOLUME,
            permitReportId: g.TEN_PERMIT_SCHED_PROD_ID,
            permitProductId: g.TEN_PERMIT_PRODUCT_ID,
            permitScheduleId: g.TEN_PERMIT_SCHEDULE_ID,
            remainingVolume: g.REMAINING_VOLUME,
          };
        });

        return {month: month, data: innerData} as IMonthReport;
      })

      const z = {
        permitId: permitId,
        permitNum: filteredRows[0].PERMIT_NUMBER,
        data: data,
      };
      return z as IPermit;
    })
    return y;
  } catch (error) {
    console.log(error);
    return [] as IPermit[];
  } finally {
    if (connection) {
      try {
        await connection.close(); // always release the connection back to the pool
      } catch (err) {
        console.error(err);
      }
    }
  }
};
