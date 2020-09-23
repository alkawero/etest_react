import { makeStyles } from '@material-ui/styles';

export const useCommonStyles = makeStyles(theme => ({    
    margin:{ 
        margin:8
    },
    marginY:{ 
        margin:'8px 0'
    },
    marginX:{ 
        margin:'0 8px'
    },
    padding:{
        padding:8
    },
    paddingLeft:{
        paddingLeft:8
    },
    paddingRight:{
        paddingRight:8
    },
    paddingX:{
        padding:'0 8px'
    },
    paddingY:{
        padding:'8px 0'
    },
    marginTop:{
        marginTop:8
    },
    marginBottom:{
        marginBottom:8
    },
    marginLeft:{
        marginLeft:8
    },
    borderTopRadius:{
        borderRadius:'4px 4px 0 0'
    },
    borderBottomRadius:{
        borderRadius:'0 0 4px 4px'
    },
    borderTopLeftRadius:{
        borderRadius:'4px 0 0 0'
    },
    borderTopRightRadius:{
        borderRadius:'0 4px 0 0'
    },
    borderBottomLeftRadius:{
        borderRadius:'0 0 0 4px'
    },
    borderBottomRightRadius:{
        borderRadius:'0 0 4px 0'
    },
    backgroundColorHijau:{
        backgroundColor:'#15cd8f'
    },
    
    success:{
        backgroundColor:'#15cd8f'
    },
    headerIconButton:{
        color:'white',
        padding:8 
    },
    filterContainer:{
        padding:8,
        width:850,
    },
    fullFilterContainer:{
        padding:8,
        width:1000,
    },
    table_header:{
        backgroundColor:'#f5f5f5',        
    },
    
        
    
  }));

  
  export const selectCustomZindex = {
    control: (base, state) => ({
        ...base,
        minWidth: '150px',
        margin: '0 4px',

    }),
    container: (base, state) => {
        return ({
            ...base,
            flex: 1,
            zIndex: state.isFocused ? "1100" : "1"  //Only when current state focused
        })
    }
};

export const selectCustomSize = {
    control: (base, state) => ({
      ...base,
      height: '40px',
      minHeight: '40px',
      minWidth:'200px',
      marginTop:'2px',      
    }),
};

export const selectFullSize = {
    container: (base, state) => {
        return ({
            ...base,
            flex: 'auto',            
        })
    }
};



