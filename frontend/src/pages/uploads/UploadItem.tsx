import * as React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Divider, Grid, ListItem, ListItemIcon, ListItemText, Theme, Tooltip, Typography} from "@material-ui/core";
import MovieIcon from "@material-ui/icons/Movie";
import ImageIcon from "@material-ui/icons/Image";
import UploadActions from "./UploadActions";
import UploadProgress from "../../components/UploadProgress";

const useStyles = makeStyles((theme: Theme) => ({
    gridTitle: {
        display: 'flex',
        color: '#999999',
        height: '53px',
    },
    icon: {
        color: theme.palette.error.main,
        minWidth: '40px'
    }
}));

interface UploadItemProps {
    
};

const UploadItem: React.FC<UploadItemProps> = (props) => {
    const classes = useStyles();

    function makeIcon() {
        if (true) {
            return <MovieIcon className={classes.icon} />
        }
        return <ImageIcon className={classes.icon} />
    }

    return (
        <ListItem>
            <Grid container alignItems={'center'}>
                <Grid
                    className={classes.gridTitle}
                    item
                    xs={12}
                    md={9}
                >
                    {makeIcon()}
                    <Typography color={"inherit"}>
                        {props.children}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Grid
                        container
                        direction={"row"}
                        alignItems={'center'}
                        justify={"flex-end"}
                    >
                        <UploadProgress size={48} />
                        <UploadActions />
                    </Grid>
                </Grid>
            </Grid>
        </ListItem>
    );
};

export default UploadItem;