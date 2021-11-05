import * as React from 'react';
import { useState } from 'react';

export interface IAddress {
  line1: string;
  line2: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  telephone: string;
}

export interface IUser {
  userId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  homeAddress: IAddress;
  schoolAddress: IAddress;
}

type ContextType = {
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  firstName: string;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  middleName: string;
  setMiddleName: React.Dispatch<React.SetStateAction<string>>;
  lastName: string;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  homeAddress: IAddress;
  setHomeAddress: React.Dispatch<React.SetStateAction<IAddress>>;
  schoolAddress: IAddress;
  setSchoolAddress: React.Dispatch<React.SetStateAction<IAddress>>;
  citizenship: string;
  setCitizenship: React.Dispatch<React.SetStateAction<string>>;
  highSchoolEnd: string | null;
  setHighSchoolEnd: React.Dispatch<React.SetStateAction<string | null>>;
};

export const UserContext = React.createContext<ContextType>({
  userId: '',
  setUserId: () => {},
  firstName: '',
  setFirstName: () => {},
  middleName: '',
  setMiddleName: () => {},
  lastName: '',
  setLastName: () => {},
  email: '',
  setEmail: () => {},
  phone: '',
  setPhone: () => {},
  homeAddress: {} as IAddress,
  setHomeAddress: () => {},
  schoolAddress: {} as IAddress,
  setSchoolAddress: () => {},
  citizenship: '',
  setCitizenship: () => {},
  highSchoolEnd: '',
  setHighSchoolEnd: () => {},
});

export const UserProvider = (props: any) => {
  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [homeAddress, setHomeAddress] = useState({} as IAddress);
  const [schoolAddress, setSchoolAddress] = useState({} as IAddress);
  const [citizenship, setCitizenship] = useState('Canadian Citizen');
  const [highSchoolEnd, setHighSchoolEnd] = useState<string | null>(null);

  return (
    <UserContext.Provider
      value={{
        userId,
        setUserId,
        firstName,
        setFirstName,
        middleName,
        setMiddleName,
        lastName,
        setLastName,
        email,
        setEmail,
        phone,
        setPhone,
        homeAddress,
        setHomeAddress,
        schoolAddress,
        setSchoolAddress,
        citizenship,
        setCitizenship,
        highSchoolEnd,
        setHighSchoolEnd,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export const UserConsumer = UserContext.Consumer;
