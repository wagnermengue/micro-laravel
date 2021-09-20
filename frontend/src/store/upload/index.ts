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
    return {

    };
}