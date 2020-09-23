import React,{useState,useEffect} from 'react'
import Grid from '@material-ui/core/Grid';
import useStyles from './paramStyle'
import Button  from '@material-ui/core/Button';
import TextField  from '@material-ui/core/TextField';
import Switch  from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CreatableSelect from 'react-select/creatable';

const ParamForm = ({edited,create,update,onClose,groups}) => {
    const [status, setStatus] = useState(true)
    const [group, setGroup] = useState(null)
    const [value, setValue] = useState('')
    const [numCode, setNumCode] = useState('')
    const [charCode, setCharCode] = useState('')
    const [desc, setDesc] = useState('')
    const [key, setKey] = useState('')
    const classes = useStyles()
    
    useEffect(() => {
        if(edited){
            setStatus(edited.status===1 || edited.status===true ) 
            setGroup({value:edited.group,label:edited.group})   
            setKey(edited.key)
            setValue(edited.value)     
            setNumCode(edited.num_code)         
            setCharCode(edited.char_code)
            setDesc(edited.desc)         
        }
      },[edited]);
    
    
    const clear=()=>{
        setStatus(true)
        setGroup(null)
        setKey('')
        setValue('')
        setNumCode('')
        setCharCode('')         
        setDesc('')         
    }

    const submit = ()=>{         
        if(edited){            
            const newObject = {...edited,group:group.value,key:key,value:value,numCode:numCode,charCode:charCode,status:status,desc:desc}
            update(newObject)  
            clear()
        }else{
            const newObj = {group:group.value,key:key,value:value,numCode:numCode,charCode:charCode,status:status,desc:desc}               
            create(newObj)
            clear()
        }
        
        onClose()
    }
    const cancel = ()=>{
        clear()
        onClose()
    }

    const groupChange = (group) =>{
        setGroup(group)
    }
    const statusChange = () =>{
        setStatus(!status)
        
    }
    const valueChange = (e) =>{
        setValue(e.target.value)
        
    }
    const numCodeChange = (e) =>{
        setNumCode(e.target.value)
        
    }
    const charCodeChange = (e) =>{        
        setCharCode(e.target.value)
        
    }

    const descChange = (e) =>{        
        setDesc(e.target.value)
        
    }

    const keyChange = (e) =>{        
        setKey(e.target.value)
        
    }
    
    

    return (
        <Grid container justify='center' className={classes.addContent}>
                <Grid item xs={12}>
                    <CreatableSelect
                        isClearable
                        onChange={groupChange}
                        options={groups}
                        value={group}
                        placeholder='select group'
                        styles={customStyles}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="Foreign Key"
                        label="Foreign Key"
                        className={classes.textField}
                        value={key}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={keyChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="Value"
                        label="Value"
                        className={classes.textField}
                        value={value}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={valueChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="Number Code"
                        label="Number Code"
                        className={classes.textField}
                        value={numCode}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={numCodeChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="Char Code"
                        label="Char Code"
                        className={classes.textField}
                        value={charCode}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={charCodeChange}
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
                                checked={status}
                                onChange={statusChange}
                                color="primary"
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            />
                        }
                        label={status?'active':'inactive'}
                    />
                    
                </Grid>
                <Grid item container justify='space-between' className={classes.addAction}>
                    <Button variant='outlined' onClick={cancel} >cancel</Button>
                    <Button onClick={submit} color='primary'variant='contained'>Save</Button>
                </Grid>            
            </Grid>
        
        
    );
}

export default ParamForm;

const customStyles = {
    container: (base, state) => {
        return ({
            ...base,
            zIndex: state.isFocused ? "1100" : "1"  //Only when current state focused
        })
    }
}