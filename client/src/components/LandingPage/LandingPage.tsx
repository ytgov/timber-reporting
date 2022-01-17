import * as React from 'react';
import { AuroraNavBar } from '../AuroraNavBar/AuroraNavbar';
import { Button, Card, CardBody, Navbar, NavbarBrand } from 'reactstrap';
import logo from '../../logo.svg';

export const LandingPage: React.FC = () => {
  return (
    <div>
      <Navbar expand={'xs'} className={'navigation-bar flex-wrap media-padding'}>
        <NavbarBrand href={'https://yukon.ca'}>
          <img src={logo} style={{ height: 50 }} className={'yg-logo'} alt={'YG Logo'} />
        </NavbarBrand>
        <hr className={'d-block d-md-none w-100'} />
      </Navbar>
      <AuroraNavBar />
      <div>
        <Card>
          <CardBody>
            <h1>Report your commercial timber harvest volumes</h1>

            <p>
              Use this service to report the volume (in cubic metres) of <a href={'https://yukon.ca/en/doing-business/permits-and-licensing/harvest-timber-or-firewood-sell'}>commercial timber or firewood you harvest</a>.
              Your cutting permit will specify when you need to report.
              Failure to report harvest volumes may affect your eligibility for future licences.
            </p>
            <br />

              <strong>Before you start </strong><br/>
              You need:<br/>
              <ul>
                <li>A Government of Yukon service account. If you don’t have an account, you will be able to create one.
              Choose the “Start reporting your timber harvest” button to get started.
                </li>
              </ul>

            <br />
            <div>
              <Button style={{
                backgroundColor: '#00818f',
              }}href={'/api/auth/login'}>Start reporting your timber harvest</Button>
            </div>
            <br />
            <strong>Have questions?</strong>
            <p>
              For questions about reporting the amount of timber harvested, contact the Forest Management Branch. Email <a
                  href={'mailto:forestry@yukon.ca'
                  }
              >forestry@yukon.ca</a> or phone 867-456-3999, toll free in Yukon 1-800-661-0408, extension 3999.
            </p>
            <p>
              You can also {'  '}
              <a
                  href={'https://yukon.ca/en/your-government/find-government-office/find-compliance-monitoring-and-inspections-office'
                  }
              >visit a Compliance Monitoring and Inspections District office</a> or the Forest Management Branch at 91807 Alaska Highway, Whitehorse.
            </p>
            <strong>Other ways to report
            </strong>
            <p>
              If you prefer a printable version of this service, you can download a PDF and send it to Yukon government.
            </p>

              <ol>
                <li>Complete a{' '}
                  <a href={'https://yukon.ca/en/forest-resources-harvest-report'}>harvest report form</a>.
                </li>
                <li>Submit your completed form at your local Compliance Monitoring and Inspections district office or email <a
                      href={'mailto:forestry@yukon.ca'
                      }
                  >forestry@yukon.ca</a>.
                </li>
              </ol>

            <strong>Data collection notice</strong>
            <p>
              Collection of this information is authorized under the authority of section 22(1)(h) and 24(1)(i)
              of the <i>Forest Resources Act</i> and section 15(a) & (c)(i) of the <i>Access to Information and
              Protection of Privacy Act</i> and will be used to fulfill reporting obligations under the <i>Forest Resources Act</i> and
              Regulations.{' '}
            </p>
            <br />
            <p>
              For more information on the collection of your information, contact:
              <br /><br />
              Tenures Administrator
              <br />
              Forest Management Branch<br />
              Department of Energy, Mines and Resources<br />
              Box 2703<br/>
              Whitehorse, Yukon  Y1A 2C6<br />
              Phone: 867-456-3999 or toll free at 1-800-661-0408, extension 3999
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
