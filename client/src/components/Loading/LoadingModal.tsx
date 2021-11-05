import * as React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { FaSpinner } from 'react-icons/fa';
import LoadingService from './LoadingService';

interface IMyState {
  isOpen: boolean;
  text: string;
}

export class LoadingModal extends React.Component<{}, IMyState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isOpen: false,
      text: '',
    };
  }

  public componentDidMount() {
    LoadingService.register(this.open, this.close);
  }

  public componentWillUnmount() {
    LoadingService.unregister(); // necessary?
  }

  public render() {
    return (
      <Modal isOpen={this.state.isOpen} size={'sm'}>
        <ModalBody className={'text-center'}>
          <FaSpinner size={'48px'} className={'spinner p-2'} />
          <div>{this.state.text}</div>
        </ModalBody>
      </Modal>
    );
  }

  private open = (text: string) => {
    if (!text || text === '') {
      text = 'Loading...';
    }
    this.setState({ text, isOpen: true });
  };

  private close = () => {
    this.setState({ isOpen: false });
  };
}
