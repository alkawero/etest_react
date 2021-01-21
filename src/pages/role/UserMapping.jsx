import React,{useState,useEffect} from 'react';
import Grid from '@material-ui/core/Grid'; 
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/styles';
import {doGetDummy} from 'tests/api-dummy';
import { doDelete,doGet } from 'apis/api-service';
import DeleteButton from 'components/DeleteButton';

const UserMapping = ({selectedRoleId,refresh, user}) => {
    const classes = useStyles()
    const [users, setUsers] = useState([])
    const [refreshUsers, setRefreshUsers] = useState(0)
    
    const getHeaders = ()=> {
        return {"Authorization": user.token}    
      }

    useEffect(() => {
        if(selectedRoleId!==0){
            getUsersByRole(selectedRoleId)            
        }
        
    },[selectedRoleId,refreshUsers,refresh]);
    
    
    const getUsersByRole = async(roleId)  =>{
        
        const response = await doGet('role/'+roleId+'/users',{},getHeaders())        
        
        if(!users.error){            
            setUsers(response.data)
        }
            
    }    

    const deleteUser = async(userId) =>{
        const a = {
            user_id:userId,
            role_id:selectedRoleId}
        await doDelete('role/user',a,'delete user from role', getHeaders())         
        setRefreshUsers(refreshUsers+1)
    }

    return (
        <>
        <Grid  container direction="column">
            {users.map(user=>(
                <Grid key={user.user_id} justify='space-between' alignItems='center' container className={classes.pageRow}>
                    <Grid item >
                        <Chip label={user.user_id} />
                    </Grid>
                    <Grid item >
                        <Chip label={user.user_name} />
                    </Grid>
                    
                    <Grid item >
                        <DeleteButton action={(e)=>deleteUser(user.user_id)} tooltip='delete user'/>
                    </Grid>                    
                </Grid>            
            ))}
               
            
        </Grid>          
        </>
    );
} 

export default UserMapping;

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