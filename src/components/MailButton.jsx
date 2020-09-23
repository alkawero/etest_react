import React from 'react';
import Email  from '@material-ui/icons/Email';
import IconButton   from '@material-ui/core/IconButton';
import Tooltip  from '@material-ui/core/Tooltip';
import { useCommonStyles } from "themes/commonStyle";

const MailButton = ({action,classes,tooltip}) => {
    const common = useCommonStyles()
    return  (
        <Tooltip title={tooltip}>
            <IconButton onClick={action} className={classes}>
                <Email/>
            </IconButton>
        </Tooltip>    );
}

export default MailButton;

