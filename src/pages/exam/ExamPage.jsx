/*
author alka@2019
*/
import React from 'react';
import Grid from '@material-ui/core/Grid';
import useStyles from './examStyle';
import Button from '@material-ui/core/Button';
import { withRouter } from "react-router";
import { useDispatch,useSelector } from "react-redux";



const ExamPage = (props) => {
    const c = useStyles()
    const exam = useSelector(state => state.exam);
    const dispatch = useDispatch()
    const finish=()=>{
        props.history.push('/')
    }
    return (
        <Grid container className={c.root} spacing={2}>
            <Grid item xs={8} container direction='column' justify='space-between' className={c.left}>
                <Grid container className={c.infoWrapper}>
                {exam.exam_data && exam.exam_data.subject_name}
                {exam.exam_data && exam.exam_data.jenjang}
                {exam.exam_data && exam.exam_data.grade_num}
                </Grid>
                <Grid container className={c.soalWrapper}>
                    konten soal
                </Grid>

            </Grid>

            <Grid item xs={4} container direction='column' justify='space-between' className={c.right}>
                <Grid container className={c.timerWrapper}>
                    timer
            </Grid>
                <Grid container className={c.answerWrapper}>
                    jawaban
            </Grid>

            </Grid>

            <Grid item xs={12} container className={c.navigationWrapper}>

                <Grid container justify='space-around' alignItems='flex-end'>
                    <Button variant="contained" color="primary" className={c.button}>
                        sebelumnya
                    </Button>

                    <Button variant="contained" color="primary" className={c.button}>
                        ragu
                    </Button>

                    <Button variant="contained" color="primary" className={c.button}>
                        selanjutnya
                    </Button>

                    <Button variant="contained" color="primary" className={c.button} onClick={finish}>
                        selesai
                    </Button>

                </Grid>




            </Grid>
        </Grid>
    )
}

export default withRouter(ExamPage)