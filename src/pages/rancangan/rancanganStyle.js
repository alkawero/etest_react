import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({    
    content_wrapper:{
      margin : '-100px 0 0 0',
      padding:'0 24px'
    },
    content:{
        borderRadius:6,
        backgroundColor:'white', 
        minHeight:600, 
        margin:'24px 0 0 0',
        
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
        marginBottom:0,
        padding:8
    },
    filterContainer:{
        padding:8,
        width:850,
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
                                return 950
                            }
                            else if(dimension.lg===true){
                                return 750
                            }else if(dimension.md===true){
                                return 600
                            }else{
                                return 400
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
    detailPaper:{
        minWidth:500,
        margin:'8px 0',        
    },
    detailRoot:{
        padding:'8px 24px'
    },
    label:{
        display:'flex',
        alignItems:'center'        
    },
    
    bigAddButton:{
        borderRadius:50
      },
    editorWrapper  :{
        border: '1px solid #D8E8D3',
        borderRadius: 5,
        margin:'4px 0'
    },
    editorHeader:{
        padding:'0 8px'
    },
    inputWraper:{
        padding:'0 8px'
    },
    answerTypeGroup:{
        display:'inline',
        padding:8
    },
    answerTypeWrapper:{
        padding:8
    },
    answerFormContainer:{
        width:500
    },
    fullWidth:{
        width:'98%'
    },
    padding:{
        padding:8
    },
    table_wrapper:{
        width:'100%',
        maxHeight:600,
        minHeight:200,
        overflow:'auto',      
    },
    hoverable:{
        '&:hover':{           
            background:'#E5E9F2'
        }
    },
    checkbox:{
        minWidth:145,
        paddingLeft:8
    }, 
    table_header:{
        backgroundColor:'#f5f5f5',        
    },
    
    
    
    
    
  }));
  export default useStyles

  export const selectCustomSize = {
    control: (base, state) => ({
      ...base,
      height: '40px',
      minHeight: '40px',
      minWidth:'200px',
      marginTop:'2px',      
    }),
};

export const selectCustomZindex = {
    control: (base, state) => ({
        ...base,
        minWidth: '150px',
        margin: '0 4px',

    }),
    container: (base, state) => {
        return ({
            ...base,
            zIndex: state.isFocused ? "1400" : "1"  //Only when current state focused
        })
    },
    menu: styles => ({ ...styles, zIndex: "1500" })
};