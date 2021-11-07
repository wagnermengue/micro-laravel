// @flow 
import * as React from 'react';
import {Grid, GridProps, makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
        gridItem: {
            margin: theme.spacing(1, 0)
        },
    })
);

interface DefaultFormProps extends React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, any> {
    GridContainerProps?: GridProps;
    GridItemProps?: GridProps;
}

export const DefaultForm: React.FC<DefaultFormProps> = (props) => {

    const classes = useStyles();
    const {GridContainerProps, GridItemProps, ...others} = props;

    return (
        <form {...others}>
            <Grid container {...GridContainerProps}>
                <Grid item className={classes.gridItem} {...GridItemProps}>
                    {props.children}
                </Grid>
            </Grid>
        </form>
    );
};