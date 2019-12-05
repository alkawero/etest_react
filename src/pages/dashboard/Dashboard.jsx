import React, { useState, useEffect } from "react";
import { useInterval, useUpdateEffect } from "react-use";
import { getExamsData, setActivePage } from "reduxs/actions";
import { withRouter } from "react-router";
import { doGet,doPatch } from "apis/api-service";
import useStyles from "./dashboardStyle";
import { useCommonStyles } from "themes/commonStyle";
import clsx from "clsx";
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
import format from "date-fns/format";
import parse from "date-fns/parse";
import isToday from "date-fns/isToday";
import Conditional from "components/Conditional";
import Protected from "components/Protected";
import formatDistance from "date-fns/formatDistance";
import Hidden from '@material-ui/core/Hidden';
import {
  MuiPickersUtilsProvider,  
  KeyboardDatePicker,DatePicker
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { useDispatch, useSelector } from "react-redux";


const Dashboard = props => {
  const classes = useStyles();
  const common = useCommonStyles();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const exam_redux = useSelector(state => state.exam);
  const ui = useSelector(state => state.ui);

  const [examData, setExamData] = useState([]);
  const [exam, setExam] = useState(null);

  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);
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
    const response = await doGet("param", params);
    setDataExamActivity(
      response.data.map(j => ({ label: j.value, value: j.num_code }))
    );
  };

  useInterval(
    () => {      
      if(ui.active_page.access.includes('E'))  
      getExam()        
    },
    2000
  );

  useEffect(() => {
    getDataExamActivity();
    getExam();
  }, []);

  useUpdateEffect(() => {
    getExam();
  }, [examActivity, filterStartDate,filterEndDate]);

  const getExam = async () => {
    const roles = user.roles.map(r=>(r.id))
    let params = {
      user_role:JSON.stringify(roles),
      user_id:user.id
    };

    if (roles.includes(1)) {//if student
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

    const response = await doGet("exam", params);
    if (!response.error) {
      setExamData(response.data);
    }
  };

  const changeExamActivity = async act => {
    let params = { id: exam.id, activity: act };

    const response = await doPatch("exam/activity", params, "start exam");
    if (!response.error) {
      getExam();
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
      dispatch(setActivePage(nextPage));
      dispatch(getExamsData(exam));
      props.history.push("/exam");
    }
  };

  return (
    <Grid container className={classes.root} direction="column">
      <Grid container alignItems='flex-start'>
      <Hidden mdUp>
      <Grid item xs={2} container justify='center' alignItems='center'>
      <IconButton onClick={()=>{}} size="small">
                  <MenuIcons fontSize="inherit" />
      </IconButton>
      </Grid>
      </Hidden>  
      
      <Hidden smDown>
        <Grid item xs={2} container alignItems="flex-start" direction="column">
          <Grid>
            <Chip label="Exam Schedules" variant="outlined" onClick={getExam} />
          </Grid>
          <Grid>
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
          <Grid>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                disableToolbar
                clearable
                autoOk
                format="dd/MM/yyyy"
                margin="normal"
                id="filter-start-date"
                label="filter start date"
                value={filterStartDate}
                onChange={filterStartDateChange}
                KeyboardButtonProps={{
                  "aria-label": "filter start date"
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                disableToolbar                
                clearable
                autoOk
                format="dd/MM/yyyy"
                margin="normal"
                id="filter-end-date"
                label="filter end date"
                value={filterEndDate}
                onChange={filterEndDateChange}
                KeyboardButtonProps={{
                  "aria-label": "filter end date"
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
        </Hidden>
        <Grid
          item
          xs={10}
          container
          spacing={2}
          wrap="nowrap"
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
                      <Protected current={ui.active_page.access} only='P'>
                      <IconButton
                        aria-label="settings"
                        className={classes.iconButton}
                        onClick={menuExamClick(exam)}
                      >
                        <MoreVert />
                      </IconButton>
                      </Protected>
                    }
                    subheader={exam.exam_type.value}
                    style={{ color: "white", backgroundColor: "#15cd8f" }}
                  />
                  <CardContent>
                    <Grid container direction="column" justify="space-between">
                      <Typography
                        variant="h5"
                        component="h2"
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
                          <Conditional condition={exam.activity.num_code === 1 && (user.status!==1)}>
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
          </Menu>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withRouter(Dashboard);
