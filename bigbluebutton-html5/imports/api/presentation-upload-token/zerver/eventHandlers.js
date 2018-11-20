import RedisPubSub from '/imports/startup/zerver/redis';
import { processForHTML5ServerOnly } from '/imports/api/common/zerver/helpers';

import handlePresentationUploadTokenPass from './handlers/presentationUploadTokenPass';
import handlePresentationUploadTokenFail from './handlers/presentationUploadTokenFail';

RedisPubSub.on('PresentationUploadTokenPassRespMsg', processForHTML5ServerOnly(handlePresentationUploadTokenPass));
RedisPubSub.on('PresentationUploadTokenFailRespMsg', processForHTML5ServerOnly(handlePresentationUploadTokenFail));
