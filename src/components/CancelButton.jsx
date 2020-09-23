import React from 'react';
import Cancel  from '@material-ui/icons/Cancel';
import IconButton   from '@material-ui/core/IconButton';
import Tooltip  from '@material-ui/core/Tooltip';

const CancelButton = ({action,classes,tooltip}) => {
    return  (
        <Tooltip title={tooltip}>
            <IconButton onClick={action} className={classes}>
                <Cancel style={{color:'red'}}/>
            </IconButton>
        </Tooltip>    );
}

export default CancelButton;