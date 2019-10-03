import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Typography from '@material-ui/core/Typography';

const BottomDrawer = (props) => {
    const classes = useStyles()
    return (
        <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="bottom"
        open={props.open}
        classes={{
          paper: classes.drawerPaper,
        }}
        > 
        
        <Grid container justify='center' className={classes.drawerContainer}>
                <Grid container className={classes.header}>
                    <Grid item xs={6}>
                        <Typography variant='h6'>{props.tittle}</Typography>
                    </Grid>
                    <Grid item xs={6} container>
                        <IconButton onClick={props.close} className={classes.arrowButton} size="medium">
                            <ArrowDownward fontSize="inherit" />
                        </IconButton>
                    </Grid> 
                </Grid>
                {props.children!==null && React.cloneElement(props.children, { open: props.open})}
                            
        </Grid>

        </Drawer>
    );
}

export default BottomDrawer;

const useStyles = makeStyles(theme => ({    
    drawerPaper:{ 
        display:'flex',
        justifyContent:'center',
        background:'white',
        flexDirection:'row'
        //opacity: '0.1'
    },
    drawerContainer:{
        borderRadius: '0px 0px 10px 10px',
        border: '1px solid #1269dc',
        minWidth:300,
        height:'fit-content'
        
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