import React from 'react';
import Check  from '@material-ui/icons/Check';
import  IconButton   from '@material-ui/core/IconButton';
import Tooltip  from '@material-ui/core/Tooltip';


const CheckButton = ({action,classes,tooltip}) => {
    return  (
        <Tooltip title={tooltip}>
            <IconButton onClick={action} className={classes}>
                <Check/>
            </IconButton>
        </Tooltip>    );
}

export default CheckButton;
