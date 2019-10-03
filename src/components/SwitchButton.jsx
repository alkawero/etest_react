import React from 'react'; 
import Tooltip  from '@material-ui/core/Tooltip'; 
import Switch  from '@material-ui/core/Switch'; 

const SwitchButton = ({action,checked, tooltip}) => {
    return  (
                <Tooltip title={tooltip}>
                <Switch
                    checked={checked}
                    onChange={action}
                    color="primary"
                    inputProps={{ 'aria-label': tooltip }}
                />
                </Tooltip>); 
}

export default SwitchButton;
