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
            <h1>Report your commercial timber harvest volumes.</h1>

            <h3>
              Use this service to report the volume (m&#x00B3;) of commercial timber or firewood you harvest. Your
              cutting permit will specify when you need to report. Failure to report harvest volumes may affect your
              eligibility for future licences
            </h3>

            <br />
            <p>
              Complete the <a href={'https://yukon.ca/en/forest-resources-harvest-report'}>harvest report form.</a>
              <br />
            </p>
            <p>
              Submit your completed form at your local Compliance Monitoring and Inspections district office or email
              forestry@yukon.ca.
              <br />
              For questions about reporting the amount of timber harvested, contact the Forest Management Branch. Email
              forestry@yukon.ca or phone 867-456-3999, toll free in Yukon 1-800-661-0408, extension 3999.
              <br />
              You can also{' '}
              <a
                href={
                  'https://yukon.ca/en/your-government/find-government-office/find-compliance-monitoring-and-inspections-office'
                }
              >
                {' '}
                visit
              </a>{' '}
              a Compliance Monitoring and Inspections District office or the Forest Management Branch at 91807 Alaska
              Highway, Whitehorse.
              <br />
            </p>
            <p>
              Collection of this information is authorized under the authority of section 22(1)(h) and 24(1)(i) of the
              Forest Resources Act (FRA) and section 15(a) & (c)(i) of the Access to Information and Protection of
              Privacy Act and will be used to fulfill reporting obligations under the FRA Act and Regulations.{' '}
            </p>
            <p>
              For more information on the collection of your information, contact: <br />
              Tenures Administrator
              <br />
              Department of Energy, Mines and Resources <br />
              Forest Management Branch <br />
              Box 2703, Whitehorse, Yukon, Y1A 2C6 Phone: 867.456.3999 or toll free at 1.800.661.0408 ext. 3999
            </p>
            <h3>To report harvest volumes:</h3>
            <p>
              <strong>
                Press the button below and log in to the reporting system using your email address and your password.
              </strong>
            </p>
            <div>
              <Button href={'/api/auth/login'}>Start reporting your timber harvest</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
