import React from 'react'
import { makeStyles } from '@material-ui/styles';

import Chip from '@material-ui/core/Chip';

const StatusChip = ({status}) => {
    
    const label = status===1 || status===true ?'Active':'Inactive'
    const color = status===1 || status===true ?'#16cd90':'grey'
    const classes = useStyles({color})
    return (
        <Chip size="small" label={label} className={classes.chip} />                        
    );
}

const useStyles = makeStyles(theme => ({    
    chip:{
      backgroundColor:({color})=>{return color;},
      color:'white'
    }
    
  }));

export default StatusChip;