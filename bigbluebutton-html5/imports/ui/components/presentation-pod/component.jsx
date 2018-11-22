import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';

import { getPresentationPodIds } from '/imports/ui/selectors/PresentationPodsSelectors';

import PresentationAreaContainer from '../presentation/component';

const PresentationPods = ({ presentationPodIds }) => {
  /*
    filtering/sorting presentation pods goes here
    all the future UI for the pods also goes here
    PresentationAreaContainer should fill any empty box provided by us
  */
  return (
    <PresentationAreaContainer podId="DEFAULT_PRESENTATION_POD" {...this.props} />
  );
};

PresentationPods.propTypes = {
  presentationPodIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default withTracker(() => ({
  presentationPodIds: getPresentationPodIds(),
}))(PresentationPods);
