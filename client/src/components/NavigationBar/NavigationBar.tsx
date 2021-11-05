import * as React from 'react';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  UncontrolledDropdown,
} from 'reactstrap';
import logo from '../../logo.svg';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';
import { ConfirmModal } from '../ConfirmModal/ConfirmModal';
import { UserContext } from '../User/UserContext';
import { EnvironmentInfoBar } from 'components/NavigationBar/EnvironmentBar';

export const NavigationBar: React.FC = () => {
  const [modal, setModal] = useState(false);
  const userContext = useContext(UserContext);

  const userMenu = () => {
    const userMenu = (
      <UncontrolledDropdown nav={true} className={'ml-sm-auto'}>
        <DropdownToggle nav={true} caret={true} className={'initialsContainerDropdown'}>
          <div className={'initialsContainer'}>
            <FaUser style={{ color: 'white', marginBottom: '0.25rem' }} />
            <span className={'userInitials'}>
              {[userContext.firstName, userContext.lastName].map((s: string) => s.substr(0, 1).toUpperCase()).join('')}
            </span>
          </div>
        </DropdownToggle>
        <DropdownMenu right={true}>
          <DropdownItem onClick={() => logoutToggle()}>
            <FaSignOutAlt /> Log Out
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    );

    return (
      <Nav navbar={true} className={'flex-grow-1 flex-wrap'}>
        <NavItem active={window.location.pathname === '/' || window.location.pathname.includes('/files')}>
          <Link to={{ pathname: '/' }} className={'nav-link'}>
            Current Reports
          </Link>
        </NavItem>
        <NavItem active={window.location.pathname.includes('previous-reports')}>
          <Link to={{ pathname: '/previous-reports' }} className={'nav-link'}>
            Previous Reports
          </Link>
        </NavItem>

        <div className={'flex ml-sm-auto'}>{userMenu}</div>
      </Nav>
    );
  };

  const logoutToggle = () => {
    setModal((s) => !s);
  };

  return (
    <header>
      <Navbar expand={'xs'} className={'navigation-bar flex-wrap media-padding'}>
        <EnvironmentInfoBar />
        <a href={'#main'} className={'skip-navigation nav-link'}>
          Skip Navigation
        </a>
        <NavbarBrand href={'https://yukon.ca'}>
          <img src={logo} style={{ height: 50 }} className={'yg-logo'} alt={'YG Logo'} />
        </NavbarBrand>
        <hr className={'d-block d-md-none w-100'} />
        {userMenu()}
      </Navbar>
      <ConfirmModal
        isOpen={modal}
        title={'Confirm Logout'}
        confirmURL={'/api/auth/logout'}
        onCancel={() => logoutToggle()}
        confirmButton={'Logout'}
      >
        You are about to logout.
      </ConfirmModal>
    </header>
  );
};
