import {Types} from "./index";
import {actionChannel, take} from "redux-saga/effects";
import {AddUploadAction} from "./types";

export function* uploadWhatcherSaga() {
    const newFileChannel = yield actionChannel(Types.ADD_UPLOAD);

    while (true) {
        const {payload}: AddUploadAction = yield take(newFileChannel);
    }
}