import * as React from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';
import aurora from '../../aurora.svg';

export const AuroraNavBar: React.FC = (props) => {
  return (
    <Navbar color={'light'} light={true} expand={'xs'} style={{ borderTop: '5px solid #ffcd57', overflow: 'hidden' }}>
      <NavbarBrand className={'mr-auto media-padding d-flex'} style={{ flex:1,height: 100 }}>
        <div style={{
            textAlign: 'center',
            flex: 5,
            justifyContent:"flex-start",
            bottom: '13px',
            height: 100,

        }}>  {props.children}</div>
        {/*<div style={{ width: 350 }} className={'d-none d-md-block'}>*/}
          <div
            style={{
              flex:1,
              bottom: '13px',
              position: 'absolute',
              right: -250,
              height: 100,
            }}
          >
            <img src={aurora} style={{ height: '100%' }} alt={'aurora'} />
          </div>
        {/*</div>*/}
      </NavbarBrand>
    </Navbar>
  );
};
