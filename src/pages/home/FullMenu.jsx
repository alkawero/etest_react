import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Close from '@material-ui/icons/Close';
import IconButton  from '@material-ui/core/IconButton';

const FullMenu = (props) => {
    const classes = useStyles()
    return (
        <Drawer
        className={classes.drawer}
        anchor="top"
        open={props.open}
        classes={{
          paper: classes.drawerPaper,
        }}
        onClose={props.close}
            > 
            <Grid container>
                <Grid container justify='flex-end' className={classes.header}>
                        <IconButton onClick={props.close} className={classes.closeButton} size="small">
                            <Close fontSize="inherit" />
                        </IconButton>                    
                </Grid>
                <Grid container>
                    {props.children}
                </Grid>                                
            </Grid>
        

        </Drawer>
    );
}

export default FullMenu;

const useStyles = makeStyles(theme => ({    
    drawer:{ 
        
    },
    drawerPaper:{
        border: '1px solid #1269dc',
        borderRadius: '0px 0px 10px 10px',        
    },
    header:{ 
        height:32,
        backgroundColor: '#1269dc',
        color:'white',
        
        
    },closeButton:{
        color:'white',
        margin:'4px 12px 0 0'
    },
    
    
  }));