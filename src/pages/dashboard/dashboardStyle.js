import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({    
    root:{
        padding:24
    },
    cardWrapper:{
        borderRadius:4,        
    },
    cardWrapperTittle:{
        minWidth:200
    },
    card:{
        width:250,        
    },
    iconButton:{
        color:'white',
        padding:8 
    },
    select:{
        width:150,
        marginTop:8
    },
    buttonWrapper:{
        height:50
    }
    
  }));
  export default useStyles