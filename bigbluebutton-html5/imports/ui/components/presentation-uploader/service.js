import Presentations from '/imports/api/presentations';
import Auth from '/imports/ui/services/auth';

import { callServer } from '/imports/ui/services/api';

const getPresentations = () =>
  Presentations
    .find()
    .fetch()
    .map(p => ({
      _id: p._id,
      id: p.presentation.id,
      filename: p.presentation.name,
      isCurrent: p.presentation.current,
    }));

export default {
  getPresentations,
};
