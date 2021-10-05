import * as React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Divider, ListItem, ListItemIcon, ListItemText, Theme, Tooltip, Typography} from "@material-ui/core";
import MovieIcon from "@material-ui/icons/Movie";
import UploadProgress from "../UploadProgress";
import {Upload} from "../../store/upload/types";
import UploadActions from "./UploadActions";
import {hasError} from "../../store/upload/getters";
import {useState} from "react";

const useStyles = makeStyles((theme: Theme) => ({
    listItem: {
        paddingTop: '7px',
        paddingBottom: '7px',
        height: '53px',
    },
    listItemText: {
        marginLeft: '6px',
        marginRight: '24px',
        color: theme.palette.text.secondary,
    },
    movieIcon: {
        color: theme.palette.error.main,
        minWidth: '40px'
    }
}));

interface UploadItemProps {
    upload: Upload;
}

const UploadItem: React.FC<UploadItemProps> = (props) => {
    const {upload} = props;
    const classes = useStyles();
    const error = hasError(upload);
    const [itemHover, setItemHover] = useState(false);

    return (
        <>
            <Tooltip
                disableFocusListener
                disableHoverListener
                title={
                    error ? "Não foi possível fazer o upload, clique para mais detalhes" : ""
                }
                placement={"left"}
            >
                <ListItem
                    className={classes.listItem}
                    button
                    onMouseOver={() => setItemHover(true)}
                    onMouseLeave={() => setItemHover(false)}
                >
                    <ListItemIcon className={classes.movieIcon}>
                        <MovieIcon/>
                    </ListItemIcon>
                    <ListItemText
                        className={classes.listItemText}
                        primary={
                            <Typography noWrap={true} variant={'subtitle2'} color={"inherit"}>
                                {upload.video.title}
                            </Typography>
                        }
                    />
                    <UploadProgress uploadOrFile={upload} size={30}/>
                    <UploadActions upload={upload} hover={itemHover}/>
                </ListItem>
            </Tooltip>
            <Divider component="li" />
        </>
    );
};

export default UploadItem;