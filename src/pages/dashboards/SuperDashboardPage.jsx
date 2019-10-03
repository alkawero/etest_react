import React from 'react';
import { connect } from "react-redux";
import useStyles from './dashboardStyle'
import Grid from '@material-ui/core/Grid';
import Paper  from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import FilterList from '@material-ui/icons/FilterList';



const SuperDashboardPage = (props) => {
    const classes = useStyles()
    const rows = [
        createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
        createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
        createData('Eclair', 262, 16.0, 24, 6.0),
        createData('Cupcake', 305, 3.7, 67, 4.3),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
      ];
    const ar = [1,2,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    
    return(
        <>
        <Grid container justify='center' alignContent='center' className={classes.header}>
            welcome again !!!       
        </Grid>
        </>
    )
}

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const mapStateToProps = state => {
    return {
        user    : state.user,
        ui      : state.ui
     };
  }
const mapDispatchToProps = dispatch => {
    return {      
              
    }
}


export default  connect(mapStateToProps,mapDispatchToProps)(SuperDashboardPage);