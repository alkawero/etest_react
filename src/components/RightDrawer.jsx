import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ArrowForward from '@material-ui/icons/ArrowForward';

import Typography from '@material-ui/core/Typography';


const RightDrawer = (props) => {
    const classes = useStyles()
    return (
        <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={props.open}
        classes={{
          paper: classes.drawerPaper,
        }}
        >
            <Grid container justify='center'>
                <Grid container className={classes.header}>
                    <Grid item xs={6}>
                        <Typography variant='h6'>{props.tittle}</Typography>
                    </Grid>
                    <Grid item xs={6} container>
                        <IconButton onClick={props.close} className={classes.arrowButton} size="medium">
                            <ArrowForward fontSize="inherit" />
                        </IconButton>
                    </Grid> 
                </Grid>
                {props.children}
                            
            </Grid>
        
         
        </Drawer>
    );
}

export default RightDrawer;

const useStyles = makeStyles(theme => ({    
    drawer:{ 
        
    },
    drawerPaper:{
        width:400,
        height:'100vh',
        border: '1px solid #1269dc',
        borderRadius: '0px 0px 10px 10px',
        
    },
    header:{ 
        height:68,
        backgroundColor: '#1269dc',
        color:'white',
        padding:12
        
    },arrowButton:{
        color:'white',
        margin:'0 0 auto auto'
    },
    
    
  }));