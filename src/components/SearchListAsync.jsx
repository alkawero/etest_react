import React,{useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/styles';
import List from '@material-ui/core/List';
import ListItem  from '@material-ui/core/ListItem';
import ListItemText  from '@material-ui/core/ListItemText';
import ListItemSecondaryAction  from '@material-ui/core/ListItemSecondaryAction';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid'; 
import AddButton from './AddButton';
import { doGet} from 'apis/api-service';
import { useDebounce } from 'react-use';
import Conditional from './Conditional';

const  SearchListAsync = ({path, action}) => {
    //data should be [{id:1, text:''}]
    const classes = useStyles()
    const [keyword, setKeyword] = useState('')
    const [debouncedKeyword, setDebouncedKeyword] = useState('')
    const [data, setData] = useState([])

    useDebounce(
        () => {
            setDebouncedKeyword(keyword.trim());
        },
        500,
        [keyword]
      );

    useEffect(() => {
        if(debouncedKeyword===''){
            setData([])
        }else{
            getData()
        }
    },[debouncedKeyword]);
    

    

    const getData = async()=>{
        const params={keyword:debouncedKeyword}
        const response = await doGet(path,params)
        if(!response.error){
            setData(response.data.data) 
        }
        
    }

    const handleClick = (data)=>{        
        setKeyword('')
        action(data)
    }

    return (
            <Grid container justify='center' className={classes.root}>
                <TextField
                    label="search.."
                    value={keyword}
                    onChange={(e)=>{setKeyword(e.target.value)}}
                    margin="dense"
                    variant="outlined"
                    fullWidth
                />
                <Conditional condition={data.length>0}>
                <List dense className={classes.listPage}>                
                    {data.map(d=>(
                        <ListItem button key={d.text} className={classes.listItem} onClick={()=>handleClick(d)}>
                        <ListItemText
                            primary={d.text}
                        />
                        
                        </ListItem>
                    ))}                 
                                   
                </List>
                </Conditional>
            </Grid>
    );
}

export default SearchListAsync;

const useStyles = makeStyles(theme => ({
    root: {
      width:300,
      padding:8
    },
    listPage:{
        width:'100%',
        border:'1px solid #c4c4c4',
        borderRadius:4
    },
    listItem:{
        borderRadius:6,
        '&:hover': {
            background:'#E5E9F2',
            color:'black' ,            
            
        }
    }    
  }));