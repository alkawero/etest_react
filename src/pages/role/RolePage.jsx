import React,{useState,useEffect} from 'react';
import { connect } from "react-redux";
import useStyles from './roleStyle'
import Grid from '@material-ui/core/Grid'; 
import Typography from '@material-ui/core/Typography'; 
import RightDrawer from 'components/RightDrawer';
import TopDrawer from 'components/TopDrawer';
import RoleForm from './RoleForm';
import { doGet,doPost,doDelete,doPut,doPatch } from 'apis/api-service';
import Protected  from 'components/Protected';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import RoleList from './RoleList';
import Conditional from 'components/Conditional'; 
import DeleteButton from 'components/DeleteButton';
import AddButton from 'components/AddButton';
import RefreshButton from 'components/RefreshButton';
import EditButton from 'components/EditButton';
import RoleDetail from './RoleDetail';
import PopUp  from 'components/PopUp';
import SimpleSearchList from 'components/SimpleSearchList';
import SearchListAsync from 'components/SearchListAsync';



const RolePage = (props) => {
    
    const [openRightDrawer, setOpenRightDrawer] = useState(false)
    const [rightDrawerTittle, setRightDrawerTittle] = useState('')
    const [RightDrawerContent, setRightDrawerContent] = useState(null)
    const [refresh, setRefresh] = useState(1)
    const [refreshPages, setRefreshPages] = useState(1)
    const [refreshUsers, setRefreshUsers] = useState(1)    
    const [roleData, setRoleData] = useState([])
    const [selectedRoleId, setSelectedRoleId] = useState(0)
    const [pagesAvailable, setPagesAvailable] = useState([])
    const [users, setUsers] = useState([])
    const [popUpAnchor, setPopUpAnchor] = useState(null)
    const [detailTab, setDetailTab] = useState(0)
    
    
    
    const md = useMediaQuery('(min-width:570px)');
    const xl = useMediaQuery('(min-width:1000px)');
    const dimension = {md:md,xl:xl}    
    
    const classes = useStyles({dimension})
    
    useEffect(() => {
        getRole()
    },[refresh]);

    useEffect(() => {
        if(selectedRoleId!==0 && popUpAnchor!==null){
            if(detailTab===0){
                getPagesAvailable(selectedRoleId)
            }else if(detailTab===1){
                
            }
            
        }
    },[popUpAnchor,selectedRoleId]);  

    const refreshPage =()=>{
        setRefresh(refresh+1)
    }
    
    const getRole = async()=>{
        const response = await doGet('role')
        if(!response.error){
            setRoleData(response.data) 
        }
        
    }

    const getRoleById = async(roleId)  =>{
        const response = await doGet('role/'+roleId)
        if(!response.error){
            return response.data
        }    
    }

    const getPagesAvailable = async(roleId)  =>{
        const response = await doGet('role/'+roleId+'/available')        
        if(!response.error){
            const pages = response.data.map(page=>{return {id:page.id,text:page.navigation}})
            setPagesAvailable(pages)
        }    
    }

    

    

    const addButtonClick = ()=>{
        setRightDrawerContent(<RoleForm create={create} onClose={closeRightDrawer}/>)
        setOpenRightDrawer(true)
        setRightDrawerTittle('Add New Role')
    }
            
    
    const closeRightDrawer = ()=>{
        setOpenRightDrawer(false)
    }

    const create= async(p)=>{
        await doPost('role',p,'save role') 
        setRefresh(refresh+1)              
    }

    const update= async(p)=>{
        await doPut('role',p,'save role') 
        setRefresh(refresh+1)              
    }

    const toggle= async(r)=>{
        const newObject = {
            ...r,
            status:r.status === 0 ? 1:0
        }
        await doPatch('role/toggle',newObject,'change status ') 
        setRefresh(refresh+1)              
    }
    
    const detail= async(r)=>{
        setSelectedRoleId(r.id)                       
    }
    const edit= async()=>{
        const role = await getRoleById(selectedRoleId)
        setRightDrawerContent(<RoleForm update={update} role={role} onClose={closeRightDrawer}/>)
        setOpenRightDrawer(true)
        setRightDrawerTittle('Edit Role')
    }
    
    const deleteById=async ()=>{
        await doDelete('role',{id:selectedRoleId},'delete role')
        setRefresh(refresh+1)
    }
    
    const openAddPageMapping= (e)=>{         
        setPopUpAnchor(popUpAnchor ? null : e.currentTarget);        
    }

    const openAddUserMapping= (e)=>{  
        setPopUpAnchor(popUpAnchor ? null : e.currentTarget);        
    }

    const addPageMapping = async(pageId) =>{
        const a = {
            page_id:pageId,
            role_id:selectedRoleId,
            access_code:'R'}
        await doPost('role/page/access',a,'add access')         
        getPagesAvailable(selectedRoleId)
        setRefreshPages(refreshPages+1)
    }

    const addUserMapping = async(userP) =>{
        const a = {
            user_id:userP.id,
            role_id:selectedRoleId}
        await doPost('role/user',a,'add user role')         
        setRefreshUsers(refreshUsers+1)
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
                <RefreshButton action={refreshPage} classes={classes.iconButton}/>
                <Protected current={currentAccess} only='W'>
                    <AddButton  text='Add Role' action={addButtonClick} classes={classes.bigAddButton}/>
                </Protected>
            </Grid>
        </Grid>
        <Grid container className={classes.content_wrapper}>
            <Grid container justify='flex-start' className={classes.content}>
                <Grid container className={classes.contentHeader}>
                    <Grid container alignItems='center'justify='center' item xs={4} className={classes.listHeader}>
                    <Typography variant="h6" className={classes.whiteText}>
                        Role List
                    </Typography>
                    </Grid>
                    <Grid container alignItems='center'justify='center' item xs={5}>
                    <Typography variant="h6" className={classes.whiteText}>
                        Detail
                    </Typography>
                    </Grid>
                    <Grid item container alignItems='center'justify='flex-end' xs={3}>
                        <Conditional condition={selectedRoleId!==0}>
                            <Conditional condition={detailTab===0}>
                                <AddButton tooltip='add page mapping' action={openAddPageMapping} classes={classes.whiteText}/> 
                            </Conditional>
                            <Conditional condition={detailTab===1}>
                                <AddButton tooltip='add user mapping' action={openAddUserMapping} classes={classes.whiteText}/>                             
                            </Conditional>
                            <EditButton tooltip='edit role' action={edit} classes={classes.whiteText}/>
                            <DeleteButton tooltip='delete role' action={deleteById} classes={classes.whiteText}/>                            
                        </Conditional>                
                    </Grid>
                </Grid>
                <Conditional condition={roleData.length>1}>
                    <Grid container wrap='nowrap'>
                        <Grid item xs={4} className={classes.listWrapper}>
                            <RoleList roles={roleData} toggle={toggle} click={detail}/>
                        </Grid>    
                        <Grid item xs={8}>                            
                            <Conditional condition={selectedRoleId!==0}>
                                <RoleDetail selectedRoleId={selectedRoleId} refreshPages={refreshPages} refreshUsers={refreshUsers} detailTab={detailTab} setDetailTab={setDetailTab}/>    
                            </Conditional>                        
                        </Grid> 
                    </Grid>
                </Conditional>
                   
                   
            </Grid>            
        </Grid>
        <RightDrawer tittle={rightDrawerTittle} open={openRightDrawer} close={closeRightDrawer}>
            {RightDrawerContent}            
        </RightDrawer>
        <PopUp anchor={popUpAnchor} position='left-start'>
            <Conditional condition={detailTab===0}>
                <SimpleSearchList data={pagesAvailable} action={addPageMapping} />            
            </Conditional>    
            <Conditional condition={detailTab===1}>
                <SearchListAsync path={'user'} action={addUserMapping} />            
            </Conditional>
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
        
    }
}


export default  connect(mapStateToProps,mapDispatchToProps)(RolePage);