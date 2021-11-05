import * as React from 'react';
import { useEffect, useState } from 'react';
import { Col, Container, Input, InputGroup, InputGroupAddon, Row, Table } from 'reactstrap';
import { AuroraNavBar } from '../AuroraNavBar/AuroraNavbar';
import 'react-datepicker/dist/react-datepicker.css';

import { authAxios } from 'services/AxiosService';
import { BottomBar } from '../AuroraNavBar/BottomBar';
import { IData, IRequiredReport } from 'components/MainPage/MainPage';

export const PreviousReports: React.FC = () => {
  const [previousReports, setPreviousReports] = useState([] as IRequiredReport[]);

  const formatCurrency = (number: number) =>
    new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(number);

  useEffect(() => {
    authAxios
      .get(`api/permits/previous-reports/`)
      .then((response: any) => {
        if (response.data) {
          setPreviousReports(response.data);
        }
      })
      .catch((error) => {
        const caughtErrorMessage = error.response && error.response.data && error.response.data.userMessage;
        if (caughtErrorMessage) {
          console.log('An error happened');
        }
      });
  }, []);

  return (
    <div className={'d-flex'} style={{ flexDirection: 'column', height: '100%' }}>
      <div className={'user-details-container flex-grow-1'}>
        <AuroraNavBar>
          Welcome to the Timber Harvest Reporting application. <br />
          You can report on any outstanding harvest volumes. <br />
          Reporting is required in cubic metres.
        </AuroraNavBar>
        <Container fluid={true} className={'my-3 media-padding'}>
          {previousReports.length === 0 && <div className={'mt-4'}>You have no submitted reports!</div>}
          {previousReports.length > 0 &&
            previousReports
              .map((e) => e.permitId)
              .filter((value, index, self) => {
                return self.indexOf(value) === index;
              })
              .map((e, i) => {
                return (
                  <Row key={`row_${i}`} className={'mt-3'}>
                    <Col>
                      <Table striped={true} bordered={true} hover={true}>
                        <thead>
                          <tr>
                            <th colSpan={previousReports.filter((f) => e === f.permitId)[0].data.length + 3}>
                              <span style={{ fontWeight: 400 }}>Business name:</span>{' '}
                              {previousReports.find((rr) => rr.permitId === e)?.customerName}
                              <span style={{ fontWeight: 400 }} className={'ml-3'}>
                                Permit:
                              </span>{' '}
                              {previousReports.find((rr) => rr.permitId === e)?.permitNum}
                              <br />
                              <span style={{ fontWeight: 400 }}>THP:</span>{' '}
                              {previousReports.find((rr) => rr.permitId === e)?.thp}{' '}
                              <span style={{ fontWeight: 400 }} className={'ml-3'}>
                                Operating unit:
                              </span>{' '}
                              {previousReports.find((rr) => rr.permitId === e)?.operatingUnit}{' '}
                              <span style={{ fontWeight: 400 }} className={'ml-3'}>
                                Block number:
                              </span>{' '}
                              {previousReports.find((rr) => rr.permitId === e)?.blockNumber}
                            </th>
                          </tr>
                          <tr>
                            <th>Month</th>
                            {previousReports
                              .filter((f) => e === f.permitId)[0]
                              .data.map((f, i) => (
                                <th key={`pr_th_${i}`}>{f.productType}</th>
                              ))}
                            <th>Reported date</th>
                            <th style={{ textAlign: 'right' }}>Stumpage charged</th>
                          </tr>
                        </thead>
                        <tbody>
                          {previousReports
                            .filter((f) => e === f.permitId)
                            .map((res: IRequiredReport, index) => {
                              return (
                                <tr key={`rr-tr-${index}`}>
                                  <td>{res.month}</td>

                                  {res.data.map((g, i) => (
                                    <td key={`rr-tr-${index}-td-${i}`}>
                                      <InputGroup>
                                        <Input
                                          style={{ textAlign: 'right' }}
                                          value={g.quantity || ''}
                                          type={'text'}
                                          readOnly={true}
                                        />
                                        <InputGroupAddon addonType={'append'}>m&#x00B3;</InputGroupAddon>
                                      </InputGroup>
                                    </td>
                                  ))}
                                  <td>{res.data[0].reportedDate.substr(0, 10)}</td>
                                  <td align={'right'}>
                                    {formatCurrency(
                                      res.data.reduce((prev: number, curr: IData) => prev + Number(curr.rate), 0)
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td
                              align={'right'}
                              colSpan={previousReports.filter((f) => e === f.permitId)[0].data.length + 3}
                            >
                              Total:{' '}
                              {formatCurrency(
                                previousReports
                                  .filter((rr) => rr.permitId === e)
                                  .reduce(
                                    (prev: number, curr: IRequiredReport) =>
                                      prev +
                                      curr.data.reduce((prev2: number, curr2: IData) => prev2 + Number(curr2.rate), 0),
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
