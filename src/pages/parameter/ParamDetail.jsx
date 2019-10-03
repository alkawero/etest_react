import React from 'react'
import Grid  from '@material-ui/core/Grid';
import useStyles from './paramStyle'
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import StatusChip from 'components/StatusChip';



const ParamDetail = ({page}) => {
    const classes = useStyles()
    
    if(page){
        return (
            <Paper className={classes.pageDetailPaper}>
                <Grid container justify='space-between' className={classes.pageDetailRoot} >
                    <Grid container>
                        <Grid item xs={3} className={classes.label}>Navigation</Grid>
                        <Grid item xs={9}>
                            <TextField
                                id="Navigation"
                                value={page.navigation}
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
                                value={page.path}
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
                                value={page.tittle}
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
                                value={page.icon}
                                margin="normal"
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Grid container >
                        <Grid item  xs={3} className={classes.label}>Status</Grid>
                        <Grid item>
                            <StatusChip status={page.status}/>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        );
    }else{
        return null
    }
    
}

export default ParamDetail;