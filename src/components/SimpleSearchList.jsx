import React,{useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/styles';
import List from '@material-ui/core/List';
import ListItem  from '@material-ui/core/ListItem';
import ListItemText  from '@material-ui/core/ListItemText';
import ListItemSecondaryAction  from '@material-ui/core/ListItemSecondaryAction';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid'; 
import AddButton from './AddButton';

const SimpleSearchList = ({data, action}) => {
    //data should be [{id:1, text:''}]
    const classes = useStyles()
    const [keyword, setKeyword] = useState('')
    const [filtered, setFiltered] = useState([])

    useEffect(() => {
        if(keyword!==''){
            const filteredData = data.filter(d=>{
                return d.text.toLowerCase().includes(keyword)
            })
            setFiltered(filteredData)
        }else{
            setFiltered(data)
            
        }
    },[keyword,data]);
    
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
                <List dense className={classes.listPage}>                
                    {filtered.map(data=>(
                        <ListItem button key={data.id} className={classes.listItem} onClick={()=>action(data.id)}>
                        <ListItemText
                            primary={data.text}
                        />                        
                        </ListItem>
                    ))}
                     
                                   
                </List>
            </Grid>
    );
}

export default SimpleSearchList;

const useStyles = makeStyles(theme => ({
    root: {
      width:300,
      padding:8
    },
    listPage:{
        width:'100%'
    },
    listItem:{
        borderRadius:6,
        '&:hover': {
            background:'#E5E9F2',
            color:'black' ,            
            
        }
    }    
  }));