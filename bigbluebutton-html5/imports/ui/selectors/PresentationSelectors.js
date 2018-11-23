/* eslint import/prefer-default-export: 0 */
import { createSelector, injectState } from './createSelector';
import { getIdToFetch } from './CommonSelectors';
import { getPresentations } from './PresentationsSelectors';

export const getPresentationSelector = createSelector(
  getPresentations,
  getIdToFetch,
  (state, id) => state && id in state && state[id],
);

export const getPresentation = injectState(getPresentationSelector);
