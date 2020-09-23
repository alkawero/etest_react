import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';

const PopUp = ({anchor,children,position}) => {
    const classes = useStyles();
    
    const open = Boolean(anchor);
    const id = open ? 'popUp-container' : undefined;

    return (
        <Popper placement={position} id={id} open={open} anchorEl={anchor} transition style={{zIndex:1200}}>
            {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
                <Paper>
                {children}
                </Paper>
            </Fade>
            )}
        </Popper>        
    );
}

export default PopUp;

const useStyles = makeStyles(theme => ({
    
    typography: {
      padding: theme.spacing(2),
    },
  }));