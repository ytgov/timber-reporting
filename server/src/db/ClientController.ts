import oracledb from 'oracledb';

export interface IPermit {
  permitSelection: string;
  permitId: string;
  permitNum: string;
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
      //resultSet: true
      // extendedMetaData: true,               // get extra metadata
      // prefetchRows:     100,                // internal buffer allocation size for tuning
      fetchArraySize: 100, // internal buffer allocation size for tuning
      maxRows: 200,
    };
    const result = await connection.execute(sql, binds, options);
    const x = result.rows.map(async (e: any, i: number) => {
      //       console.log('e is: ');
      //       console.log(e);
      const innerSQL =
        'SELECT * from fmb.harvest_reports_due_vw where ten_appl_commercial_id = :1 and ten_permit_schedule_id = :2 and ten_applicant_id = :3';
      let binds = [e.TEN_APPL_COMMERCIAL_ID, e.TEN_PERMIT_SCHEDULE_ID, clientNum];

      const retInner = await connection.execute(innerSQL, binds, options);

      const data = retInner.rows.map((f: any) => {
        return {
          rate: f.RATE,
          productType: f.PRODUCT + ' ' + f.TIMBER_TYPE + ' ---> ' + f.REMAINING_VOLUME + ' m\u00B3 remaining',
          quantity: f.VOLUME || 0,
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
      //     console.log(y);
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
        'SELECT * from fmb.harvest_reports_submitted_vw where ten_appl_commercial_id = :1 and ten_permit_schedule_id = :2 and ten_applicant_id = :3';
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
      //   console.log(y);
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

export const insertPermitReportMonthDataORCL = async (data: IData, clientNum: number, source: string) => {
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
    // console.log(' Binds are ' + clientNum + data.permitReportId + ' ' + data.quantity + ' ' + source);
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
    //console.log("Rows inserted: " + result.rowsAffected+ ' rowid ' + result.lastRowid);
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
    //console.log(result.outBinds);
    return result.outBinds.p3;
  } catch (error) {
    console.error(error);
    return 0;
  } finally {
    //console.log('entered Finally');
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};
