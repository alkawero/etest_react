import React,{useState} from 'react';
import useStyles from './roleStyle'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Typography from '@material-ui/core/Typography';
import Switch  from '@material-ui/core/Switch';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Chip  from '@material-ui/core/Chip';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

const RoleList = ({roles,toggle,click}) => {
    const [selectedRole, setSelectedRole] = useState({id:0})
    const classes = useStyles()
    
    const onClick=(role)=>{
        setSelectedRole(role)
        click(role)
    }

    if(roles){
        return (        
        <List className={classes.roleList}>
            {roles.map(role=>(
                <ListItem key={role.id} alignItems="flex-start" button 
                    onClick={()=>onClick(role)} 
                    selected={role.id===selectedRole.id}
                    className={classes.listItem}
                >
                    <ListItemAvatar className={classes.avatar}>
                        <Chip label={role.code} className={classes.roleCode}/>
                    </ListItemAvatar>
                    <ListItemText
                    primary={role.name} 
                    secondary={role.desc}                   
                    />                        
                     
                    <ListItemSecondaryAction>
                        <Switch
                            edge="end"
                            onChange={()=>toggle(role)}
                            checked={role.status===1||role.status===true}
                            color="primary"                                
                        />
                    </ListItemSecondaryAction>
                 </ListItem>
            ))}
            
        </List>
        );
    }else{
        return null
    }
}

export default RoleList;

