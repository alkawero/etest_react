import React from 'react';  
import Refresh  from '@material-ui/icons/Refresh';
import  IconButton   from '@material-ui/core/IconButton'; 

const RefreshButton = ({action,classes}) => {
    return  (
        <IconButton onClick={action} className={classes} size="medium">
            <Refresh fontSize="inherit" />
        </IconButton>); 
}

export default RefreshButton;
