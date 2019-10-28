import React from 'react'
import Grid  from '@material-ui/core/Grid';
import useStyles from './mathStyle'
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MathDisplay from 'components/MathDisplay';



const MathDetail = ({math}) => {
    const classes = useStyles()
    
    if(math){
        return (
            <Paper className={classes.pageDetailPaper}>
                <Grid container justify='space-between' className={classes.pageDetailRoot} >
                    <Grid container>
                        <Grid item xs={3} className={classes.label}>Html Code</Grid>
                        <Grid item xs={9}>
                            <TextField
                                id="Navigation"
                                value={math.html_symbol}
                                margin="normal"
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Grid container >
                        <Grid item xs={3} className={classes.label}>Icon Display</Grid>
                        <Grid item xs={9}>
                        <span dangerouslySetInnerHTML={{__html: math.html_symbol}}/>
                        </Grid>
                    </Grid>
                    <Grid container >
                        <Grid item xs={3} className={classes.label}>Asciimath</Grid>
                        <Grid item xs={9}>
                            <TextField
                                id="Path"
                                value={math.asciimath}
                                margin="normal"
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Grid container >
                        <Grid item  xs={3} className={classes.label}>Asciimath Result</Grid>
                        <Grid item>
                        <MathDisplay value={'\`'+math.asciimath+'\`'} />
                        </Grid>
                    </Grid>
                    <Grid container >
                        <Grid item xs={3} className={classes.label}>Latex</Grid>
                        <Grid item xs={9}>
                            <TextField
                                id="icon"
                                value={math.latex}
                                margin="normal"
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Grid container >
                        <Grid item  xs={3} className={classes.label}>Latex Result</Grid>
                        <Grid item>
                        <MathDisplay value={'$'+math.latex+'$'} />
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        );
    }else{
        return null
    }
    
}

export default MathDetail;