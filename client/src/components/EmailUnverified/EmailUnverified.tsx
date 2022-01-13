import * as React from 'react';
import { AuroraNavBar } from '../AuroraNavBar/AuroraNavbar';
import { Button, Card, CardBody, Navbar, NavbarBrand } from 'reactstrap';
import logo from '../../logo.svg';

export const EmailUnverified: React.FC = () => {
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
              You have successfully created an account for reporting your timber harvest but you have yet to verify it.
                <br/>
              Check your email at the address you used to create this account. You should have a new message asking you to verify your account.
              Follow the instructions and try to login here again once you have finished verifying your account.
                <br/><br/>
                <Button
                    color={'primary'}
                    onClick={(e) => {
                        e.preventDefault();
                        window.location.href='api/auth/logout';
                    }}
                >
                    Please Logout
                </Button>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
