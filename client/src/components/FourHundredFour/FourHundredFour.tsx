import * as React from 'react';
import { AuroraNavBar } from 'components/AuroraNavBar/AuroraNavbar';

export const FourHundredFour = () => {
  return (
    <div className={'d-flex'} style={{ flexDirection: 'column', height: '100%' }}>
      <div className={'user-details-container flex-grow-1'}>
        <AuroraNavBar>
          <h3>404</h3>
          <h5>Sorry there is no access road to where you want to go.</h5>
        </AuroraNavBar>
      </div>
    </div>
  );
};
