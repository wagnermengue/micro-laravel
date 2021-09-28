import * as React from 'react';
import {Divider, Fade, IconButton, ListItemSecondaryAction, Theme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import ErrorIcon from "@material-ui/icons/Error";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import {Link} from "react-router-dom";
import {FileUpload, Upload} from "../../store/upload/types";
import {useDispatch} from "react-redux";
import {Creators} from "../../store/upload";

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

    return (
        <Fade in={true} timeout={{enter: 1000}}>
            <>
                {
                    uploadOrFile.progress === 1 && (
                        <CheckCircleIcon  className={classes.successIcon} />
                    )
                }
                <ErrorIcon className={classes.errorIcon} />
                <>
                    <Divider className={classes.divider} orientation={'vertical'} />
                    <IconButton
                        onClick={() => Creators.removeUpload({id: (uploadOrFile as any).video.id})}
                    >
                        <DeleteIcon color={'primary'} />
                    </IconButton>
                    <IconButton
                        component={Link}
                        to={'/videos/uuid/edit'}
                    >
                        <EditIcon color={'primary'} />
                    </IconButton>
                </>
            </>
        </Fade>
    );
};

export default UploadActions;