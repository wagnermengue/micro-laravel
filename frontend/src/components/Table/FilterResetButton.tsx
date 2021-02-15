// @flow 
import * as React from 'react';
import {IconButton, Tooltip, makeStyles} from "@material-ui/core";
import {ClearAll} from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
    iconButton: (theme as any).overrides.MUIDataTableToolbar.icon
}));

interface FilterResetButtonProps {
    handleClick: () => void;
}

export const FilterResetButton: React.FC<FilterResetButtonProps> = (props) => {
    const classes = useStyles()
    return (
        // ainda está setando object [object]
        <Tooltip title={'Limpar busca'}>
            <IconButton className={classes.iconButton} onClick={props.handleClick}>
                <ClearAll />
            </IconButton>
        </Tooltip>
    );
};