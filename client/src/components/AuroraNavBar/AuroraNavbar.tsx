import * as React from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';
import aurora from '../../aurora.svg';
import { useWindowDimensions } from 'hooks/WindowHooks';

export const AuroraNavBar: React.FC = (props) => {
  const { xs, sm, md } = useWindowDimensions();
  const hideBanner = xs || sm;

  return (
    <Navbar color={'light'} light={true} expand={'xs'} style={{ borderTop: '5px solid #ffcd57', overflow: 'hidden' }}>
      <NavbarBrand className={'mr-auto media-padding d-flex'} style={{ flex: 1, height: 100 }}>
        <div
          style={{
            textAlign: 'center',
            flex: 5,
            justifyContent: 'flex-start',
            bottom: '13px',
            height: 100,
          }}
        >
          {props.children}
        </div>
        {(!hideBanner || !props.children) && (
          <div
            style={{
              flex: 1,
              bottom: '13px',
              position: 'absolute',
              right: md ? -350 : -250,
              height: 100,
            }}
          >
            <img src={aurora} style={{ height: '100%' }} alt={'aurora'} />
          </div>
        )}
      </NavbarBrand>
    </Navbar>
  );
};
