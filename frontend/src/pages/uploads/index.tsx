
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
import {useSelector} from "react-redux";
import {UploadModule, Upload as UploadTypes} from "../../store/upload/types";
import {VideoFileFieldMap} from "../../util/models";

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

    const uploads = useSelector<UploadModule, UploadTypes[]>(
        (state) => state.upload.uploads
    );

    return (
        <Page title={'Uploads'}>
            {
                uploads.map((upload, key) => (
                    <Card elevation={5}>
                        <CardContent>
                            <UploadItem uploadOrFile={upload}>
                                {upload.video.title}
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
                                            {
                                                upload.files.map((file, key) => (
                                                    <React.Fragment key={key}>
                                                        <Divider />
                                                        <UploadItem uploadOrFile={file}>
                                                            {`${VideoFileFieldMap[file.fileField]} - ${file.fileName}`}
                                                        </UploadItem>
                                                    </React.Fragment>
                                                ))
                                            }
                                        </List>
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </CardContent>
                    </Card>
                ))
            }
        </Page>
    );
};

export default Upload;