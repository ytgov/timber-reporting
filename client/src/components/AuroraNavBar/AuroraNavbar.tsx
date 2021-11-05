import * as React from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';
import aurora from '../../aurora.svg';

export const AuroraNavBar: React.FC = (props) => {
  return (
    <Navbar color={'light'} light={true} expand={'xs'} style={{ borderTop: '5px solid #ffcd57', overflow: 'hidden' }}>
      <NavbarBrand className={'mr-auto media-padding d-flex'} style={{ height: 100 }}>
        <div>{props.children}</div>
        <div style={{ width: 550 }} className={'d-none d-md-block'}>
          <span
            style={{
              position: 'absolute',
              right: '-200px',
              bottom: '13px',
              height: 100,
            }}
          >
            <img src={aurora} style={{ height: '100%' }} alt={'aurora'} />
          </span>
        </div>
      </NavbarBrand>
    </Navbar>
  );
};
