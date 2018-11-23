/* eslint import/prefer-default-export: 0 */
import { createSelector } from 'reselect';
import { injectState } from './createSelector';
import { getCurrentUserId } from './UserSelectors';
import { getIdToFetch } from './CommonSelectors';
import { getPresentationPods } from './PresentationPodsSelectors';

export const getPresentationPodSelector = createSelector(
  getPresentationPods,
  getIdToFetch,
  (state, id) => state && id in state && state[id],
);

export const getPresentationPod = injectState(getPresentationPodSelector);

export const getPresentationPodOwner = (podId) => {
  return createSelector(
    getPresentationPod.bind(null, podId),
    pod => pod && pod.currentPresenterId,
  )();
};

export const getCurrentUserIsPodOwner = (podId) => {
  return createSelector(
    getCurrentUserId,
    getPresentationPod.bind(null, podId),
    (currentUserId, pod) => pod && currentUserId === pod.currentPresenterId,
  )();
};
