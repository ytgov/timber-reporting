import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Row,
  Table,
} from 'reactstrap';
import { AuroraNavBar } from '../AuroraNavBar/AuroraNavbar';
import 'react-datepicker/dist/react-datepicker.css';
import { authAxios } from 'services/AxiosService';
import { BottomBar } from '../AuroraNavBar/BottomBar';
import { notifyError } from 'services/ToastService';
import { useWindowDimensions } from 'hooks/WindowHooks';

export interface IData {
  reportedDate: string;
  rate: string;
  permitReportId: string;
  permitNum: string;
  quantity: number;
  productType: string;
  permitProductId: string;
  permitScheduleId: string;
  remainingVolume: number;
}

export interface IRequiredReport {
  customerName: string;
  permitId: string;
  permitNum: string;
  month: string;
  thp: string;
  operatingUnit: string;
  blockNumber: string;
  processed: boolean;
  editing: boolean;
  data: IData[];
}

export const MainPage: React.FC = () => {
  const [cordValue, setCordValue] = useState<number | undefined>(1);
  const { xs, sm } = useWindowDimensions();
  const mobile = xs || sm;
  const [requiredReports, setRequiredReports] = useState([] as IRequiredReport[]);
  const [permitDisplayError, setPermitDisplayError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedPermit, setSubmittedPermit] = useState('');
  const [attemptSubmit, setAttemptSubmit] = useState('');
  const [loading, setLoading] = useState(false);
  const formatCurrency = (number: number) =>
    new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(number);

  const submitTimberHarvest = async (data: IData[]) => {
    return await authAxios
      .post('api/permits/report-harvest', data)
      .then((response: any) => {
        if (response.data.status === 'OK') {
          return 1;
        } else {
          notifyError('Entry Not Saved');
          return 0;
        }
      })
      .catch((error) => {
        const caughtErrorMessage = error.response && error.response.data && error.response.data.userMessage;
        if (caughtErrorMessage) {
          console.log('An error happened', caughtErrorMessage);
          notifyError('Entry Not Saved');
        }
        return 0;
      });
  };

  const overHarvest = (permitId: string) => {
    const tot = (requiredReports
          .filter((rr) => rr.permitId === permitId)
          .reduce(
              (prev: number, curr: IRequiredReport) =>
                  prev +
                  curr.data.reduce(
                      (prev2: number, curr2: IData) => prev2 + (curr2.quantity*1),
                      0
                  ),
              0
          ));
      const remain = requiredReports
          .filter((f) => permitId === f.permitId)[0]
          .data.map((f, i) => (
              f.remainingVolume ));
;     return tot > remain[0];
  };

  const refresh = () => {
    setErrorMessage('');
    setAttemptSubmit('');
    setPermitDisplayError('');
    setLoading(true);
    authAxios
      .get(`api/permits/required-reports`)
      .then((response: any) => {
        if (response.data.status === 'OK') {
          setErrorMessage('');
          const data = response.data.permits.map((e: IRequiredReport) => ({
            ...e,
            processed: e.data.find((f) => (!!f.quantity || f.quantity===0)),
          }));
          setRequiredReports(data);
        } else {
          setErrorMessage('Not Logged in');
        }
        setLoading(false);
      })
      .catch((error) => {
        const caughtErrorMessage = error.response && error.response.data && error.response.data.userMessage;
        if (caughtErrorMessage) {
          console.log('An error happened', caughtErrorMessage);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className={'d-flex'} style={{ flexDirection: 'column', height: '100%' }}>
      <div className={'user-details-container flex-grow-1'}>
        <AuroraNavBar>
          Welcome to the Timber Harvest Reporting application.
          <br />
          You can report on any outstanding harvest volumes.
          <br />
          Reporting is required in cubic metres.
        </AuroraNavBar>
        <Container fluid={true} className={'my-3 media-padding'}>
          {loading && <div className={'mt-4'}>Loading...</div>}
          {requiredReports.length === 0 && !loading && <div className={'mt-4'}>You have no required reports!</div>}
          {requiredReports.length > 0 && (
            <Card>
              <CardHeader>Enter the number of cords in the field below to find the m&#x00B3; conversion.</CardHeader>
              <CardBody>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label>Cord</Label>
                      <Input
                        value={cordValue}
                        type={'number'}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const value: any = e.target.value;
                          setCordValue(value);
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label>Cubic metres (m&#x00B3;)</Label>
                      <Input
                        value={!cordValue || isNaN(cordValue) ? '' : cordValue * 2.265}
                        type={'number'}
                        readOnly={true}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const value: any = e.target.value;
                          setCordValue(!value || isNaN(value) ? undefined : Number(value) / 2.265);
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          )}
          {requiredReports.length > 0 &&
            requiredReports
              .map((e) => e.permitId)
              .filter((value, index, self) => {
                return self.indexOf(value) === index;
              })
              .map((e, i) => {
                return (
                  <Row key={`rr_${i}`} className={'mt-3'}>
                    <Col>
                      <Table style={{ borderCollapse: 'collapse' }} bordered={true} hover={true}>
                        <thead>
                          <tr>
                            <th
                              style={{ backgroundColor: 'rgba(0, 0, 0, 0.03)', borderBottomWidth: 1 }}
                              colSpan={requiredReports.filter((f) => e === f.permitId)[0].data.length + 2}
                            >
                              <span style={{ fontWeight: 400 }}>Business name:</span>{' '}
                              {requiredReports.find((rr) => rr.permitId === e)?.customerName ?? '-'}
                              <span style={{ fontWeight: 400 }} className={!mobile ? 'ml-3' : ''}>
                                Permit:
                              </span>{' '}
                              {requiredReports.find((rr) => rr.permitId === e)?.permitNum}
                              <br />
                              <span style={{ fontWeight: 400 }}>THP:</span>{' '}
                              {requiredReports.find((rr) => rr.permitId === e)?.thp ?? '-'} {mobile && <br />}
                              <span style={{ fontWeight: 400 }} className={!mobile ? 'ml-3' : ''}>
                                Operating unit:
                              </span>{' '}
                              {requiredReports.find((rr) => rr.permitId === e)?.operatingUnit ?? '-'} {mobile && <br />}
                              <span style={{ fontWeight: 400 }} className={!mobile ? 'ml-3' : ''}>
                                Block number:
                              </span>{' '}
                              {requiredReports.find((rr) => rr.permitId === e)?.blockNumber ?? '-'}
                            </th>
                          </tr>
                          {!mobile && (
                            <tr>
                              <th style={{ borderBottomWidth: 1 }}>Month</th>
                              {requiredReports
                                .filter((f) => e === f.permitId)[0]
                                .data.map((f, i) => (
                                  <th style={{ borderBottomWidth: 1 }} key={`rr_${i}`}>
                                    {f.productType}
                                  </th>
                                ))}
                              <th style={{ textAlign: 'right', borderBottomWidth: 1 }}>Stumpage due</th>
                            </tr>
                          )}
                        </thead>
                        <tbody>
                          {requiredReports
                            .filter((f) => e === f.permitId)
                            .map((res: IRequiredReport, index) => {
                              return (
                                <>
                                  {mobile && (
                                    <tr key={`mobile-tr-${index}`}>
                                      <td colSpan={requiredReports.filter((f) => e === f.permitId)[0].data.length + 2}>
                                        <h5>{res.month}</h5>
                                        <div>
                                          {res.data.map((g, i) => (
                                            <FormGroup key={`non-mobile-tr-${index}-fg-${i}`}>
                                              <Label>{g.productType}</Label>{' '}
                                              <InputGroup>
                                                <Input
                                                  style={{ textAlign: 'right' }}
                                                  value={g.quantity || ''}
                                                  type={'number'}
                                                  readOnly={res.processed}
                                                  invalid={permitDisplayError === e && !g.quantity}
                                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const value = e.target.value;
                                                    setRequiredReports((a: IRequiredReport[]) => {
                                                      const pIndex = a.findIndex((b) =>
                                                        b.data.find((c) => c.permitReportId === g.permitReportId)
                                                      );
                                                      const dataIndex = a[pIndex].data.findIndex(
                                                        (c) => c.permitReportId === g.permitReportId
                                                      );
                                                      return [
                                                        ...a.slice(0, pIndex),
                                                        {
                                                          ...a[pIndex],
                                                          data: [
                                                            ...a[pIndex].data.slice(0, dataIndex),
                                                            {
                                                              ...a[pIndex].data[dataIndex],
                                                              quantity: value,
                                                            },
                                                            ...a[pIndex].data.slice(dataIndex + 1),
                                                          ],
                                                        } as IRequiredReport,
                                                        ...a.slice(pIndex + 1),
                                                      ];
                                                    });
                                                  }}
                                                />
                                                <InputGroupAddon addonType={'append'}>m&#x00B3;</InputGroupAddon>
                                              </InputGroup>
                                            </FormGroup>
                                          ))}
                                        </div>
                                        <div className={'mt-2'}>
                                          Stumpage due:{' '}
                                          {formatCurrency(
                                            res.data.reduce(
                                              (prev: number, curr: IData) => prev + curr.quantity * Number(curr.rate),
                                              0
                                            )
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  )}

                                  {!mobile && (
                                    <tr key={`non-mobile-tr-${index}`}>
                                      <td>{res.month}</td>
                                      {res.data.map((g, i) => (
                                        <td key={`non-mobile-tr-${index}-td-${i}`}>
                                          <InputGroup>
                                            <Input
                                              style={{ textAlign: 'right' }}
                                             // value={g.quantity || '0' }

                                                value={g.quantity}
                                              type={'text'}
                                              readOnly={res.processed}
                                              invalid={permitDisplayError === e && !g.quantity }
                                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                var valueChar = e.target.value;
                                                var value = 0;

                                                if(!valueChar) {
                                                  value = 0;
                                                } else {
                                                  value = parseFloat(valueChar);
                                                  if (!value || isNaN(value) ) {
                                                    value = 0;
                                                  }
                                                }
                                                valueChar = value+'';
                                                setRequiredReports((a: IRequiredReport[]) => {
                                                  const pIndex = a.findIndex((b) =>
                                                    b.data.find((c) => c.permitReportId === g.permitReportId)
                                                  );
                                                  const dataIndex = a[pIndex].data.findIndex(
                                                    (c) => c.permitReportId === g.permitReportId
                                                  );
                                                  return [
                                                    ...a.slice(0, pIndex),
                                                    {
                                                      ...a[pIndex],
                                                      data: [
                                                        ...a[pIndex].data.slice(0, dataIndex),
                                                        {
                                                          ...a[pIndex].data[dataIndex],
                                                          quantity: valueChar,
                                                        },
                                                        ...a[pIndex].data.slice(dataIndex + 1),
                                                      ],
                                                    } as IRequiredReport,
                                                    ...a.slice(pIndex + 1),
                                                  ];
                                                });
                                              }}
                                            />
                                            <InputGroupAddon addonType={'append'}>m&#x00B3;</InputGroupAddon>
                                          </InputGroup>
                                        </td>
                                      ))}
                                      <td align={'right'}>
                                        {formatCurrency(
                                          res.data.reduce(
                                            (prev: number, curr: IData) => prev + curr.quantity * Number(curr.rate),
                                            0
                                          )
                                        )}
                                      </td>
                                    </tr>
                                  )}
                                </>
                              );
                            })}
                        </tbody>
                        <tfoot>
                          <tr>

                            <td
                              colSpan={requiredReports.filter((f) => e === f.permitId)[0].data.length + 1}
                              align={mobile ? 'left' : 'right'}
                            >
                             {submittedPermit === e && overHarvest(e) && (
                                  <Alert color={'warning'} toggle={() => setSubmittedPermit('')}>
                                    Overharvest - Please contact forestry if further volume is required.
                                    <br/>
                                    Thank you for submitting your harvest information. You can edit the data for up to 24 hours. An invoice will be sent to you. You don’t need to do anything. If you have questions please contact forestry at 867.456.3999
                                  </Alert>
                             )}
                             {submittedPermit === e && !overHarvest(e) &&(
                                  <Alert color={'success'} toggle={() => setSubmittedPermit('')}>
                                    Thank you for submitting your harvest information. You can edit the data for up to 24 hours. An invoice will be sent to you. You don’t need to do anything. If you have questions please contact forestry at 867.456.3999
                                  </Alert>
                              )}
                              {attemptSubmit === e && errorMessage && submittedPermit !== e && (
                                  <Alert
                                      color={'danger'}
                                      toggle={() => {
                                        setAttemptSubmit('');
                                        setErrorMessage('');
                                      }}
                                  >
                                    {errorMessage}
                                  </Alert>
                              )}
                              {requiredReports.find((rr) => rr.permitId === e)?.processed && (
                                <>
                                  <Button
                                    color={'primary'}
                                    onClick={async () => {
                                      setRequiredReports((a: IRequiredReport[]) => {
                                        return a.map((b) => {
                                          if (b.permitId === e) {
                                            return {
                                              ...b,
                                              processed: false,
                                              editing: true,
                                            };
                                          } else {
                                            return b;
                                          }
                                        });
                                      });
                                    }}
                                  >
                                    Edit volumes
                                  </Button>
                                </>
                              )}

                              {(requiredReports.find((rr) => rr.permitId === e)?.editing ||
                                permitDisplayError === e) && (
                                <Button
                                  color={'link'}
                                  onClick={async () => {
                                    refresh();
                                  }}
                                >
                                  Cancel
                                </Button>
                              )}

                              {!requiredReports.find((rr) => rr.permitId === e)?.processed && (
                                <Button
                                  color={'primary'}
                                  onClick={async () => {
                                    const data = requiredReports
                                      .filter((rr) => rr.permitId === e)
                                      .reduce((prev: IData[], curr: IRequiredReport) => [...prev, ...curr.data], []);
                                    if (data.find((d) => (!d.quantity && d.quantity !== 0))) {
                                      setPermitDisplayError(e);
                                      setErrorMessage('Missing harvest amount. You must enter a value for every month');
                                      setAttemptSubmit(e);
                                    } else {
                                    //  if (!overHarvest(e)) {
                                        const x = await submitTimberHarvest(data);
                                        if (x === 1) {
                                          setSubmittedPermit(e);
                                          setRequiredReports((a: IRequiredReport[]) => {
                                            return a.map((b) => {
                                              if (b.permitId === e) {
                                                return {
                                                  ...b,
                                                  processed: true,
                                                  editing: false,
                                                };
                                              } else {
                                                return b;
                                              }
                                            });
                                          });
                                        }
                                  //    } else {
                                    //    setPermitDisplayError(e);
                                      //  setErrorMessage('Overharvest - Please contact forestry if further volume is required.');
                                        //setAttemptSubmit(e);
                                      //}
                                    }
                                  }}
                                >
                                  Submit report
                                </Button>
                              )}
                            </td>
                            <td align={'right'}>
                              Total:{' '}
                              {formatCurrency(
                                requiredReports
                                  .filter((rr) => rr.permitId === e)
                                  .reduce(
                                    (prev: number, curr: IRequiredReport) =>
                                      prev +
                                      curr.data.reduce(
                                        (prev2: number, curr2: IData) => prev2 + curr2.quantity * Number(curr2.rate),
                                        0
                                      ),
                                    0
                                  )
                              )}
                            </td>
                          </tr>
                        </tfoot>
                      </Table>
                    </Col>
                  </Row>
                );
              })}
        </Container>
      </div>
      <div className={'d-flex'} style={{ width: '100%' }}>
        <BottomBar />
      </div>
    </div>
  );
};
