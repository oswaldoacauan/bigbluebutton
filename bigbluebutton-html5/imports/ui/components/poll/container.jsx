import React from 'react';
import { makeCall } from '/imports/ui/services/api';
import { withTracker } from 'meteor/react-meteor-data';
import Users from '/imports/api/users';
import Auth from '/imports/ui/services/auth';
import Presentations from '/imports/api/presentations';
import { getCurrentSlideByPod } from '/imports/ui/selectors/SlideSelectors';
import Poll from './component';
import Service from './service';

const PollContainer = ({ ...props }) => {
  const currentUser = Users.findOne({ userId: Auth.userID });
  if (currentUser.presenter) {
    return (<Poll {...props} />);
  }
  Session.set('isPollOpen', false);
  Session.set('forcePollOpen', false);
  Session.set('isUserListOpen', true);
  return null;
};

export default withTracker(() => {
  Meteor.subscribe('current-poll', Auth.meetingID);

  // TODO: This will not work when we start to display multiple pods
  // because we can have multiple current presentations
  const currentPresentation = Presentations.findOne({
    current: true,
  });

  const currentSlide = getCurrentSlideByPod(currentPresentation.podId);

  const startPoll = type => makeCall('startPoll', type, currentSlide.id);

  const startCustomPoll = (type, answers) => makeCall('startPoll', type, currentSlide.id, answers);

  return {
    currentSlide,
    currentUser: Service.currentUser(),
    pollTypes: Service.pollTypes,
    startPoll,
    startCustomPoll,
    stopPoll: Service.stopPoll,
    publishPoll: Service.publishPoll,
    currentPoll: Service.currentPoll(),
    getUser: Service.getUser,
  };
})(PollContainer);
