import * as React from 'react';
import {Divider, Fade, IconButton, Theme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import ErrorIcon from "@material-ui/icons/Error";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import {Link} from "react-router-dom";
import {FileUpload, Upload} from "../../store/upload/types";
import {useDispatch} from "react-redux";
import {Creators} from "../../store/upload";
import {hasError, isFinished, isUploadType} from "../../store/upload/getters";
import {useEffect, useState} from "react";
import {useDebounce} from "use-debounce";

const useStyles = makeStyles((theme: Theme) => ({
    successIcon: {
        color: theme.palette.success.main,
        marginLeft: theme.spacing(1)
    },
    errorIcon: {
        color: theme.palette.error.main,
        marginLeft: theme.spacing(1)
    },
    divider: {
        height: '20px',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    }
}));

interface UploadActionsProps {
    uploadOrFile: Upload | FileUpload;
}

const UploadActions: React.FC<UploadActionsProps> = (props) => {
    const {uploadOrFile} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const [debouncedShow] = useDebounce(show, 2500);
    const error = hasError(uploadOrFile);
    const videoId = (uploadOrFile as any).video ? (uploadOrFile as any).video.id : "";
    const activeActions = isUploadType(uploadOrFile);

    useEffect(() => {
        setShow(isFinished(uploadOrFile))
    }, [uploadOrFile]);

    return (
        debouncedShow
            ? (<Fade in={show} timeout={{enter: 1000}}>
                <>
                    {
                        uploadOrFile.progress === 1 &&
                        !error &&
                        <CheckCircleIcon className={classes.successIcon}/>
                    }

                    {error && <ErrorIcon className={classes.errorIcon}/>}

                    {
                        activeActions && (
                            <>
                                <Divider className={classes.divider} orientation={'vertical'}/>
                                <IconButton
                                    onClick={() => dispatch(Creators.removeUpload({id: videoId}))}
                                >
                                    <DeleteIcon color={'primary'}/>
                                </IconButton>
                                <IconButton
                                    component={Link}
                                    to={`/videos/${videoId}/edit`}
                                >
                                    <EditIcon color={'primary'}/>
                                </IconButton>
                            </>
                        )}
                </>
            </Fade>)
            : null
    );
};

export default UploadActions;