import * as React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {CircularProgress, Fade, Theme} from "@material-ui/core";
import {grey} from "@material-ui/core/colors";

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
    size: number
};

const UploadProgress: React.FC<UploadProgressProps> = (props) => {
    const {size} = props;
    const classes = useStyles();
    return (
        <Fade in={true} timeout={{enter: 100, exit: 2000}}>
            <div className={classes.progressContainer}>
                <CircularProgress
                    variant={"static"}
                    value={100}
                    className={classes.progressBackground}
                    size={size}
                />
                <CircularProgress
                    variant={"static"}
                    value={50}
                    className={classes.progress}
                    size={size}
                />
            </div>
        </Fade>
    );
};

export default UploadProgress;