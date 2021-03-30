import * as React from 'react';
import {Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    root: {
        width: "36px",
        height: "36px",
        fontSize: "1.2em",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
    }
});

const backgroundColors = {
    'L':  '#33e913',
    '10':  '#1f85f3',
    '12':  '#c8b14a',
    '14':  '#ee8217',
    '16':  '#ff0000',
    '18':  '#000000',
};

interface RatingProps {
    rating: 'L' | '10' | '12' | '14' | '16' | '18'
}


const Rating: React.FC<RatingProps> = (props) => {
    const classes = useStyles();
    return (
        <Typography
            className={classes.root}
            style={{
                backgroundColor: backgroundColors[props.rating]
            }}
        >
            {props.rating}
        </Typography>
    );
};

export default Rating;