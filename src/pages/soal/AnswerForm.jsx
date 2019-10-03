import React,{useState} from 'react';
import Button  from '@material-ui/core/Button';
import useStyles from './soalStyle'
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Conditional  from 'components/Conditional';
import MathInput  from 'components/MathInput';
import MathDisplay  from 'components/MathDisplay';
import TextField  from '@material-ui/core/TextField';

const answerContentTypes = [{id:1,value:'plain text',code:1}, {id:2,value:'equation',code:2}]
    

const AnswerForm = ({save, cancel}) => {
    const classes = useStyles()
    const [contentType, setContentType] = useState(1)
    const [code, setCode] = useState('')
    const [error, setError] = useState('')
    const [plainContent, setPlainContent] = useState('')
    const [mathContent, setMathContent] = useState('')

    const contentTypeChange=(e)=>{
        setContentType(e.target.value)
    }

    const codeChange =(e)=>{
        if(e.target.value.trim() !== ''&& e.target.value.length===1)
            setCode(e.target.value.toUpperCase())    
        else{
            setCode('')
        }
    }

    const submit = ()=>{
        const content = contentType===1?plainContent:mathContent

        if(code.trim()!=='' && content.trim()!==''){
            if(save(
                { code:code,
                    content: content,
                    contentType:contentType }
                )
            ===false){
                setError('answer code or content already exist')
            }                
            else{
                setError('') 
            }
        }else{
            setError('please complete the form')
        }
        
    }
    return (
        <Grid container direction='column' className={classes.answerFormContainer}>
            <Grid container className={classes.padding}>
                <Select
                    value={contentType}
                    onChange={contentTypeChange}
                    displayEmpty
                    name="contentType"
                    className={classes.fullWidth}
                    autoWidth={true}
                    variant='outlined'
                    >
                    {answerContentTypes.map(type=>(
                        <MenuItem key={type.id} value={type.code}>{type.value}</MenuItem>
                    ))}                             
                    
                    
                </Select>
            </Grid>

            <Grid container className={classes.padding}>
                <TextField
                    id="code"
                    value={code}
                    margin="normal"
                    onChange={codeChange}
                    fullWidth
                    maxLength='1'
                    variant='outlined'
                    placeholder='code'
                />
            </Grid>

            <Grid container className={classes.padding}>
                <Conditional condition={contentType===1}>
                    <TextField
                            id="mathInput"
                            value={plainContent}
                            multiline
                            margin="normal"
                            onChange={e => setPlainContent(e.target.value)}
                            fullWidth
                            variant='outlined'
                            placeholder='text content'
                        />
                    </Conditional>
                    <Conditional condition={contentType===2}>
                        <MathInput value={mathContent} type='asciimath' action={setMathContent} />
                        <MathDisplay value={mathContent}/>
                    </Conditional>
            </Grid>
            <Grid item container justify='space-between' className={classes.addAction}>
                <Button variant='outlined' onClick={cancel} >cancel</Button>
                <Conditional condition={error!==''}>
                    <span style={{color:'red'}}>{error}</span>
                </Conditional>
                <Button onClick={submit} color='primary'variant='contained'>Save</Button>
            </Grid>
        </Grid>
    );
}

export default AnswerForm;