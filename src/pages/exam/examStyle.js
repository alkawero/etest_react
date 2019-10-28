import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({    
    root:{
        width:'100%',
        height:'100vh',
        padding:8,
        background:'linear-gradient(90deg, #c9d6ff 0%,#e2e2e2 100% )'
    },
    left:{
        
    },
    right:{
        
    },
    header:{
        flex:'0 1 auto',
        padding:'0 8px'
    },
    content:{
        flex:'2 1 auto',
        margin:'8px 0',

    },
    footer:{
        flex:'0 1 auto'
    },
    timerWrapper:{
        borderRadius:4,
        color:'white',
        backgroundColor:'red'

    },
    infoWrapper:{
        flex:'0 1 auto'
    },
    soalWrapper:{
        backgroundColor:'white',
        borderRadius:4,
        flex:'2 1 auto',
        padding:8
    },
    soalContent:{
        height:'45vh',
        overflow:'auto'
    },
    navigationWrapper:{
        height:50
    },
    answerWrapper:{
        borderRadius:4,
        background:'#494cb5',
        padding:8,
        maxHeight:370,
        overflowY:'auto'
    },
    answer:{
        backgroundColor:'white',
        borderRadius:4,
        height:35,
        width:35,
        margin:8,
        fontWeight:'bold',
        cursor:'pointer'     
    },
    answered:{
        backgroundColor:'#1ed537',
        color:'white'
    },
    ragu:{
        backgroundColor:'yellow',
        color:'black'
        
    },    
    answerBadge:{
        right: -10,
        top: -10
    },
    noSoal:{
        backgroundColor:'white',
        borderRadius:4,
        height:35,
        width:35,   
        fontWeight:'bold'     
    },
    selectedAnswerList:{
        boxShadow: '0 0 10px 9px #9ecaed'
    },
    soalOptionWrapper:{
        height:'35vh',
        overflow:'auto',
    },
    soalOption:{
        borderRadius:4,
        paddingLeft:16,
        margin:'4px 0',
        cursor:'pointer',
        '&:hover': {
            background: '#E5E9F2',            

        },        
        
    },
    optionCode:{
        borderRadius:50,
        fontWeight:'bold',
        width:37,
        height:37,
        backgroundColor:'red',
        color:'white',
        
    },
    choosenOption:{
        background: '#E5E9F2'
    },
    choosenOptionCode:{
        background:'#1ed537'
    },
    modalRoot:{
        height:'100vh'
    },
    imageOption: {
        border: '1px solid #ddd',
        borderRadius: 4,
        padding: 5,
        width: 200
      }

    
    
  }));
  export default useStyles