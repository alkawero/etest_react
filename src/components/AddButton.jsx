import React from 'react'
import Add from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button'; 
import  IconButton   from '@material-ui/core/IconButton';
import Tooltip  from '@material-ui/core/Tooltip';

const AddButton = ({action,text,tooltip,classes }) => {
    if(text){
      return(
        <Button size='small'  onClick={action} variant="contained" color="secondary" className={classes}>
            <Add/>
            {text}        
        </Button>)
    }else{
      return(
            <Tooltip title={tooltip}>
              <IconButton onClick={action} size="medium" className={classes}>
                  <Add fontSize="inherit" />
              </IconButton>
            </Tooltip>)
    }

    
    
}

export default AddButton;

