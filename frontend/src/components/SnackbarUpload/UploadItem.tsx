import * as React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Divider, ListItem, ListItemIcon, ListItemText, Theme, Tooltip, Typography} from "@material-ui/core";
import MovieIcon from "@material-ui/icons/Movie";

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
    
};

const UploadItem: React.FC<UploadItemProps> = (props) => {
    const classes = useStyles();

    return (
        <>
            <Tooltip
                title={"Não foi possível fazer o upload, clique para mais detalhes"}
                placement={"left"}
            >
                <ListItem
                    className={classes.listItem}
                    button
                >
                    <ListItemIcon className={classes.movieIcon}>
                        <MovieIcon/>
                    </ListItemIcon>
                    <ListItemText
                        className={classes.listItemText}
                        primary={
                            <Typography noWrap={true} variant={'subtitle2'} color={"inherit"}>
                                E o vento levou!!!
                            </Typography>
                        }
                    />
                </ListItem>
            </Tooltip>
            <Divider component="li" />
        </>
    );
};

export default UploadItem;