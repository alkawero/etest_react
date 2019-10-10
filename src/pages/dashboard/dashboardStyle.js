import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({    
    root:{
        padding:24
    },
    cardWrapper:{
        height:320, 
        overflowX:'auto',
        overflowY:'hidden'    
    },
    cardWrapperTittle:{
        minWidth:200
    },
    card:{
        width:250,
        margin:'0 8px 0 8px'
    },
    iconButton:{
        color:'white',
        padding:8 
    },
    select:{
        width:150,
        marginTop:8
    }
    
  }));
  export default useStyles