import React from 'react';
import Fullscreen  from '@material-ui/icons/Fullscreen';
import  IconButton   from '@material-ui/core/IconButton';
import Tooltip  from '@material-ui/core/Tooltip';


const DetailButton = ({action,classes,tooltip}) => {
    return  (
        <Tooltip title={tooltip}>
            <IconButton onClick={action} className={classes}>
                <Fullscreen/>
            </IconButton>
        </Tooltip>    );
}

export default DetailButton;
