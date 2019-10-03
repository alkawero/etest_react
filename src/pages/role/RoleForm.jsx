import React,{useState,useEffect} from 'react'
import Grid from '@material-ui/core/Grid';
import useStyles from './roleStyle'
import Button  from '@material-ui/core/Button';
import TextField  from '@material-ui/core/TextField';
import Switch  from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const RoleForm = ({role,create,update,onClose}) => {
    const [status, setStatus] = useState(1)
    const [code, setCode] = useState('')
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const classes = useStyles()
    
    useEffect(() => {
        if(role){
            setStatus(role.status) 
            setCode(role.code)   
            setName(role.name)     
            setDesc(role.desc)         
        }
      },[role]);
    
    
    const clear=()=>{
        setStatus(1)
        setCode('')
        setName('')
        setDesc('')
    }

    const submit = ()=>{         
        if(role){            
            const newRole = {...role,code:code,name:name,desc:desc,status:status}
            update(newRole)   
                     
        }else{
            const role = {code:code,name:name,desc:desc,status:status}               
            create(role)
            clear()
        }
        
        onClose()
    }
    const cancel = ()=>{
        clear()
        onClose()
    }
    const statusChange = () =>{
        setStatus(status===1?0:1)
    }
    const codeChange = (e) =>{
        setCode(e.target.value)
    }
    const nameChange = (e) =>{
        setName(e.target.value)
    }
    const descChange = (e) =>{        
        setDesc(e.target.value)
    }
    
    

    return (
        <Grid container justify='center' className={classes.addContent}>
                <Grid item xs={12}>
                    <TextField
                        id="Code"
                        label="Code"
                        className={classes.textField}
                        value={code}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={codeChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="Name"
                        label="Name"
                        className={classes.textField}
                        value={name}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={nameChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="Description"
                        label="Description"
                        className={classes.textField}
                        value={desc}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={descChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={status===1}
                                onChange={statusChange}
                                color="primary"
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            />
                        }
                        label={status===1?'active':'inactive'}
                    />
                    
                </Grid>
                <Grid item container justify='space-between' className={classes.addAction}>
                    <Button variant='outlined' onClick={cancel} >cancel</Button>
                    <Button onClick={submit} color='primary'variant='contained'>Save</Button>
                </Grid>            
            </Grid>
        
        
    );
}

export default RoleForm;
