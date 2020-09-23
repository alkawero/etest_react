import React from 'react';
import Delete  from '@material-ui/icons/Delete';
import DeleteForever  from '@material-ui/icons/DeleteForever';
import  IconButton   from '@material-ui/core/IconButton';
import Tooltip  from '@material-ui/core/Tooltip';
import Button  from '@material-ui/core/Button';
import Fade  from '@material-ui/core/Fade';
import Paper  from '@material-ui/core/Paper';
import Popper  from '@material-ui/core/Popper';

const DeleteButton = ({action,classes,tooltip})=>{
    const [anchorEl, setAnchorEl] = React.useState(null);

    function confirmation(event) {
        setAnchorEl(anchorEl ? null : event.currentTarget);
      }
    
      const open = Boolean(anchorEl);
      
    const cancel=()=>{
        setAnchorEl(null)
    }
    const deleteNow=()=>{
        action()
        setAnchorEl(null)
    }
    return  (
        <>
            <Tooltip title={tooltip}>
                <IconButton onClick={confirmation} className={classes}>
                    <Delete/>
                </IconButton>
            </Tooltip>
            <Popper id='confirm popper' open={open} anchorEl={anchorEl} transition style={{zIndex:1100}}>
            {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
                <Paper style={{padding:8}}>
                    <span>Are you sure ? </span>
                    <Button onClick={cancel}>Cancel</Button>
                    <Tooltip title='delete now'>
                        <IconButton onClick={deleteNow} className={classes} style={{color:'red'}}>
                            <DeleteForever/>
                        </IconButton>            
                    </Tooltip>        
                </Paper>
            </Fade>
            )}
            </Popper>
        </>
        );
}

export default DeleteButton