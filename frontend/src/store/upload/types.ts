import {AxiosError} from "axios";
import {Video} from "../../util/models";

export interface FileUpload {
    fileField: string;
    fileName: string;
    progress: number;
    error?: AxiosError;
}

export interface Upload {
    video: Video;
    progress: number;
    files: FileUpload[];
}

export interface UploadCollectionState {
    uploads: Upload[];
}