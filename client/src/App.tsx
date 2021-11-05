import React from 'react';
import { AppLayout } from 'AppLayout';
import { AuthProvider } from 'contexts/AuthContext';
import { UserProvider } from 'components/User/UserContext';
import { LoadingModal } from 'components/Loading/LoadingModal';

const App = () => {
  return (
    <>
      <AuthProvider>
        <div>
          <UserProvider>
            <AppLayout />
          </UserProvider>
        </div>
      </AuthProvider>
      <LoadingModal />
    </>
  );
};

export default App;
