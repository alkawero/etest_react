import React,{useState} from 'react';
import { makeStyles } from '@material-ui/styles';
import PopUp from 'components/PopUp';
import Grid  from '@material-ui/core/Grid';
import IconButton  from '@material-ui/core/IconButton';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Clear from '@material-ui/icons/Clear';
import { doGet} from 'apis/api-service';
import TextField  from '@material-ui/core/TextField';
import Select from 'react-select';

const FlexibleFilter = ({anchor,position,setData,path,filters,setFilterParams}) => {
    const classes = useStyles()
    
    const   placeholders = filters.map(filter => (filter.placeholder) )
                            .reduce((accumulator, currentValue) => {
                                accumulator[currentValue] = '';
                                return accumulator;
                            }, {});
    const [state, setstate] = useState(placeholders)                            
    
    
    const go = async()=>{        
        let filtered = false
        let reducedState = {...state}
        setFilterParams({})
        for (var key in state) {
            if(state[key]!==null){
                if(typeof state[key]=== 'object'){
                    if(state[key].value!=='')
                    filtered = true
                    reducedState = {...reducedState,[key]:state[key].value}
                }else{
                    if(state[key]!=='')
                    filtered = true
                }
            }            
        }        
        if(filtered===true){
            const params    =   {...reducedState,pageNum:100}
            setFilterParams(params)
            const response  =   await doGet(path,params)
            setData(response.data.data)        
        }
        
        
    }

    const clear = ()=>{
        setFilterParams({})
        let clearedState = {...state}
        for (var key in state) {
            if(state[key]!==null){
                if(typeof state[key]=== 'object'){
                    clearedState = {...clearedState,[key]:null}
                }else{
                    clearedState = {...clearedState,[key]:''}
                }
            }            
        }
        setstate(clearedState)

    }

    const textChange = (e,index)=>{
        const value = e.target.value
        setstate({...state, [index]:value})
    }

    const simpleSelectChange = (index) => selected =>{
        setstate({...state, [index]:selected})
    }
    return (
        <PopUp anchor={anchor} position={position}>            
                <Grid container className={classes.filterContainer}>
                    <Grid item xs={11} spacing={1} container className={classes.filterActions}>                        
                        <Grid item>
                            <IconButton onClick={clear} className={classes.arrowButton} size="medium">
                                <Clear fontSize="inherit" />
                            </IconButton>
                        </Grid>
                        {
                            filters.map(filter=>{
                                let component = null
                                if(filter.type==='simple-text'){
                                    component =   
                                        <TextField
                                            id={filter.placeholder}
                                            label={filter.placeholder+'...'}
                                            className={classes.text}
                                            value={state[filter.placeholder]}
                                            onChange={(e)=>textChange(e,filter.placeholder)}
                                            variant="outlined"
                                            margin="dense"
                                        />                                       
                                    
                                }
                                else if(filter.type==='simple-select'){                                        
                                    component =                                        
                                                    <Select
                                                    value={state[filter.placeholder]}
                                                    onChange={simpleSelectChange(filter.placeholder)}                                                    
                                                    name={filter.placeholder}
                                                    options={filter.data}  
                                                    styles={selectCustomStyles}
                                                    isClearable={true}
                                                    placeholder={'select '+filter.placeholder+'...'}
                                                    />
                                    
                                }
                                else if(filter.type==='async-select'){
                                    component = <span>async-select</span>
                                }
                                else if(filter.type==='multi-select'){
                                    component = <span>async-select</span>
                                }
                                else if(filter.type==='async-multi-select'){
                                    component = <span>async-select</span>
                                }
                                
                                return (
                                    <Grid item key={filter.placeholder} className={classes.filterItem}>{component}</Grid>
                                )
                                
                            })
                        }
                        
                    </Grid>
                    <Grid item xs={1}container justify='center'alignItems='center'>
                        <IconButton onClick={go} className={classes.arrowButton} size="medium">
                            <ArrowForward fontSize="inherit" />
                        </IconButton>                        
                    </Grid>  
                </Grid>            
        </PopUp>
    );
}

export default FlexibleFilter;



const useStyles = makeStyles(theme => ({    
    filterContainer:{
        padding:8,
        width:850,
    },
    filterActions:{
        borderRight:'1px solid #c4c4c4'
    },
    text:{
        width:150
    },
    simpleSelect:{
        minWidth:200,
        height:40
    },
    formControl:{
        margin: theme.spacing(1),
        minWidth: 120,
    },
    filterItem:{
        display:'flex',
        alignItems:'center'
    }
}))

const selectCustomStyles = {
    control: (base, state) => ({
      ...base,
      height: '40px',
      minHeight: '40px',
      minWidth:'200px',
      marginTop:'2px',      
    }),
};