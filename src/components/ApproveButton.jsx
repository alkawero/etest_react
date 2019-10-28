import React from 'react';
import CheckCircle  from '@material-ui/icons/CheckCircle';
import IconButton   from '@material-ui/core/IconButton';
import Tooltip  from '@material-ui/core/Tooltip';
import { useCommonStyles } from "themes/commonStyle";

const ApproveButton = ({action,classes,tooltip}) => {
    const common = useCommonStyles()
    return  (
        <Tooltip title={tooltip}>
            <IconButton onClick={action} className={classes}>
                <CheckCircle style={{color:'#15cd8f'}}/>
            </IconButton>
        </Tooltip>    );
}

export default ApproveButton;

