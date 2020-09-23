import React from 'react';
import Edit  from '@material-ui/icons/Edit';
import IconButton   from '@material-ui/core/IconButton';
import Tooltip  from '@material-ui/core/Tooltip';

const EditButton = ({action,classes,tooltip}) => {
    return  (
        <Tooltip title={tooltip}>
            <IconButton onClick={action} className={classes}>
                <Edit/>
            </IconButton>
        </Tooltip>    );
}

export default EditButton;