import * as React from 'react';
import { useEffect, useState } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { FaSpinner } from 'react-icons/fa';
import LoadingService from './LoadingService';

export const LoadingModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');

  const open = (text: string) => {
    if (!text || text === '') {
      text = 'Loading...';
    }
    setText(text);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    LoadingService.register(open, close);
    return () => setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      document.querySelector('body')?.classList.remove('modal-open');
      document.querySelector('body')?.setAttribute('style', '');
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} size={'sm'}>
      <ModalBody className={'text-center'}>
        <FaSpinner size={'48px'} className='spinner' />
        <div>{text}</div>
      </ModalBody>
    </Modal>
  );
};
