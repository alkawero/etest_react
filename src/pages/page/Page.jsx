import React,{useState,useEffect} from 'react';
import { connect } from "react-redux";
import {showSnackbar} from 'reduxs/actions';
import useStyles from './pageStyle'
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
import ArrowForward from '@material-ui/icons/ArrowForward';
import RightDrawer from 'components/RightDrawer';
import TopDrawer from 'components/TopDrawer';
import PageForm from './PageForm';

import { doGet,doPost,doDelete,doPut,doPatch } from 'apis/api-service';
import Protected from 'components/Protected';
import clsx from 'clsx';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import PageDetail from './PageDetail';
import StatusChip from 'components/StatusChip';
import  TablePagination  from '@material-ui/core/TablePagination';
import SwitchButton from 'components/SwitchButton';
import EditButton from 'components/EditButton';
import DeleteButton from 'components/DeleteButton';
import AddButton from 'components/AddButton';
import RefreshButton from 'components/RefreshButton';
import DetailButton from 'components/DetailButton';
import PopUp from 'components/PopUp';




const Page = (props) => {
    
    const [openTopDrawer, setOpenTopDrawer] = useState(false)
    const [openRightDrawer, setOpenRightDrawer] = useState(false)
    const [rightDrawerTittle, setRightDrawerTittle] = useState('')
    const [topDrawerTittle, setTopDrawerTittle] = useState('')
    const [TopDrawerContent, setTopDrawerContent] = useState(null)
    const [RightDrawerContent, setRightDrawerContent] = useState(null)
    
    const [filterAnchor, setFilterAnchor] = useState(null)
    const [rowsPerHalaman, setRowsPerHalaman] = useState(10)    
    const [pageData, setPageData] = useState([])
    const [refresh, setRefresh] = useState(1)
    const [halaman, setHalaman] = useState(1)
    const [totalRows, setTotalRows] = useState(0)
    
    const md = useMediaQuery('(min-width:570px)');
    const xl = useMediaQuery('(min-width:1000px)');
    const dimension = {md:md,xl:xl}    
    
    const classes = useStyles({dimension})
    
    useEffect(() => {
        getPage()
      },[refresh,rowsPerHalaman,halaman]);
    
    const refreshPage =()=>{
        setRefresh(refresh+1)
    }
    
    const getPage = async()=>{
        const params={pageNum:rowsPerHalaman}
        const response = await doGet('page?page='+halaman,params)
        if(!response.error){
            setTotalRows(response.data.total)
            setPageData(response.data.data) 
        }
        
    }

    const getPageById = async(pageId)  =>{
        const response = await doGet('page/'+pageId)
        if(!response.error){
            return response.data
        }    
    }

    const addButtonClick = ()=>{
        setRightDrawerContent(<PageForm create={create} onClose={closeRightDrawer}/>)
        setOpenRightDrawer(true)
        setRightDrawerTittle('Add New Page')
    }
            
    const closeTopDrawer = ()=>{
        setOpenTopDrawer(false)
    }

    const closeRightDrawer = ()=>{
        setOpenRightDrawer(false)
    }

    const create= async(p)=>{
        await doPost('page',p,'save page') 
        setRefresh(refresh+1)              
    }

    const update= async(p)=>{
        await doPut('page',p,'save page') 
        setRefresh(refresh+1)              
    }

    const toggle= async(p)=>{
        const newObject = {
            ...p,
            status:p.status===0?1:0
        }
        await doPatch('page/toggle',newObject,'save page') 
        setRefresh(refresh+1)              
    }
    

    const filterClick= (event)=> {
        setFilterAnchor(filterAnchor ? null : event.currentTarget);
    }

    const detail= async(p)=>{
        const page = await getPageById(p.id)         
        setTopDrawerContent( <PageDetail page={page} />)
        setOpenTopDrawer(true)
        setTopDrawerTittle('Page Detail')
    }
    const edit= async(p)=>{
        const page = await getPageById(p.id) 
        setRightDrawerContent(<PageForm update={update} page={page} onClose={closeRightDrawer}/>)
        setOpenRightDrawer(true)
        setRightDrawerTittle('Edit Page')
    }
    
    const deleteById=async (p)=>{
        await doDelete('page',p,'delete page')
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
                <Protected current={currentAccess} only='W'>
                    <AddButton  text='Add Page' action={addButtonClick} classes={classes.bigAddButton}/>
                </Protected>
                
            </Grid>
        </Grid>
        <Grid container justify='space-between' className={classes.content_wrapper}>
            <Grid item xs={12} className={classes.content}>
                <Paper >
                    <Table className={classes.table}>
                        <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Path</TableCell>
                            <TableCell>Tittle</TableCell>
                            <TableCell>Status</TableCell>                            
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {pageData.map(row => (
                            <TableRow key={row.id}  className={classes.tableRow}>
                                
                            <TableCell>                                 
                                {row.navigation}
                            </TableCell>
                            <TableCell >{row.path}</TableCell>
                            <TableCell>{row.tittle}</TableCell>
                            <TableCell>
                                    <div className={clsx(classes.actionWrapper,'actionWrapper')}>
                                        <Protected current={currentAccess} only='R'>
                                            <DetailButton tooltip='detail' action={()=>detail(row)} classes={classes.floatButton}/>
                                        </Protected>
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
        <TopDrawer tittle={topDrawerTittle} open={openTopDrawer} close={closeTopDrawer}>
            {TopDrawerContent}
        </TopDrawer>
        <RightDrawer tittle={rightDrawerTittle} open={openRightDrawer} close={closeRightDrawer}>
            {RightDrawerContent}            
        </RightDrawer>
        <PopUp anchor={filterAnchor} position={'left-start'}>            
                <Grid container className={classes.filterContainer}>
                    <Grid item xs={10} container className={classes.filterActions}>
                        <Grid item xs={2}>
                            some filter here! there also there there
                        </Grid>
                        
                    </Grid>
                    <Grid item xs={1}container alignItems='center'>
                        <IconButton onClick={props.close} className={classes.arrowButton} size="medium">
                            <ArrowForward fontSize="inherit" />
                        </IconButton>
                    </Grid>  
                </Grid>            
        </PopUp>
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


export default  connect(mapStateToProps,mapDispatchToProps)(Page);