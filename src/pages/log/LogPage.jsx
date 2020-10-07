import React,{useState,useEffect} from 'react';

import useStyles from './logStyle'
import Grid from '@material-ui/core/Grid';
import Paper  from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Search from '@material-ui/icons/Search';
import { doGet } from 'apis/api-service';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import  TablePagination  from '@material-ui/core/TablePagination';
import RefreshButton from 'components/RefreshButton';
import FlexibleFilter from 'components/FlexibleFilter';
import { useSelector } from "react-redux";




const LogPage = (props) => {
    
    const ui = useSelector(state => state.ui);
    const user = useSelector(state => state.user);  
    const [filterAnchor, setFilterAnchor] = useState(null)
    const [filterParams, setFilterParams] = useState({})
    
    const [rowsPerHalaman, setRowsPerHalaman] = useState(10)    
    const [data, setData] = useState([])
    const [refresh, setRefresh] = useState(1)
    const [halaman, setHalaman] = useState(1)
    const [totalRows, setTotalRows] = useState(0)
    const [paramGroups, setParamGroups] = useState([])
    const [filters, setFilters] = useState([
        {type:'simple-select',data:[],placeholder:'case', as_param:"case_code"},
        {type:'simple-text',placeholder:'user id', as_param:"user_id"}, 
    ])

    const md = useMediaQuery('(min-width:570px)');
    const xl = useMediaQuery('(min-width:1000px)');
    const dimension = {md:md,xl:xl}    
    
    const classes = useStyles({dimension})
    
    const getHeaders = ()=> {
        return {"Authorization": user.token}    
      }


    useEffect(() => {
        getGroups()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    useEffect(() => {
        getData(filterParams)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[refresh,rowsPerHalaman,halaman]);
    

    const getGroups = async()=>{
        const params = {group:"log_case"}
        
        const response = await doGet("param", params, getHeaders());                
        const paramGroups = response.data.map(group=>({label:group.value,value:group.num_code}))
        setParamGroups(paramGroups)
        const newFilters = filters.map(filter=>{
            if(filter.placeholder==='case'){
                return {...filter,data:paramGroups}
            }else{
                return filter
            }                
        })
        setFilters(newFilters)
    }

    
    const refreshPage =()=>{
        setRefresh(refresh+1)
    }
    
    const getData = async(paramsFromFilter)=>{
        const params={pageNum:rowsPerHalaman,...paramsFromFilter}
                
        const response = await doGet('log?page='+halaman,params,getHeaders())
        if(!response.error){
            setTotalRows(response.data.meta.total)
            setData(response.data.data) 
        }
        
    }

    const filterClick= (event)=> {
        setFilterAnchor(filterAnchor ? null : event.currentTarget);
    }
    

    const changeHalaman=(event, newHalaman)=>{
        setHalaman(newHalaman+1)
    }
    
    const changeRowsPerHalaman = (event)=> {
        setRowsPerHalaman(+event.target.value);
        setHalaman(1);
      }

    return(
        <>
        <Grid wrap='nowrap' container justify='space-between' className={classes.header}>
            <Grid item xs={10} sm={6} className={classes.headerTittle}>
                <Typography variant="h6">
                    {
                        ui.active_page.tittle
                    } 
                </Typography>
            </Grid>            
            <Grid container wrap='nowrap' justify='flex-end' item xs={5} className={classes.headerToolbar}>
                <IconButton onClick={filterClick} className={classes.iconButton} size="medium">
                    <Search fontSize="inherit" />
                </IconButton>                
                <RefreshButton action={refreshPage} classes={classes.iconButton}/>                
                
            </Grid>
        </Grid>
        <Grid container justify='space-between' className={classes.content_wrapper}>
            <Grid item xs={12} className={classes.content}>
                <Paper >
                    <Table className={classes.table}>
                        <TableHead>
                        <TableRow>
                            <TableCell>User ID</TableCell>
                            <TableCell>User Name</TableCell>
                            <TableCell>Case</TableCell>
                            <TableCell>Data</TableCell>
                            <TableCell>object_id</TableCell>
                            <TableCell>Created</TableCell>                         
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {data.map(row => (
                            <TableRow key={row.id}  className={classes.tableRow}>                                
                            <TableCell>{row.user_id}</TableCell>
                            <TableCell>{row.user_name}</TableCell>
                            <TableCell >{row.case}</TableCell>
                            <TableCell >{row.data}</TableCell>
                            <TableCell >{row.object_id}</TableCell>
                            <TableCell>{row.created_at}</TableCell>                                
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={totalRows}
                        rowsPerPage={rowsPerHalaman}
                        page={halaman-1}
                        backIconButtonProps={{
                            'aria-label': 'previous page',
                        }}
                        nextIconButtonProps={{
                            'aria-label': 'next page',
                        }}
                        onChangePage={changeHalaman}
                        onChangeRowsPerPage={changeRowsPerHalaman}
                    />    

                    </Paper>
            </Grid>            
        </Grid>
        <FlexibleFilter 
            anchor={filterAnchor} 
            position='left'
            filters={filters}
            action={getData}
        />
        </>
    )
}



export default  LogPage;