import React from 'react'
import Grid  from '@material-ui/core/Grid';
import useStyles from './reviewerStyle'
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import StatusChip from 'components/StatusChip';



const ReviewerDetail = ({reviewer}) => {
    const classes = useStyles()
    
    if(reviewer){
        return (
            <Paper className={classes.pageDetailPaper}>
                <Grid container justify='space-between' className={classes.pageDetailRoot} >
                    <Grid container>
                        <Grid item xs={3} className={classes.label}>Navigation</Grid>
                        <Grid item xs={9}>
                            <TextField
                                id="Navigation"
                                value={reviewer.navigation}
                                margin="normal"
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Grid container >
                        <Grid item xs={3} className={classes.label}>Path</Grid>
                        <Grid item xs={9}>
                            <TextField
                                id="Path"
                                value={reviewer.path}
                                margin="normal"
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Grid container >
                        <Grid item xs={3} className={classes.label}>Tittle</Grid>
                        <Grid item xs={9}>
                            <TextField
                                id="Path"
                                value={reviewer.tittle}
                                margin="normal"
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Grid container >
                        <Grid item xs={3} className={classes.label}>Icon</Grid>
                        <Grid item xs={9}>
                            <TextField
                                id="icon"
                                value={reviewer.icon}
                                margin="normal"
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Grid container >
                        <Grid item  xs={3} className={classes.label}>Status</Grid>
                        <Grid item>
                            <StatusChip status={reviewer.status}/>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        );
    }else{
        return null
    }
    
}

export default ReviewerDetail;