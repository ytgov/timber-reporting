import * as React from 'react';
import { AuroraNavBar } from '../AuroraNavBar/AuroraNavbar';
import { Button, Card, CardBody, Navbar, NavbarBrand } from 'reactstrap';
import logo from '../../logo.svg';

export const NoAcctFound: React.FC = () => {
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

            <p>
              There are no permits associated with this email address. Please ensure that you use the email address on
              file with the Forest Management Branch. If you are having trouble, contact the{' '}
              <a href={'https://yukon.ca/en/places/forest-management-branch '}>Forest Management Branch</a>.
              <br />
              <br />
              Phone: 867-456-3999
              <br />
              Email: <a href={'mailto:forestry@yukon.ca'}>forestry@yukon.ca</a>
              <br />
              <br />
              <Button
                color={'primary'}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = 'api/auth/logout';
                }}
              >
                Continue
              </Button>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
