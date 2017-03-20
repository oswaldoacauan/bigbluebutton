import React, { Component, PropTypes } from 'react';
import ReactModal from 'react-modal';
import styles from './styles.scss';
import cx from 'classnames';

const propTypes = {
};

const defaultProps = {
  isOpen: false,
  contentLabel: 'Modal',
};

export default class ModalBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: this.props.isOpen,
    };

    this.contentLabel = props.contentLabel;
    this.portalClassName = styles.portal;
    this.overlayClassName = styles.overlay;

    this.handleAfterOpen = this.handleAfterOpen.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  open(cb) {
    this.setState({ isOpen: true }, cb);
  }

  close(cb) {
    this.setState({ isOpen: false }, cb);
  }

  // @override
  handleAfterOpen() {
  }

  // @override
  handleRequestClose() {
  }

  // @override
  renderContent() {
    return null;
  }

  render() {
    const { className } = this.props;
    const { isOpen } = this.state;

    return (
      <ReactModal
        contentLabel={this.contentLabel}
        className={cx(styles.modal, className)}
        overlayClassName={this.overlayClassName}
        portalClassName={this.portalClassName}
        isOpen={isOpen}
        onAfterOpen={this.handleAfterOpen}
        onRequestClose={this.handleRequestClose}>
        {this.renderContent()}
      </ReactModal>
    );
  }
};

ModalBase.propTypes = propTypes;
ModalBase.defaultProps = defaultProps;
