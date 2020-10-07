import React,{useState,useEffect} from 'react';
import { useSelector } from "react-redux";
import useStyles from './mathStyle'
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
import MathForm from './MathForm';

import { doGet,doPost,doDelete,doPut,doPatch } from 'apis/api-service';
import Protected from 'components/Protected';
import clsx from 'clsx';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MathDetail from './MathDetail';
import  TablePagination  from '@material-ui/core/TablePagination';
import SwitchButton from 'components/SwitchButton';
import EditButton from 'components/EditButton';
import DeleteButton from 'components/DeleteButton';
import AddButton from 'components/AddButton';
import RefreshButton from 'components/RefreshButton';
import DetailButton from 'components/DetailButton';
import PopUp from 'components/PopUp';
import MathDisplay from 'components/MathDisplay';




const MathPage = (props) => {
    
    const user = useSelector(state => state.user);
    const ui = useSelector(state => state.ui);
    const [openTopDrawer, setOpenTopDrawer] = useState(false)
    const [openRightDrawer, setOpenRightDrawer] = useState(false)
    const [rightDrawerTittle, setRightDrawerTittle] = useState('')
    const [topDrawerTittle, setTopDrawerTittle] = useState('')
    const [TopDrawerContent, setTopDrawerContent] = useState(null)
    const [RightDrawerContent, setRightDrawerContent] = useState(null)
    
    const [filterAnchor, setFilterAnchor] = useState(null)
    const [rowsPerHalaman, setRowsPerHalaman] = useState(10)    
    const [mathData, setMathData] = useState([])
    const [refresh, setRefresh] = useState(1)
    const [halaman, setHalaman] = useState(1)
    const [totalRows, setTotalRows] = useState(0)
    
    const md = useMediaQuery('(min-width:570px)');
    const xl = useMediaQuery('(min-width:1000px)');
    const dimension = {md:md,xl:xl}    
    
    const classes = useStyles({dimension})
    
    const getHeaders = ()=> {
        return {"Authorization": user.token}    
      }
    
    useEffect(() => {
        getMath()
      },[refresh,rowsPerHalaman,halaman]);
    
    const refreshPage =()=>{
        setRefresh(refresh+1)
    }
    
    const getMath = async()=>{
        const params={pageNum:rowsPerHalaman}
                
        const response = await doGet('math?page='+halaman,params,getHeaders())
        if(!response.error){
            setTotalRows(response.data.total)
            setMathData(response.data.data) 
        }
        
    }
    

    const addButtonClick = ()=>{
        setRightDrawerContent(<MathForm create={create} onClose={closeRightDrawer}/>)
        setOpenRightDrawer(true)
        setRightDrawerTittle('Add New Math')
    }
            
    const closeTopDrawer = ()=>{
        setOpenTopDrawer(false)
    }

    const closeRightDrawer = ()=>{
        setOpenRightDrawer(false)
    }

    const create= async(p)=>{
        
        await doPost('math',p,'save Math', getHeaders()) 
        setRefresh(refresh+1)              
    }

    const update= async(p)=>{
        await doPut('math',p,'save Math', getHeaders()) 
        setRefresh(refresh+1)              
    }

    const toggle= async(p)=>{
        const newObject = {
            ...p,
            status:p.status===0?1:0
        }
        await doPatch('math/toggle',newObject,'save Math', getHeaders()) 
        setRefresh(refresh+1)              
    }
    

    const filterClick= (event)=> {
        setFilterAnchor(filterAnchor ? null : event.currentTarget);
    }

    const detail= async(math)=>{
        setTopDrawerContent( <MathDetail math={math} />)
        setOpenTopDrawer(true)
        setTopDrawerTittle('Math Detail')
    }
    const edit= async(math)=>{
        setRightDrawerContent(<MathForm update={update} math={math} onClose={closeRightDrawer}/>)
        setOpenRightDrawer(true)
        setRightDrawerTittle('Edit Math')
    }
    
    const deleteById=async (p)=>{
        await doDelete('math',p,'delete Math')
        setRefresh(refresh+1)
    }

    const changeHalaman=(event, newHalaman)=>{
        setHalaman(newHalaman+1)
    }
    
    const changeRowsPerHalaman = (event)=> {
        setRowsPerHalaman(+event.target.value);
        setHalaman(1);
      }

    const currentAccess = ui.active_page.access

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
                <Protected current={currentAccess} only='W'>
                    <AddButton  text='Add Math' action={addButtonClick} classes={classes.bigAddButton}/>
                </Protected>
                
            </Grid>
        </Grid>
        <Grid container justify='space-between' className={classes.content_wrapper}>
            <Grid item xs={12} className={classes.content}>
                <Paper >
                    <Table className={classes.table}>
                        <TableHead>
                        <TableRow>
                            <TableCell>Html_code</TableCell>
                            <TableCell>icon display</TableCell>
                            <TableCell>asciimath</TableCell>                            
                            <TableCell>asciimath result</TableCell>                    
                            <TableCell>latex</TableCell>        
                            <TableCell> latex result</TableCell>                    
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {mathData.map(row => (
                            <TableRow key={row.id}  className={classes.tableRow}>
                                
                            <TableCell>                                 
                                {row.html_symbol}
                            </TableCell>
                            <TableCell ><span dangerouslySetInnerHTML={{__html: row.html_symbol}}/></TableCell>
                            <TableCell>{row.asciimath}</TableCell>
                            <TableCell><MathDisplay value={'\`'+row.asciimath+'\`'} /></TableCell>
                            <TableCell>{row.latex}</TableCell>
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
                                    <MathDisplay value={'$'+row.latex+'$'} />
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
                            'aria-label': 'previous Math',
                        }}
                        nextIconButtonProps={{
                            'aria-label': 'next Math',
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


export default  MathPage;