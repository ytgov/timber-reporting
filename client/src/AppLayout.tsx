import * as React from 'react';
import { useContext } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import {
    AUTH_STATE_EMAIL_UNVERIFIED,
    AUTH_STATE_LOADING, AUTH_STATE_NO_ACCT_FOUND,
    AUTH_STATE_SIGNED_IN,
    AUTH_STATE_SIGNED_OUT,
    AuthContext
} from 'contexts/AuthContext';
import { NavigationBar } from 'components/NavigationBar/NavigationBar';
import { ToastContainer } from 'react-toastify';
import { MainPage } from 'components/MainPage/MainPage';
import { LandingPage } from 'components/LandingPage/LandingPage';
import { PreviousReports } from 'components/MainPage/PreviousReports';
import {FourHundredFour} from "./components/FourHundredFour/FourHundredFour";
import {EmailUnverified} from "./components/EmailUnverified/EmailUnverified";
import {NoAcctFound} from "./components/NoAcctFound/NoAcctFound";

export const AppLayout = () => {
  const authContext = useContext(AuthContext);
  switch (authContext.state.type) {
    case AUTH_STATE_SIGNED_IN:
        return (
            <Router>
                <Route path={'/login-complete'}>
                    <Redirect to={'/'}/>
                </Route>
                <Route path={'/'}>
                    <NavigationBar/>
                </Route>
                <Route path={'/landing'}>
                    <Redirect to={'/'}/>
                </Route>

                <main className={'content-wrapper d-flex'} id={'main'} style={{height: 'calc(100% - 76px)'}}>
                    <Switch>
                        <Route path={'/FourHundredFour'}>
                            <FourHundredFour/>
                        </Route>
                        <Route path={'/'} exact={true}>
                            <MainPage/>
                        </Route>
                        <Route path={'/previous-reports'}>
                            <PreviousReports/>
                        </Route>

                    </Switch>
                </main>
                <ToastContainer autoClose={8000}/>
            </Router>
        );
    case AUTH_STATE_LOADING:
      return (
        <Router>
          <Route path={'/'} render={() => <div>Loading</div>} />
        </Router>
      );
    case AUTH_STATE_SIGNED_OUT:
      return (
        <Router>
         <Route path={'/'}>
            <LandingPage />
          </Route>
        </Router>
      );
    case AUTH_STATE_EMAIL_UNVERIFIED:
      return (
        <Router>
            <EmailUnverified/>
        </Router>
      );
    case AUTH_STATE_NO_ACCT_FOUND:
          return (
              <Router>
                  <NoAcctFound/>
              </Router>
          );
    default:
      return (
        <Router>
          <Route path={'/'}>
            <div>Authentication Error</div>
          </Route>
        </Router>
      );
  }
};
