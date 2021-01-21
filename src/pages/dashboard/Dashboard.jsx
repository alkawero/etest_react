import React, { useState, useEffect, useCallback } from "react";
import { useInterval, useUpdateEffect } from "react-use";
import { getExamsData, setActivePage, setGlobalError } from "reduxs/actions";
import { withRouter } from "react-router";
import { doGet, doPatch, doSilentPost } from "apis/api-service";
import useStyles from "./dashboardStyle";
import { useCommonStyles } from "themes/commonStyle";
import clsx from "clsx";
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import MoreVert from "@material-ui/icons/MoreVert";
import MenuIcons from "@material-ui/icons/Menu";
import Chip from "@material-ui/core/Chip";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "react-select";
import {format,parse,endOfMonth,startOfMonth,isToday} from "date-fns";
import Conditional from "components/Conditional";
import Protected from "components/Protected";
import formatDistance from "date-fns/formatDistance";
import Hidden from "@material-ui/core/Hidden";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { useDispatch, useSelector } from "react-redux";
import {EchoInstance} from 'App.js'
import ExamMonitoring from './ExamMonitoring'

const Dashboard = props => {
  const classes = useStyles();
  const common = useCommonStyles();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const ui = useSelector(state => state.ui);
  const [openMonitoring, setopenMonitoring] = useState(false);

  
  
  
  const getHeaders = ()=> {
    return {"Authorization": user.token}    
  }
  
  const handleopenMonitoring = () => {
    setopenMonitoring(true);
    menuExamClose();
  };

  const handleCloseMonitoring = () => {
    setopenMonitoring(false);
  };

  const [examData, setExamData] = useState([]);
  const [finishedExams, setfinishedExams] = useState([]);
  const [answeringExams, setansweringExams] = useState([]);
  const [exam, setExam] = useState(null);

  const [filterStartDate, setFilterStartDate] = useState(startOfMonth(new Date()));
  const [filterEndDate, setFilterEndDate] = useState(endOfMonth(new Date()));
  const filterStartDateChange = e => {
    setFilterStartDate(e);
  };
  const filterEndDateChange = e => {
    setFilterEndDate(e);
  };
  const [dataExamActivity, setDataExamActivity] = useState([]);
  const [examActivity, setExamActivity] = useState(null);
  const examActivityChange = e => {
    setExamActivity(e);
  };
  const getDataExamActivity = async () => {
    const params = { group: "exam_activity" };
    
    const response = await doGet("param", params, getHeaders());
    setDataExamActivity(
      response.data.map(j => ({ label: j.value, value: j.num_code }))
    );
  };

  const getFinishedExams = async () => {//
    let params = {
      nomor_induk: user.id
    };
    
    const response = await doGet("exam/user/finish", params,getHeaders());
    if (!response.error) {
      setfinishedExams(response.data);
    }
  }

  const getAnsweringExams = async () => {//
    let params = {
      nomor_induk: user.id
    };
    
    const response = await doGet("exam/user/answering", params,getHeaders());
    if (!response.error) {
      setansweringExams(response.data);
    }
  }

  

  const refresh = () => {
    getExam()
    
  }

  const getExam = async () => {
    const roles = user.roles.map(r => r.id);
    let params = {
      user_role: JSON.stringify(roles),
      user_id: user.id,
      status:1
    };

    if (roles.includes(1)) {
      //if student
      params = { ...params, exam_account_num: user.name };
    }

    if (examActivity != null) {
      params = { ...params, activity: examActivity.value };
    }
    if (filterStartDate != null && !isNaN(filterStartDate)) {
      params = { ...params, start_date: format(filterStartDate, "yyyy/MM/dd") };
    }

    if (filterEndDate != null && !isNaN(filterEndDate)) {
      params = { ...params, end_date: format(filterEndDate, "yyyy/MM/dd") };
    }

    
    const response = await doGet("exam", params, getHeaders());

    if (!response.error) {
      setExamData(response.data);
    }
    getFinishedExams()
    getAnsweringExams()
  };

  const getExamCallback = useCallback(getExam, []);

  
  useEffect(() => {
    
  }, []);

  useEffect(() => {
    getDataExamActivity();
    getExamCallback()
    
  }, [getExamCallback]);

  useUpdateEffect(() => {
    getExam();
    ;
  }, [examActivity, filterStartDate, filterEndDate]);

  const changeExamActivity = async act => {
    let params = { id: exam.id, activity: act };

    
    const response = await doPatch("exam/activity", params, "change exam activity",getHeaders());
    if (response && !response.error) {
      //getExam();
      menuExamClose();
    }
  };

  const [anchorMenuExam, setAnchorMenuExam] = React.useState(null);
  const openMenuExam = Boolean(anchorMenuExam);

  const menuExamClick = exam => event => {
    setAnchorMenuExam(event.currentTarget);
    setExam(exam);
  };

  const menuExamClose = () => {
    setAnchorMenuExam(null);
  };

  const takeExam = exam => {
    const nextPage = user.pages.filter(p => p.path === "/exam")[0];
    if (nextPage) {
      const params = {
        nomor_induk:user.id,
        exam_id:exam.id
      }

      doSilentPost("exam/take", params, getHeaders());
      dispatch(setActivePage(nextPage));
      dispatch(getExamsData({exam:exam, user:user}));
      props.history.push("/exam");
    }
  };

  

  useEffect(() => {
    
    EchoInstance.channel('exam')
    .listen('ExamActivity', (e) => {            
      getExam()
      
    });
    return function cleanup() {
      EchoInstance.leaveChannel('exam');
    }
        
  },[filterStartDate,filterEndDate]);

  return (
    <>
    <Grid container className={classes.root} direction="column">
      <Grid container alignItems="flex-start">
        <Hidden mdUp>
          <Grid item xs={2} container justify="center" alignItems="center">
            <IconButton onClick={() => {}} size="small">
              <MenuIcons fontSize="inherit" />
            </IconButton>
          </Grid>
        </Hidden>        

        <Grid container spacing={1} alignItems="center" style={{marginBottom:8}}>
          <Grid item container alignContent="center" style={{width:150, paddingTop:8}}>
              <Chip
                label="Refresh Schedules"
                variant="outlined"
                onClick={refresh}
              />
            </Grid>
            <Grid item>
              <Select
                value={examActivity}
                onChange={examActivityChange}
                name="exam activity"
                options={dataExamActivity}
                placeholder="exam activity"
                className={classes.select}
                isClearable={true}
              />
            </Grid>
            <Grid item>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  disableToolbar
                  clearable
                  autoOk
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="dense"
                  id="filter-start-date"
                  label="filter start date"
                  value={filterStartDate}
                  onChange={filterStartDateChange}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  disableToolbar
                  clearable
                  autoOk
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="dense"
                  id="filter-end-date"
                  label="filter end date"
                  value={filterEndDate}
                  onChange={filterEndDateChange}
                />
              </MuiPickersUtilsProvider>
            </Grid>
        </Grid>
        <Grid
          item
          container
          spacing={2}          
          className={classes.cardWrapper}
        >
          {examData.map(exam => {
            const now = new Date();
            return (
              <Grid item key={exam.id}>
                <Card className={classes.card}>
                  <CardHeader
                    title={exam.exam_type.char_code}
                    action={
                      <Conditional condition={exam.pengawas.emp_id===user.id}>                      
                        <IconButton
                          aria-label="settings"
                          className={classes.iconButton}
                          onClick={menuExamClick(exam)}
                        >
                          <MoreVert />
                        </IconButton>
                      </Conditional>
                    }
                    subheader={exam.exam_type.value}
                    style={{ color: "white", backgroundColor: "#15cd8f" }}
                  />
                  <CardContent>
                    <Grid container direction="column" justify="space-between">
                      <Typography
                        variant="h6"                        
                        className={classes.title}
                        gutterBottom
                      >
                        {exam.rancangan && exam.rancangan.title}
                      </Typography>
                      
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        className={classes.title}
                        gutterBottom
                      >                        
                        {exam.grade_num} {exam.jenjang}
                      </Typography>

                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        className={classes.title}
                        gutterBottom
                      >                        
                        {exam.subject_name}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        className={classes.title}
                        gutterBottom
                      >
                        {exam.schedule_date} ({" "}
                        {isToday(
                          parse(exam.schedule_date, "yyyy-MM-dd", new Date())
                        )
                          ? "today"
                          : formatDistance(
                              parse(
                                exam.schedule_date,
                                "yyyy-MM-dd",
                                new Date()
                              ),
                              new Date(
                                now.getFullYear(),
                                now.getMonth(),
                                now.getDate()
                              ),
                              { addSuffix: true }
                            )}
                        )
                      </Typography>
                      <Grid
                        container
                        justify="space-between"
                        alignItems="center"
                      >
                        <span>{exam.start_time.substring(11, 16)}</span>
                        <span>-</span>
                        <span>{exam.end_time.substring(11, 16)}</span>
                        <Chip label={exam.activity.value} color="primary" />
                        <Grid
                          container
                          justify="center"
                          alignItems="center"
                          className={clsx(
                            common.marginTop,
                            classes.buttonWrapper
                          )}
                        >
                          <Conditional
                            condition={
                              exam.activity.num_code === 1 
                              && user.status !== 2
                              && user.roles.map(r=>(r.id)).includes(exam.participant_role)
                              && !finishedExams.includes(exam.id)
                            }
                          >
                            <Button
                              variant="contained"
                              color="primary"
                              className={common.backgroundColorHijau}
                              onClick={() => takeExam(exam)}
                            >
                              take exam now
                            </Button>
                          </Conditional>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}

          
        </Grid>
      </Grid>
    </Grid>

          <Menu
            id="long-menu"
            anchorEl={anchorMenuExam}
            keepMounted
            open={openMenuExam}
            onClose={menuExamClose}
          >
            <MenuItem key="start" onClick={() => changeExamActivity(1)}>
              Start the exam
            </MenuItem>
            <MenuItem key="complete" onClick={() => changeExamActivity(2)}>
              exam is Complete
            </MenuItem>
            <MenuItem key="cancel" onClick={() => changeExamActivity(3)}>
              Cancel the exam
            </MenuItem>
            <MenuItem key="reset" onClick={() => changeExamActivity(0)}>
              Reset
            </MenuItem>
            <MenuItem key="monitor" onClick={() => handleopenMonitoring()}>
              Monitor
            </MenuItem>
          </Menu>

    <Dialog fullScreen open={openMonitoring} onClose={handleCloseMonitoring} TransitionComponent={Transition}>
      <ExamMonitoring 
      exam={exam}
      user={user}
      handleClose={handleCloseMonitoring}/>
    </Dialog>
    </>
  );
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default withRouter(Dashboard);
