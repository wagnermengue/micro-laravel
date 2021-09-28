import * as React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {CircularProgress, Fade, Theme} from "@material-ui/core";
import {grey} from "@material-ui/core/colors";
import {FileUpload, Upload} from "../store/upload/types";
import {hasError} from "../store/upload/getters";

const useStyles = makeStyles((theme: Theme) => ({
    progressContainer: {
        position: 'relative',
    },
    progress: {
        position: 'absolute',
        left: 0
    },
    progressBackground: {
        color: grey["300"]
    }
}));

interface UploadProgressProps {
    uploadOrFile: Upload | FileUpload;
    size: number;
}

const UploadProgress: React.FC<UploadProgressProps> = (props) => {
    const {size, uploadOrFile} = props;
    const classes = useStyles();
    const error = hasError(uploadOrFile);

    return (
        <Fade in={uploadOrFile.progress < 1} timeout={{enter: 100, exit: 2000}}>
            <div className={classes.progressContainer}>
                <CircularProgress
                    variant={"static"}
                    value={100}
                    className={classes.progressBackground}
                    size={size}
                />
                <CircularProgress
                    variant={"static"}
                    value={error ? 0 : uploadOrFile.progress * 100}
                    className={classes.progress}
                    size={size}
                />
            </div>
        </Fade>
    );
};

export default UploadProgress;