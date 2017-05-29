import { put, takeEvery, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { showNotification, FETCH_START, FETCH_END } from 'admin-on-rest';

function* handleUpload() {
  yield put({ type: FETCH_START });
}

function* handleUploadEnd() {
  yield put({ type: FETCH_END });
}

function* handleUploadError(action) {
  console.log('error action', action);
  yield yield put(showNotification('Error: uploading failed', 'warning'));
  yield put({ type: FETCH_END });
}

export default function* uploadSaga() {
  yield [
    takeLatest('UPLOAD_START', handleUpload),
    takeLatest('UPLOAD_SUCCESS', handleUploadEnd),
    takeLatest('UPLOAD_FAIL', handleUploadError)
  ];
}
