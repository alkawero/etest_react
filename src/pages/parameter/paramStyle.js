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
    floatButton:{
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
    filterContainer:{
        padding:8,
        minWidth:300,
        '&:after':{
            left: '100%',
            top: '25%',
            border: 'solid transparent',
            content: "' '",
            height: 0,
            width: 0,
            position: 'absolute',
            pointerEvents: 'none',
            borderColor: 'rgba(255, 255, 255, 0)',
            borderLeftColor: '#ffffff',
            borderWidth: '10px',
            marginTop: '-10px',
        }
    },
    filterActions:{
        borderRight:'1px solid #c4c4c4'
    },
    actionWrapper:{
        display:'none',
        position:'absolute',        
        justifyContent:'flex-start',
        marginTop: -8,
        marginLeft: ({dimension})=>{
                        if(dimension){
                            if(dimension.xl===true){
                            return -300
                            }else if(dimension.md===true){
                                return -200
                            }else{
                                return -150
                            }                         
                        }return 0
                    },
        backgroundColor:'white',
        borderRadius:50,
        
        
    },
    tableRow:{
        '&:hover':{
            '& .actionWrapper':{
                display:'flex',
                alignItems:'center',
                
            },
            background:'#E5E9F2'
        }
    },
    pageDetailPaper:{
        margin:'24px 0',        
    },
    pageDetailRoot:{
        width: 500,
        padding:8        
    },
    label:{
        display:'flex',
        alignItems:'center'        
    },
    
    bigAddButton:{
        borderRadius:50
      }
    
    
    
  }));
  export default useStyles