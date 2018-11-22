/* eslint import/prefer-default-export: 0 */
import PresentationPods from '/imports/api/presentation-pods';
import { createSelector } from './createSelector';
import { getCurrentUserId } from './UserSelectors';

export const getPresentationPod = podId => PresentationPods.findOne({ podId });

export const getPresentationPodOwner = (podId) => {
  const selector = createSelector(
    getPresentationPod.bind(null, podId),
    pod => pod && pod.currentPresenterId,
  );

  return selector(podId);
};

export const getCurrentUserIsPodOwner = (podId) => {
  const selector = createSelector(
    getCurrentUserId,
    getPresentationPod.bind(null, podId),
    (currentUserId, pod) => pod && currentUserId === pod.currentPresenterId,
  );

  return selector(podId);
};
