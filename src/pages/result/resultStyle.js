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
        paddingTop:20,
        color:'white',
        padding:'0 24px'
        
    },
    filterContainer:{
        height:72,
        padding:'0 8px 0 8px'
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

    table_wrapper:{
        width:'100%',
        overflowX:'auto',
        overflowY:'hidden'
    },
    tableContainer:{
        minHeight:500,
        padding:8
    },
    summaryContainer:{
        padding:8,
        borderRadius:6,
        border:'1px solid black'
    },    
    selectContainer:{
        display:'flex',
        alignItems:'center',
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
        minWidth: '200px',
        margin: '0 4px',

    }),
    container: (base, state) => {
        return ({
            ...base,
            width:'100%',
            zIndex: state.isFocused ? "1100" : "1"  //Only when current state focused
        })
    }
};




