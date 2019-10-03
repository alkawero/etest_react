import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({    
    content_wrapper:{
      margin : '-240px 0 0 0'
    },
    content:{
        borderRadius:6,
        backgroundColor:'white', 
        minHeight:600, 
        margin:24,
        
    },
    header :{
        height:300,
        background: 'linear-gradient(to bottom, #1772e5, #1567d0, #125cbc, #0f51a8, #0c4795)',
        paddingTop:20
        
    },
    paper:{
        height:50
    },
    headerTittle:{
        marginTop:20,
        color:'white',
        paddingLeft:24,
    },
    headerToolbar:{  
        paddingRight:20,      
        height:40
    },
    iconButton:{
        color:'white',
        padding:8 
    },
    
    
  }));
  export default useStyles