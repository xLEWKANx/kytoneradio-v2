export const UPLOAD_START = 'UPLOAD_START';
export const UPLOAD_PROGRESS = 'UPLOAD_PROGRESS';
export const UPLOAD_SUCCESS = 'UPLOAD_SUCCESS';
export const UPLOAD_FAIL = 'UPLOAD_FAIL';

export const uploadActions = {
  uploadStart: (files) => ({
    type: UPLOAD_START,
    payload: files
  }),
  uploadProgress: (progress) => ({
    type: UPLOAD_PROGRESS,
    payload: progress
  }),
  uploadSuccess: () => ({
    type: UPLOAD_SUCCESS
  }),
  uploadFail: (err) => ({
    type: UPLOAD_FAIL,
    payload: err
  })
};
