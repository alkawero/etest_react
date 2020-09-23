import React,{useState,useEffect} from 'react'
import Grid from '@material-ui/core/Grid';
import useStyles from './pageStyle'
import Button  from '@material-ui/core/Button';
import TextField  from '@material-ui/core/TextField';
import Switch  from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const PageForm = ({page,create,update,onClose}) => {
    const [status, setStatus] = useState(true)
    const [navigation, setNavigation] = useState('')
    const [path, setPath] = useState('')
    const [tittle, setTittle] = useState('')
    const [icon, setIcon] = useState('')
    const [changed, addChanged] = useState([])
    const classes = useStyles()
    
    useEffect(() => {
        if(page){
            setStatus(page.status===1 || page.status===true ) 
            setNavigation(page.navigation)   
            setPath(page.path)     
            setTittle(page.tittle)         
            setIcon(page.icon)         
        }
      },[page]);
    
    
    const clear=()=>{
        setStatus(true)
        setNavigation('')
        setPath('')
        setTittle('')
        setIcon('')         
    }

    const submit = ()=>{         
        if(page){            
            const newPage = {...page,navigation:navigation,path:path,tittle:tittle,status:status,icon:icon}
            update(newPage)  
            clear()          
        }else{
            const page = {navigation:navigation,path:path,tittle:tittle,status:status,icon:icon}               
            create(page)
            clear()
        }
        
        onClose()
    }
    const cancel = ()=>{
        clear()
        onClose()
    }
    const statusChange = () =>{
        setStatus(!status)
        addChanged([...changed,'status'])
    }
    const navigationChange = (e) =>{
        setNavigation(e.target.value)
        addChanged([...changed,'navigation'])
    }
    const pathChange = (e) =>{
        setPath(e.target.value)
        addChanged([...changed,'path'])
    }
    const tittleChange = (e) =>{        
        setTittle(e.target.value)
        addChanged([...changed,'tittle'])
    }

    const iconChange = (e) =>{        
        setIcon(e.target.value)
        addChanged([...changed,'icon'])
    }
    
    

    return (
        <Grid container justify='center' className={classes.addContent}>
                <Grid item xs={12}>
                    <TextField
                        id="Navigation"
                        label="Navigation"
                        className={classes.textField}
                        value={navigation}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={navigationChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="Path"
                        label="Path"
                        className={classes.textField}
                        value={path}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={pathChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="Tittle"
                        label="Tittle"
                        className={classes.textField}
                        value={tittle}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={tittleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="Icon"
                        label="Icon"
                        className={classes.textField}
                        value={icon}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={iconChange}
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

export default PageForm;
