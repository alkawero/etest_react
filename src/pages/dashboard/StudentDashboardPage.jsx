import React from 'react';
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



const StudentDashboardPage = (props) => {
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
    return(
        <>
        <Grid container justify='space-between' className={classes.header}>
            <Grid item xs={10} sm={6} className={classes.headerTittle}>
                <Typography variant="h6">
                    Tittle of Your Module
                </Typography>
            </Grid>            
            <Grid container wrap='nowrap' justify='flex-end' item xs={2} className={classes.headerToolbar}>
                <IconButton className={classes.iconButton} size="medium">
                    <FilterList fontSize="inherit" />
                </IconButton>
                <IconButton className={classes.iconButton} size="medium">
                    <FilterList fontSize="inherit" />
                </IconButton>
            </Grid>
        </Grid>
        <Grid container justify='space-between' className={classes.content_wrapper}>
            <Grid item xs={12} className={classes.content}>
                <Paper >
                <Table className={classes.table}>
                    <TableHead>
                    <TableRow>
                        <TableCell>Dessert (100g serving)</TableCell>
                        <TableCell align="right">Calories</TableCell>
                        <TableCell align="right">Fat&nbsp;(g)</TableCell>
                        <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                        <TableCell align="right">Protein&nbsp;(g)</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map(row => (
                        <TableRow key={row.name}>
                        <TableCell component="th" scope="row">
                            {row.name}
                        </TableCell>
                        <TableCell align="right">{row.calories}</TableCell>
                        <TableCell align="right">{row.fat}</TableCell>
                        <TableCell align="right">{row.carbs}</TableCell>
                        <TableCell align="right">{row.protein}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </Paper>
            </Grid>            
        </Grid>
        </>
    )
}

export default StudentDashboardPage

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }