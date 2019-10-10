import React, { useState, useEffect } from 'react';
import { useUpdateEffect } from 'react-use';
import { doGet, doPost, doDelete, doPut, doPatch } from 'apis/api-service';
import useStyles from './dashboardStyle';
import { useCommonStyles } from 'themes/commonStyle'
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import MoreVert from '@material-ui/icons/MoreVert';
import Create from '@material-ui/icons/Create';
import Chip from '@material-ui/core/Chip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Select from 'react-select';
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import isToday from 'date-fns/isToday'

import formatDistance from 'date-fns/formatDistance'
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';



const Dashboard = (props) => {
    const classes = useStyles()
    const common = useCommonStyles()
    const [examData, setExamData] = useState([])
    const [exam, setExam] = useState(null)

    const [examDate, setExamDate] = useState(null)
    const examDateChange = (e) => {
        setExamDate(e)
    }
    const [dataExamActivity, setDataExamActivity] = useState([])
    const [examActivity, setExamActivity] = useState(null)
    const examActivityChange = (e) => {
        setExamActivity(e)
    }
    const getDataExamActivity = async () => {
        const params = { group: 'exam_activity' }
        const response = await doGet('param', params)
        setDataExamActivity(response.data.map(j => ({ label: j.value, value: j.num_code })));
    }

    useEffect(() => {
        getDataExamActivity()
        getExam()
    }, [])

    useUpdateEffect(() => {
        getExam()
    }, [examActivity, examDate])


    const getExam = async () => {
        let params = {}
        if (examActivity != null) {
            params = { ...params, activity: examActivity.value }
        }
        if (examDate != null && !isNaN(examDate)) {
            params = { ...params, schedule_date: format(examDate, 'yyyy/MM/dd') }
        }



        const response = await doGet('exam', params)
        if (!response.error) {
            setExamData(response.data)
        }

    }

    const changeExamActivity = async (act) => {
        let params = { id: exam.id, activity: act }

        const response = await doPatch('exam/activity', params, 'start exam')
        if (!response.error) {
            getExam()
            menuExamClose()
        }

    }


    const [anchorMenuExam, setAnchorMenuExam] = React.useState(null);
    const openMenuExam = Boolean(anchorMenuExam);

    const menuExamClick = exam => event => {
        setAnchorMenuExam(event.currentTarget);
        setExam(exam)
    };

    const menuExamClose = () => {
        setAnchorMenuExam(null);
    };



    return (
        <Grid container className={classes.root} direction='column'>
            <Grid container>
                <Grid item xs={2} container alignItems='flex-start' direction='column'>
                    <Grid>
                        <Chip label="Exam Schedules" variant="outlined" />
                    </Grid>
                    <Grid>
                        <Select
                            value={examActivity}
                            onChange={examActivityChange}
                            name='exam activity'
                            options={dataExamActivity}
                            placeholder='exam activity'
                            className={classes.select}
                            isClearable={true}
                        />
                    </Grid>
                    <Grid>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="dd/MM/yyyy"
                                margin="normal"
                                id="schedule-date"
                                label="exam date"
                                value={examDate}
                                onChange={examDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                </Grid>
                <Grid item xs={9} container spacing={2} wrap='nowrap' className={classes.cardWrapper}>
                    {
                        examData.map(exam => {
                            const now = new Date()
                            return (
                                <Grid item key={exam.id}>
                                    <Card className={classes.card}>
                                        <CardHeader
                                            title={exam.exam_type.char_code}
                                            action={
                                                <IconButton aria-label="settings" className={classes.iconButton} onClick={menuExamClick(exam)}>
                                                    <MoreVert />
                                                </IconButton>
                                            }
                                            subheader={exam.exam_type.value}
                                            style={{ color: 'white', backgroundColor: '#15cd8f' }}
                                        />
                                        <CardContent>
                                            <Typography variant="h5" component="h2" className={classes.title} gutterBottom>
                                                {exam.grade_num} {' '} {exam.jenjang}
                                            </Typography>
                                            <Typography variant="subtitle1" color="textSecondary" className={classes.title} gutterBottom>
                                                {exam.subject_name}
                                            </Typography>
                                            <Typography variant="subtitle1" color="textSecondary" className={classes.title} gutterBottom>
                                                {exam.schedule_date} ( {
                                                    isToday(parse(exam.schedule_date, 'yyyy-MM-dd', new Date())) ? 'today' :
                                                        formatDistance(
                                                            parse(exam.schedule_date, 'yyyy-MM-dd', new Date()),
                                                            new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                                                            { addSuffix: true })}
                                                )
                                        </Typography>
                                            <Grid container justify='space-between' alignItems='center'>
                                                <span>{exam.start_time.substring(11, 16)}</span>
                                                <span>-</span>
                                                <span>{exam.end_time.substring(11, 16)}</span>
                                                <Chip
                                                    label={exam.activity.value}
                                                    color="primary"
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    className={classes.button}
                                                    endIcon={<Create/>}
                                                >
                                                    take exam now
                                                </Button>
                                            </Grid>

                                        </CardContent>
                                    </Card>
                                </Grid>
                            )
                        })

                    }

                    <Menu
                        id="long-menu"
                        anchorEl={anchorMenuExam}
                        keepMounted
                        open={openMenuExam}
                        onClose={menuExamClose}
                    >
                        <MenuItem key='start' onClick={() => changeExamActivity(1)}>Start the exam</MenuItem>
                        <MenuItem key='complete' onClick={() => changeExamActivity(2)}>exam is Complete</MenuItem>
                        <MenuItem key='cancel' onClick={() => changeExamActivity(3)}>Cancel the exam</MenuItem>
                        <MenuItem key='reset' onClick={() => changeExamActivity(0)}>Reset</MenuItem>
                    </Menu>
                </Grid>
            </Grid>

        </Grid>
    )
}

export default Dashboard
