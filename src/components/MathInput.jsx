import React,{useState} from 'react'
import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import AddButton from 'components/AddButton';
import PopUp  from 'components/PopUp';
import Grid  from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import SubdirectoryArrowLeft from '@material-ui/icons/SubdirectoryArrowLeft';

const MathInput = ({value,action,type}) => {
    const classes = useStyles()
    const [anchor, setAnchor] = useState(null)
    const formulas = [
        {display:<>&#8721;</>, asciimath:'sum_(i=1)^n', latex:'\sum_{n=1}^{n}',
        display:<>&#8721;</>, asciimath:'[[a,b],[c,d]]', latex:'\sum_{n=1}^{n}'
        }
    ]

    const showEquationButton = (event)=>{
        setAnchor(anchor ? null : event.currentTarget);
    }

    const equationClick=(formula)=>{
        const chars = type==='asciimath'? `\`${formula.asciimath}\``:`$$${formula.latex}$$`
        action(value+chars)
    }

    const inputChange = (e)=>{
        action(e.target.value)
    }

    const enterButton=()=>{
        const p = ' <p>...</p> ';
        action(value+p)
    }

    return (
        <>
        <Grid container className={classes.root}>
            <Grid item xs={11}>
                <TextField
                    id="mathInput"
                    value={value}
                    multiline
                    rows="5"
                    className={classes.mathInput}
                    margin="normal"
                    onChange={inputChange}
                    fullWidth
                    variant='outlined'
                    placeholder='equation content'
                />
            </Grid>
            <Grid item xs={1}>
                <AddButton action={showEquationButton} tooltip='add equation symbol'/>
            </Grid>
        </Grid>
        <PopUp anchor={anchor} position={'left-start'}>            
                <Grid container className={classes.equationContainer}>                     
                    <IconButton onClick={enterButton} className={classes.arrowButton} size="medium">
                        <SubdirectoryArrowLeft/>
                    </IconButton>                    
                    
                    {formulas.map(f=>(
                        <IconButton onClick={()=>equationClick(f)} className={classes.arrowButton} size="medium">
                            {f.display}
                        </IconButton>
                    ))}
                    
                </Grid>            
        </PopUp>
        </>
    );
}

export default MathInput;

const useStyles = makeStyles(theme => ({    
    root:{
        width:'100%'
    },
    equationContainer:{
        width:500
    },
    mathInput:{}
    
  }));