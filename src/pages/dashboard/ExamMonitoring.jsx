import React,{useEffect, useState} from 'react';
import Grid from '@material-ui/core/Grid';
import { doGet, doPatch, doSilentPost } from "apis/api-service";
import {EchoInstance} from 'App.js'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Refresh from '@material-ui/icons/Refresh';
import CloseIcon from '@material-ui/icons/Close';
import DebouncedTextField from 'components/DebouncedTextField'


const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));


export default function ExamMonitoring(props) {
  const classes = useStyles();
  const {handleClose, exam, user} = props
  const [participants, setparticipants] = useState([]);
  const [filteredParticipants, setfilteredParticipants] = useState([]);
  const [filterNumber, setfilterNumber] = useState("");  


  const getHeaders = ()=> {
    return {"Authorization": user.token}    
  }

  useEffect(() => {
    if(exam){
        EchoInstance.channel('exam')
    .listen('ExamMonitoring', (e) => {            
        getparticipants()
    });
    getparticipants()
    }
    
    return function cleanup() {
      EchoInstance.leaveChannel('exam');
    }
        
  },[exam]);

  const getparticipants = async () => {
    let params = {
      exam_id: exam.id
    };
    
    const response = await doGet("exam/users", params,getHeaders());
    if (!response.error) {
        setparticipants(response.data);
    }
  }

  const resetParticipant = async (participant) => {
    let params = {
      id: participant.id,
      nomor_induk:participant.nomor_induk
    };
    await doPatch("exam/user/reset", params,"reset", getHeaders());
    getparticipants()
  }

  const getStatusLabel = (status) => {
        if(status===0){
            return "ready to take"
        }
        else if(status===1){
            return "answering"
        }
        else if(status===2){
            return "finish"
        }else{
            return "not connected"
        }
    }

    const filterNumberChange = (value) => {
      setfilterNumber(value)
      const filtered = participants.filter(p=>(p.nomor_induk.includes(value)))
      setfilteredParticipants(filtered)
    }

    const getparticipantsToDisplay = ()=>{
      if(filterNumber!==""){
        return filteredParticipants
      }else{
        return participants
      }
    }

  if(exam){
    return (
        <> 
            <AppBar className={classes.appBar}>
              <Toolbar>                
                <Typography variant="h6" className={classes.title}>
                  Exam Monitor : {exam.exam_type.value} {exam.subject_name}
                </Typography>            
                <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
                  <CloseIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
            <Grid container> 
            <Grid container style={{padding:'0 8px 0 8px'}}>
              <Grid item container alignContent="center" xs={3}>
                <DebouncedTextField
                  margin="dense"
                  id="participantNumber"
                  label="Participant number"
                  fullWidth
                  value={filterNumber}
                  onChange={filterNumberChange}
                />
              </Grid>
              
            </Grid>
            {
                getparticipantsToDisplay().map(p=>(
                    <Grid container> 
                        <Grid item container alignContent="center" xs={1}></Grid>
                        <Grid item container alignContent="center" xs={2}>{p.nomor_induk}</Grid>
                        <Grid item container alignContent="center" xs={3}>{p.name}</Grid>
                        <Grid item container alignContent="center" xs={2}>{getStatusLabel(p.status)}</Grid>
                        <Grid item container alignContent="center" xs={3}>
                            <IconButton edge="start" color="inherit" onClick={()=>resetParticipant(p)} aria-label="close">
                                <Refresh />
                            </IconButton>
                        </Grid>
                    </Grid>
                ))
            }
            </Grid>    
        </>
      );
  }else{
      return null
  }
  
}



