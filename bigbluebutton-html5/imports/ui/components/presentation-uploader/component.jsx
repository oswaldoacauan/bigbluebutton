import React, { Component } from 'react';
import { defineMessages, injectIntl, FormattedDate } from 'react-intl';
import Modal from '/imports/ui/components/modal/component';

const intlMessages = defineMessages({
  title: {
    id: 'app.presentationUploder.title',
    defaultMessage: 'Presentation',
  },
  message: {
    id: 'app.presentationUploder.message',
    defaultMessage: `As a presenter in BigBlueButton, you have the ability of
     uploading any office document or PDF file. We recommend for the best results,
     to please upload a PDF file.`,
  },
  confirmLabel: {
    id: 'app.presentationUploder.confirmLabel',
    defaultMessage: 'Start',
  },
  confirmDesc: {
    id: 'app.presentationUploder.confirmDesc',
    defaultMessage: 'Save your changes and start the presentation',
  },
  dismissLabel: {
    id: 'app.presentationUploder.dismissLabel',
    defaultMessage: 'Cancel',
  },
  dismissDesc: {
    id: 'app.presentationUploder.dismissDesc',
    defaultMessage: 'Closes and discarts your changes',
  },
  dropzoneLabel: {
    id: 'app.presentationUploder.dropzoneLabel',
    defaultMessage: 'Drag files here to upload',
  },
  browseFilesLabel: {
    id: 'app.presentationUploder.browseFilesLabel',
    defaultMessage: 'or browse for files',
  },
});

class PresentationUploder extends Component {
  constructor(props) {
    super(props);

    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleDismiss = this.handleDismiss.bind(this);
  }

  handleConfirm() {
    console.log('SAVE EVERYCHANGE LUL');
  }

  handleDismiss() {
    console.log('DISCART EVERY CHANGE 4Head');
  }

  render() {
    const { intl, presentations } = this.props;

    return (
      <Modal
        title={intl.formatMessage(intlMessages.title)}
        confirm={{
          callback: this.handleConfirm,
          label: intl.formatMessage(intlMessages.confirmLabel),
          description: intl.formatMessage(intlMessages.confirmDesc),
        }}
        dismiss={{
          callback: this.handleDismiss,
          label: intl.formatMessage(intlMessages.dismissLabel),
          description: intl.formatMessage(intlMessages.dismissDesc),
        }}>
        <p>{intl.formatMessage(intlMessages.message)}</p>
        <table>
          <tbody>
          { presentations.map(item =>
            <tr>
              <td></td>
              <th>{item.filename}</th>
              <td>
                <time dateTime={item.uploadedAt}>
                  <FormattedDate
                    value={item.uploadedAt}
                    day="2-digit"
                    month="2-digit"
                    year="numeric"
                    hour="2-digit"
                    minute="2-digit"
                  />
                </time>
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </Modal>
    );
  }
};

export default injectIntl(PresentationUploder);
