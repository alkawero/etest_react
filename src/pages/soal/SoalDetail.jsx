import React from 'react'
import Grid  from '@material-ui/core/Grid';
import useStyles from './soalStyle'
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import StatusChip from 'components/StatusChip';
import Conditional  from 'components/Conditional';
import MathDisplay  from 'components/MathDisplay';
import { Editor } from 'react-draft-wysiwyg';
import {convertFromHTML,ContentState,EditorState} from 'draft-js'
import Divider from '@material-ui/core/Divider';



const SoalDetail = ({obj}) => {
    const classes = useStyles()
    
    if(obj){
        return (
            <Paper className={classes.detailPaper}>
                <Grid container justify='center' className={classes.detailRoot} >
                    <Grid container>                        
                        <Conditional condition={obj.content_type===1}>    
                            <p>{obj.content}</p>
                        </Conditional>
                        <Conditional condition={obj.content_type===2}>    
                            <Editor 
                            defaultEditorState={
                                EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(obj.content)))
                            }
                            readOnly={true}
                            toolbarHidden
                            />
                        </Conditional>
                        <Conditional condition={obj.content_type===3}>    
                            <MathDisplay value={obj.content} />
                        </Conditional>
                    </Grid>
                    <Divider style={{width:'100%'}}/>
                    <Grid container>                        
                        <Conditional condition={obj.question_type===1}>    
                            <p>{obj.question}</p>
                        </Conditional>
                        <Conditional condition={obj.question_type===2}>    
                            <Editor 
                            defaultEditorState={
                                EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(obj.question)))
                            }
                            readOnly={true}
                            toolbarHidden
                            />
                        </Conditional>
                        <Conditional condition={obj.question_type===3}>    
                            <MathDisplay value={obj.question} />
                        </Conditional>
                    </Grid>
                    <Divider style={{width:'100%'}} />
                    <Grid container >
                        <Grid item xs={3} className={classes.label}>Answers</Grid>
                        <Grid item xs={9}>
                            
                        </Grid>
                    </Grid>
                    
                    <Grid container >
                        <Grid item  xs={3} className={classes.label}>Status</Grid>
                        <Grid item>
                            <StatusChip status={obj.status}/>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        );
    }else{
        return null
    }
    
}

export default SoalDetail;