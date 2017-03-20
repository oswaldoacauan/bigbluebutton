import React, { Component, PropTypes } from 'react';
import { clearModal } from '/imports/ui/components/app/service';
import ModalBase from './base/component';
import Button from '../button/component';
import styles from './styles.scss';
import cx from 'classnames';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  confirm: PropTypes.shape({
    callback: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string,
  }),
  dismiss: PropTypes.shape({
    callback: PropTypes.func,
    label: PropTypes.string.isRequired,
    description: PropTypes.string,
  }),
};

const defaultProps = {
  isOpen: true,
  confirm: {
    label: 'Done',
    description: 'Saves changes and closes the modal',
  },
  dismiss: {
    label: 'Cancel',
    description: 'Disregards changes and closes the modal',
  },
};

export default class Modal extends ModalBase {
  constructor(props) {
    super(props);

    this.contentLabel = props.title;
  }

  handleAction(action) {
    this.close(this.props[action].callback(...arguments));
  }

  componentWillUnmount() {
    alert('james');
  }

  renderContent() {
    const {
      title,
      dismiss,
      confirm,
    } = this.props;;

    return (
      <div>
        <header className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.actions}>
            <Button
              className={styles.dismiss}
              label={dismiss.label}
              onClick={this.handleAction.bind(this, 'dismiss')}
              aria-describedby={'modalDismissDescription'}
              tabIndex={0} />
            <Button
              color={'primary'}
              className={styles.confirm}
              label={confirm.label}
              onClick={this.handleAction.bind(this, 'confirm')}
              aria-describedby={'modalConfirmDescription'}
              tabIndex={0} />
          </div>
        </header>
        <div className={styles.content}>
          {this.props.children}
        </div>
        <div id="modalDismissDescription" hidden>{dismiss.description}</div>
        <div id="modalConfirmDescription" hidden>{confirm.description}</div>
      </div>
    );
  }
};

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;
