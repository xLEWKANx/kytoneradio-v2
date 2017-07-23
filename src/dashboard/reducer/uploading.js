import {
  UPLOAD_START,
  UPLOAD_PROGRESS,
  UPLOAD_SUCCESS,
  UPLOAD_FAIL
} from '../actions/uploadActions.js';

export default (initState = {}, { type, payload }) => {
  switch (type) {
    case UPLOAD_START: {
      return {
        isLoading: true,
        progress: 0,
        err: null,
        files: payload
      };
    }
    case UPLOAD_PROGRESS: {
      return {
        ...initState,
        progress: payload
      };
    }
    case UPLOAD_SUCCESS: {
      return {
        ...initState,
        isLoading: false,
        progress: 100
      };
    }
    case UPLOAD_FAIL: {
      return {
        isLoading: false,
        err: payload
      };
    }
    default:
      return initState;
  }
};
