import React,{useState,useEffect} from 'react';
import { connect } from "react-redux";
import {showSnackbar} from 'reduxs/actions';
import useStyles from './paramStyle'
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
import RightDrawer from 'components/RightDrawer';
import ParamForm from './ParamForm';

import { doGet,doPost,doDelete,doPut, doPatch } from 'apis/api-service';
import Protected from 'components/Protected';
import clsx from 'clsx';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import StatusChip from 'components/StatusChip';
import  TablePagination  from '@material-ui/core/TablePagination';
import SwitchButton from 'components/SwitchButton';
import EditButton from 'components/EditButton';
import DeleteButton from 'components/DeleteButton';
import AddButton from 'components/AddButton';
import RefreshButton from 'components/RefreshButton';
import FlexibleFilter from 'components/FlexibleFilter';




const ParamPage = (props) => {
    
    
    const [openRightDrawer, setOpenRightDrawer] = useState(false)
    const [rightDrawerTittle, setRightDrawerTittle] = useState('')
    const [RightDrawerContent, setRightDrawerContent] = useState(null)
    
    const [filterAnchor, setFilterAnchor] = useState(null)
    const [filterParams, setFilterParams] = useState({})
    
    const [rowsPerHalaman, setRowsPerHalaman] = useState(10)    
    const [data, setData] = useState([])
    const [refresh, setRefresh] = useState(1)
    const [halaman, setHalaman] = useState(1)
    const [totalRows, setTotalRows] = useState(0)
    const [paramGroups, setParamGroups] = useState([])
    const [filters, setFilters] = useState([
        {type:'simple-select',data:[],placeholder:'group', as_params:'group'},
        {type:'simple-text',placeholder:'key', as_params:'key'}, 
        {type:'simple-text',placeholder:'value',as_params:'value'},        
    ])

    const md = useMediaQuery('(min-width:570px)');
    const xl = useMediaQuery('(min-width:1000px)');
    const dimension = {md:md,xl:xl}    
    
    const classes = useStyles({dimension})
    
    useEffect(() => {
        getGroups()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    useEffect(() => {
        getData(filterParams)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[refresh,rowsPerHalaman,halaman]);
    

    const getGroups = async()=>{
        const response = await doGet('param/groups')        
        const paramGroups = response.data.map(group=>({label:group,value:group}))
        setParamGroups(paramGroups)
        const newFilters = filters.map(filter=>{
            if(filter.placeholder==='group'){
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
        const response = await doGet('param?page='+halaman,params)
        if(!response.error){
            setTotalRows(response.data.total)
            setData(response.data.data) 
        }
        
    }

    const getById = async(id)  =>{
        const response = await doGet('param/'+id)
        if(!response.error){
            return response.data
        }    
    }

    const addButtonClick = ()=>{
        setRightDrawerContent(<ParamForm create={create} groups={paramGroups} onClose={closeRightDrawer}/>)
        setOpenRightDrawer(true)
        setRightDrawerTittle('Add New Parameter')
    }
            
    
    const closeRightDrawer = ()=>{
        setOpenRightDrawer(false)
    }

    const create= async(o)=>{
        await doPost('param',o,'save parameter') 
        setRefresh(refresh+1)              
    }

    const update= async(o)=>{
        await doPut('param',o,'save parameter') 
        setRefresh(refresh+1)              
    }

    const toggle= async(o)=>{
        const newObject = {
            ...o,
            status:o.status===0?1:0
        }
        await doPatch('param/toggle',newObject,'save parameter') 
        setRefresh(refresh+1) 
                
    }
    

    const filterClick= (event)=> {
        setFilterAnchor(filterAnchor ? null : event.currentTarget);
    }

    const edit= async(o)=>{
        const obj = await getById(o.id) 
        setRightDrawerContent(<ParamForm update={update} edited={obj} groups={paramGroups} onClose={closeRightDrawer}/>)
        setOpenRightDrawer(true)
        setRightDrawerTittle('Edit Parameter')
    }
    
    const deleteById=async (o)=>{
        await doDelete('param',o,'delete parameter')
        setRefresh(refresh+1)
    }

    const changeHalaman=(event, newHalaman)=>{
        setHalaman(newHalaman+1)
    }
    
    const changeRowsPerHalaman = (event)=> {
        setRowsPerHalaman(+event.target.value);
        setHalaman(1);
      }

    const currentAccess = props.ui.active_page.access

    return(
        <>
        <Grid wrap='nowrap' container justify='space-between' className={classes.header}>
            <Grid item xs={10} sm={6} className={classes.headerTittle}>
                <Typography variant="h6">
                    {
                        props.ui.active_page.tittle
                    }
                </Typography>
            </Grid>            
            <Grid container wrap='nowrap' justify='flex-end' item xs={5} className={classes.headerToolbar}>
                <IconButton onClick={filterClick} className={classes.iconButton} size="medium">
                    <Search fontSize="inherit" />
                </IconButton>                
                <RefreshButton action={refreshPage} classes={classes.iconButton}/>
                <Protected current={currentAccess} only='C'>
                    <AddButton  text='Add Parameter' action={addButtonClick} classes={classes.bigAddButton}/>
                </Protected>
                
            </Grid>
        </Grid>
        <Grid container justify='space-between' className={classes.content_wrapper}>
            <Grid item xs={12} className={classes.content}>
                <Paper >
                    <Table className={classes.table}>
                        <TableHead>
                        <TableRow>
                            <TableCell>Group</TableCell>
                            <TableCell>Key</TableCell>
                            <TableCell>Value</TableCell>
                            <TableCell>Char Code</TableCell>
                            <TableCell>Number Code</TableCell>                            
                            <TableCell>Description</TableCell>                            
                            <TableCell>Status</TableCell>                            
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {data.map(row => (
                            <TableRow key={row.id}  className={classes.tableRow}>                                
                            <TableCell>{row.group}</TableCell>
                            <TableCell >{row.key}</TableCell>
                            <TableCell >{row.value}</TableCell>
                            <TableCell >{row.char_code}</TableCell>
                            <TableCell>{row.num_code}</TableCell>
                            <TableCell>{row.desc}</TableCell>
                            <TableCell>
                                    <div className={clsx(classes.actionWrapper,'actionWrapper')}>
                                        <Protected current={currentAccess} only='W'>
                                            <SwitchButton tooltip='change status' action={()=>toggle(row)} checked={row.status===1||row.status===true}/>
                                        </Protected>
                                        <Protected current={currentAccess} only='W'>
                                            <EditButton  tooltip='edit' action={()=>edit(row)} classes={classes.floatButton} />
                                        </Protected>
                                        <Protected current={currentAccess}only='D'>
                                            <DeleteButton tooltip='delete' action={()=>deleteById(row)} classes={classes.floatButton}/>
                                        </Protected>                                        
                                    </div>                                
                                <StatusChip status={row.status}/>                                                               
                            </TableCell>
                                
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
        <RightDrawer tittle={rightDrawerTittle} open={openRightDrawer} close={closeRightDrawer}>
            {RightDrawerContent}            
        </RightDrawer>
        <FlexibleFilter 
            anchor={filterAnchor} 
            position='left'
            filters={filters}
            action={getData}            
        />
        </>
    )
}



const mapStateToProps = state => {
    return {
        user    : state.user,
        ui      : state.ui
     };
  }
const mapDispatchToProps = dispatch => {
    return {      
        showSnackbar: (v,t) => dispatch(showSnackbar(v,t))
    }
}


export default  connect(mapStateToProps,mapDispatchToProps)(ParamPage);