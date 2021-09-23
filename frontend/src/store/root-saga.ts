import {all} from 'redux-saga/effects';
import {uploadWhatcherSaga} from "./upload/sagas";

export default function* rootSaga() {
    yield all([
        uploadWhatcherSaga()
    ])
}