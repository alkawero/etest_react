import React,{useState,useEffect} from 'react';
import { useSelector } from "react-redux";
import Grid from '@material-ui/core/Grid'; 
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/styles';
import AddButton from 'components/AddButton';
import PopUp from 'components/PopUp';
import Avatar  from '@material-ui/core/Avatar';
import {doGetDummy} from 'tests/api-dummy';
import { doGet,doPost,doDelete,doPut } from 'apis/api-service';

const PageMapping = ({selectedRoleId,refresh}) => {
    const [popUpAnchor, setPopUpAnchor] = useState(null)
    const user = useSelector(state => state.user);
    const classes = useStyles()
    const [selectedPage, setSelectedPage] = useState(null)
    const [allAccess, setAllAccess] = useState([])
    const [pages, setPages] = useState([])
    const [refreshPages, setRefreshPages] = useState(0)
    const [refreshAvaiAccess, setRefreshAvaiAccess] = useState(0)
    const [availableAccess, setAvailableAccess] = useState(null)

    const getHeaders = ()=> {
        return {"Authorization": user.token}    
      }
    
    useEffect(() => {
        getAllAccess()
    },[]);

    useEffect(() => {
        if(selectedRoleId!==0){
            getPagesByRole(selectedRoleId)            
        }
        
    },[selectedRoleId,refreshPages,refresh]);
    
    useEffect(() => {
        if(selectedPage!=null){
            const accesses = allAccess
                                .filter(access=>(!selectedPage.access.includes(access.char_code)))
                                .map(access=>{
                                    return(
                                        <Chip key={access.id}
                                        avatar={<Avatar>{access.char_code}</Avatar>}
                                        onClick={()=>addAccess(access.char_code)}
                                        color="primary" 
                                        label={access.value}/>
                                    )
                                })
            setAvailableAccess(accesses)
        }
    },[selectedPage]);

    const getPagesByRole = async(roleId)  =>{
        
        const response = await doGet('role/'+roleId+'/pages',{},getHeaders())        
        if(!response.error){
            const pages = response.data
            setPages(pages)
            if(selectedPage!==null){
                    pages.forEach(page => {
                        if(page.id===selectedPage.id){
                            setSelectedPage(page)
                        }
                     });
            }
        }    
    }

    const addAccess = async(access) =>{
        const a = {
            page_id:selectedPage.id,
            role_id:selectedRoleId,
            access_code:access}
            
            await doPost('role/page/access',a,'add access',getHeaders())         
            setRefreshPages(refreshPages+1)
    }

    const deleteAccess = async(pageId,access) =>{
        const a = {
            page_id:pageId,
            role_id:selectedRoleId,
            access_code:access}
        await doDelete('role/page/access',a,'delete access',getHeaders())         
        setRefreshPages(refreshPages+1)
    }

    const getAllAccess = async() => {
        const params={group:'access'}
        
        const response = await doGet("param", params, getHeaders());        
        setAllAccess(response.data)
    }
    
    

    const chooseAccess = (e,page) =>{
        setPopUpAnchor(popUpAnchor ? null : e.currentTarget);
        setSelectedPage(page)
    }
    

    return (
        <>
        <Grid  container direction="column">
            {pages.map(page=>(
                <Grid key={page.id} justify='space-between' alignItems='center' container className={classes.pageRow}>
                    <Grid item >
                        <Chip label={page.tittle} />
                    </Grid>
                    <Grid item >
                        <Chip label={page.path} />
                    </Grid>
                    <Grid item >
                        {page.access.map(access=>(
                            <Chip
                            key={access}
                            color="primary"
                            label={access}
                            onDelete={()=>deleteAccess(page.id,access)}
                          />))}
                    </Grid>
                    <Grid item >
                        <AddButton action={(e)=>chooseAccess(e,page)} tooltip='add access'/>
                    </Grid>                    
                </Grid>            
            ))}
               
            
        </Grid>  
        <PopUp anchor={popUpAnchor} position='left'>
            <Grid container justify='center' className={classes.popUpContainer}>
                {availableAccess}
            </Grid> 
        </PopUp>
        </>
    );
} 

export default PageMapping;

const useStyles = makeStyles(theme => ({    
    pageRow:{
        '&:hover': {
            background:'#E5E9F2',
            color:'black' ,            
            
          },  
        height:50,
        padding:'0 8px' ,
        borderRadius:6        
    },
    popUpContainer:{
        padding:8,
        minWidth:300,
        minHeight:50,
        '&:after':{
            left: '100%',
            top: '50%',
            border: 'solid',
            content: "' '",
            height: 0,
            width: 0,
            position: 'absolute',
            pointerEvents: 'none',
            borderColor: 'rgba(255, 255, 255, 0)',
            borderLeftColor: '#ffffff',
            borderWidth: '10px',
            marginTop: '-10px',
        }
    }
    
  }));