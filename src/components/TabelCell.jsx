import React from 'react';
import { withStyles} from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';

const TabelCell = withStyles(theme => ({
    head: {
      backgroundColor: props=>props.color,
      color: 'white',
      borderRadius:props=>props.radius
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

  export default TabelCell