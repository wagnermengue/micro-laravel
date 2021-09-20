
import * as React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {
    Card,
    CardContent, Divider,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary, Grid, List,
    Theme,
    Typography
} from "@material-ui/core";
import {Page} from "../../components/Page";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import UploadItem from "./UploadItem";

const useStyles = makeStyles((theme: Theme) => ({
    panelSummary: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText
    },
    expandedIcon: {
        color: theme.palette.primary.contrastText
    }
}));

const Upload = () => {
    const classes = useStyles();

    return (
        <Page title={'Uploads'}>
            <Card elevation={5}>
                <CardContent>
                    <UploadItem>
                        Vídeo - E o levou o vento
                    </UploadItem>
                    <ExpansionPanel style={{margin: 0}}>
                        <ExpansionPanelSummary
                            className={classes.panelSummary}
                            expandIcon={<ExpandMoreIcon className={classes.expandedIcon} />}
                        >
                            <Typography>Ver detalhes</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <Grid item xs={12}>
                                <List dense={true} style={{padding: '0px'}}>
                                    <Divider />
                                    <UploadItem>
                                        Principal | nome do arquivo.mp4
                                    </UploadItem>
                                </List>
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </CardContent>
            </Card>
        </Page>
    );
};

export default Upload;