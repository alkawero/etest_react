import React,{useState,useEffect} from 'react'
import Grid from '@material-ui/core/Grid';
import useStyles from './mathStyle'
import Button  from '@material-ui/core/Button';
import TextField  from '@material-ui/core/TextField';
import Switch  from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const MathForm = ({math,create,update,onClose}) => {
    const [htmlCode, setHtmlCode] = useState(true)
    const [asciimath, setAsciimath] = useState('')
    const [latex, setlatex] = useState('')        
    const classes = useStyles()
    
    useEffect(() => {
        if(math){
            setHtmlCode(math.html_symbol) 
            setAsciimath(math.asciimath)   
            setlatex(math.latex)        
        }
      },[math]);
    
    
    const clear=()=>{
        setHtmlCode('')
        setAsciimath('')
        setlatex('')     
    }

    const submit = ()=>{         
        if(math){            
            const newMath = {...math,html_symbol:htmlCode, asciimath:asciimath, latex:latex}
            update(newMath)  
            clear()          
        }else{
            const math = {html_symbol:htmlCode, asciimath:asciimath, latex:latex}               
            create(math)
            clear()
        }
        
        onClose()
    }
    const cancel = ()=>{
        clear()
        onClose()
    }
    const htmlChange = (e) =>{
        setHtmlCode(e.target.value)
    }
    const asciiChange = (e) =>{
        setAsciimath(e.target.value)
    }
    const latexChange = (e) =>{
        setlatex(e.target.value)
    }

    return (
        <Grid container justify='center' className={classes.addContent}>
                <Grid item xs={12}>
                    <TextField
                        id="html"
                        label="Html Code"
                        className={classes.textField}
                        value={htmlCode}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={htmlChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="Ascii"
                        label="Asciimath"
                        className={classes.textField}
                        value={asciimath}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={asciiChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="Latex"
                        label="Latex"
                        className={classes.textField}
                        value={latex}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={latexChange}
                    />
                </Grid>
                
                <Grid item container justify='space-between' className={classes.addAction}>
                    <Button variant='outlined' onClick={cancel} >cancel</Button>
                    <Button onClick={submit} color='primary'variant='contained'>Save</Button>
                </Grid>            
            </Grid>
        
        
    );
}

export default MathForm;
