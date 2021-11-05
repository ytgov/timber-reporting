import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import * as React from 'react';

interface IConfirmModalProps {
  isOpen: boolean;
  title: string;
  confirmButton?: string;
  cancelButton?: string;
  onConfirm?: () => void;
  confirmURL?: string;
  onCancel: () => void;
  onDismiss?: () => void;
}

export const ConfirmModal: React.FC<IConfirmModalProps> = (props) => {
  const dismiss = () => {
    if (props.onDismiss) {
      props.onDismiss();
    } else {
      props.onCancel();
    }
  };

  return (
    <Modal isOpen={props.isOpen}>
      <ModalHeader toggle={dismiss}>{props.title}</ModalHeader>
      <ModalBody>{props.children}</ModalBody>
      <ModalFooter>
        <Button color={'link'} onClick={props.onCancel}>
          {props.cancelButton || 'Cancel'}
        </Button>
        {props.onConfirm && (
          <Button color={'danger'} onClick={props.onConfirm}>
            {props.confirmButton || 'Confirm'}
          </Button>
        )}
        {props.confirmURL && (
          <Button color={'danger'} href={props.confirmURL}>
            {props.confirmButton || 'Confirm'}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};
