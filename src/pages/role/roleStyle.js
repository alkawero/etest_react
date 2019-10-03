import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({    
    content_wrapper:{
      margin : '-100px 0 0 0'
    },
    content:{
        borderRadius:6,
        backgroundColor:'white', 
        minHeight:600, 
        margin:24,
        
    },
    header :{
        height:160,
        backgroundColor: '#16cd90',
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

    addContent:{
        minHeight:500,
        padding:12
        
    },
    
    addAction:{
        marginTop:'auto',
        marginBottom:0
    },
    listWrapper:{
        borderRight:'1px solid #c4c4c4'
    },
    roleDetail:{
        
    },
    avatar:{
        padding:'0 8px 0 0'
    },
    roleCode:{
          display:'flex',
          alignItems:'center',
          backgroundColor:'#16cd90',
          color:'white'
      },
    contentHeader:{
        height:50,
        background: 'linear-gradient(to right, #1269dc, #1269dc, #1269dc, #1269dc, #1269dc)',
        borderRadius:'6px 6px 0 0',
    },
    listHeader:{
        
    },
    whiteText:{
        color:'white'
    },
    bigAddButton:{
        borderRadius:50
      },
    roleList:{
        padding:8
    },
    listItem:{        
        '&:hover': {
            background:'#E5E9F2',
            color:'black' ,               
            
          },
          borderRadius : 5,
                   
    },   
    tabHeader:{
        height:50
    },
    
    
    
    
    
  }));
  export default useStyles