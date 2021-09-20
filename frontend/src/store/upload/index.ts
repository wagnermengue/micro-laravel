import * as Typings from './types';
import {createActions, createReducer} from 'reduxsauce';

export const {Types, Creators} = createActions<{
    ADD_UPLOAD: string,
}, {
    addUpload(payload: Typings.AddUploadAction['payload']): Typings.AddUploadAction
}>({
    addUpload: ['payload']
});

export const INITIAL_STATE : Typings.State= {
    uploads: []
};

const reducer = createReducer(INITIAL_STATE, {
    [Types.ADD_UPLOAD]: addUpload as any,
})

export default reducer;

function addUpload(state = INITIAL_STATE, action: Typings.AddUploadAction) : Typings.State {
    if (!action.payload.files.length) {
        return state;
    }

    const index = fileIndexUpload(state, action.payload.video.id);
    if (index !== -1 && state.uploads[index].progress < 1) {
        return state;
    }

    return {

    };
}

function fileIndexUpload(state: Typings.State, id: string) {
    return state.uploads.findIndex((upload) => upload.video.id === id);
}