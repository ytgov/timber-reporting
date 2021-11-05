import * as React from 'react';
import { Navbar, NavbarBrand, NavbarText } from 'reactstrap';
import aurora from '../../aurora.svg';
import logoWhite from '../../logo-white.svg';

export const BottomBar: React.FC = (props) => {
  return (
    <Navbar
      dark={true}
      expand={'xs'}
      style={{
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#0d3e4f',
      }}
    >
      <NavbarBrand className={'mr-auto media-padding'} style={{ height: 200 }}>
        {props.children}
        <img src={logoWhite} style={{ zIndex: 1, position: 'absolute' }} className={'yg-logo'} alt={'YG Logo'} />
        <span style={{ position: 'absolute', right: '-250px', bottom: '50px' }}>
          <img src={aurora} style={{ zIndex: 0, height: '185px' }} alt={'aurora'} />
        </span>
      </NavbarBrand>
      <NavbarText
        style={{
          zIndex: 0,
          position: 'absolute',
          right: '200px',
          bottom: '25px',
        }}
      >
        © Copyright 2021 Government of Yukon
      </NavbarText>
    </Navbar>
  );
};
