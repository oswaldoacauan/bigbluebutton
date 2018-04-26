import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { getSwapLayout } from '/imports/ui/components/media/service';
import PresentationAreaService from './service';
import PresentationArea from './component';

import Annotations from '/imports/api/annotations';
import AnnotationsChunks from '/imports/api/annotations-chunks';

const PresentationAreaContainer = props => (
  <PresentationArea {...props} />
);

export default withTracker(() => ({
  currentSlide: PresentationAreaService.getCurrentSlide(),
  userIsPresenter: PresentationAreaService.isPresenter() && !getSwapLayout(),
  multiUser: PresentationAreaService.getMultiUserStatus() && !getSwapLayout(),
  chunkSize: AnnotationsChunks.find().count(),
  annSize: Annotations.find().count(),
}))(PresentationAreaContainer);
