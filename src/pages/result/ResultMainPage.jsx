import React, { useState, useEffect,useCallback } from "react";
import { infoSnackbar } from "reduxs/actions";
import clsx from "clsx";
import useStyles,{selectCustomZindex} from "./resultStyle";
import {
  useCommonStyles,
  selectCustomSize,
  selectFullSize
} from "themes/commonStyle";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { doGet } from "apis/api-service";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Search from "@material-ui/icons/Search";
import PopUp from "components/PopUp";
import Select from "react-select";
import RefreshButton from "components/RefreshButton";
import {
  Switch,
  Route,
  useRouteMatch,
  useHistory
} from "react-router-dom";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import format from "date-fns/format";
import ResultSiswaPage from "./ResultSiswaPage";
import ResultKelasPage from "./ResultKelasPage";
import ResultSekolahPage from "./ResultSekolahPage";
import { useSelector, useDispatch } from "react-redux";
import Conditional from "components/Conditional";

const ResultMainPage = props => {
  const classes = useStyles();
  const common = useCommonStyles();
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  let { url } = useRouteMatch();
  let history = useHistory();
  const [activePath, setActivePath] = React.useState("/home/result/siswa");
  const [filterAnchor, setFilterAnchor] = useState(null);
  
  const [dataParticipantRole, setdataParticipantRole] = useState([]);

  const getdataParticipantRole = async () => {    
      const params = {  };
      const response = await doGet("role/options", params);
      const options = response.data.map(item => ({
        label: item.name,
        value: item.id,
        code: item.code
      }));      
      setdataParticipantRole(options);    
  };
  const [participantRole, setparticipantRole] = useState(null);
  const participantRoleChange = e => {
    setparticipantRole(e);      
  };
  
  const [dataJenjang, setDataJenjang] = useState([]);
  const [filterJenjang, setFilterJenjang] = useState(null);
  const filterJenjangChange = e => {    
    setFilterJenjang(e);
    setFilterGrade(null);
    getDataGrade(e);
  };
  const getDataJenjang = async () => {
    const params = { group: "jenjang" };
    const response = await doGet("param", params);
    setDataJenjang(
      response.data.map(j => ({ label: j.value, value: j.char_code }))
    );
  };

  const [dataGrade, setDataGrade] = useState([]);
  const [filterGrade, setFilterGrade] = useState(null);
  const filterGradeChange = e => {
    setFilterSubject(null)
    setFilterExam(null)
    setFilterGrade(e);
    getDataSubject(e);
    getDataFilterClass(e);
  };
  const getDataGrade = async jenjang => {
    if (jenjang !== null) {
      const params = { group: "grade", key: jenjang.value };
      const response = await doGet("param", params);
      const grades = response.data.map(grade => ({
        label: grade.value,
        value: grade.char_code
      }));
      setDataGrade(grades);
    }
  };

  const [datafilterClass, setDataFilterClass] = useState([]);

  const getDataFilterClass = async grade => {
    if (filterJenjang !== null && grade !== null) {
      const params = {
        jenjang: filterJenjang.value,
        grade_num: grade.label,
        grade_char: grade.value
      };
      const response = await doGet("kelas", params);
      setDataFilterClass(
        response.data.map(kelas => ({
          value: kelas.id,
          label: kelas.name
        }))
      );
    }
  };

  const [dataSubject, setDataSubject] = useState([]);
  const [filterSubject, setFilterSubject] = useState(null);
  const filterSubjectChange = e => {
    setFilterSubject(e);
    setFilterExam(null)
  };
  const getDataSubject = async grade => {    
    if (filterJenjang !== null && grade !== null) {
      const params = { jenjang: filterJenjang.value, grade: grade.value };
      const response = await doGet("mapel", params);
      setDataSubject(
        response.data.map(data => ({ label: data.name, value: data.id }))
      );
    }
  };

  const [dataFilterExam, setDataFilterExam] = useState([]);
  const [filterExam, setFilterExam] = useState(null);
  const filterExamChange = e => {
    setFilterExam(e);
  };

  const [dataFilterExamType, setDataFilterExamType] = useState([]);
  const [filterExamType, setFilterExamType] = useState(null);
  const filterExamTypeChange = e => {
    setFilterExamType(e);
  };
  const getDataFilterExamType = async () => {
    const params = { group: "exam_type" };
    const response = await doGet("param", params);
    setDataFilterExamType(
      response.data.map(j => ({ label: j.value, value: j.num_code }))
    );
  };

  const [filterStartDate, setFilterStartDate] = useState(new Date());
  const [filterEndDate, setFilterEndDate] = useState(new Date());
  const filterStartDateChange = e => {
    setFilterStartDate(e);
  };
  const filterEndDateChange = e => {
    setFilterEndDate(e);
  };

  useEffect(() => {
    getdataParticipantRole()
    getDataFilterExamType();
    getDataJenjang();
  }, []);

  const getExamFilter = async () => {
    const roles = user.roles.map(r => r.id);
    let params = {
      user_role: JSON.stringify(roles),
      user_id: user.id,
      for_select: true
    };

    if (filterStartDate !== null && !isNaN(filterStartDate)) {
      params = { ...params, start_date: format(filterStartDate, "yyyy/MM/dd") };
    }

    if (filterEndDate !== null && !isNaN(filterEndDate)) {
      params = { ...params, end_date: format(filterEndDate, "yyyy/MM/dd") };
    }

    if (filterJenjang !== null) {
      params = { ...params, jenjang: filterJenjang.value };
    }

    if (filterGrade !== null) {
      params = { ...params, grade: filterGrade.value };
    }

    if (filterSubject !== null) {
      params = { ...params, subject: filterSubject.value };
    }

    const response = await doGet("exam", params);
    if (!response.error) {
      setDataFilterExam(response.data);
    }
  };

  const getExamFilterCallBack = useCallback(getExamFilter,[filterSubject, filterExamType, filterStartDate, filterEndDate])

  useEffect(() => {
    if (
      filterSubject &&
      filterExamType &&
      filterStartDate !== null &&
      !isNaN(filterStartDate) &&
      filterEndDate !== null &&
      !isNaN(filterEndDate)
    ) {
      getExamFilterCallBack();
    }
  }, [filterSubject, filterExamType, filterStartDate, filterEndDate,getExamFilterCallBack]);

  const tabChange = (event, path) => {
    history.push(path);
    setActivePath(path);
  };

  const clear = () => {
    setFilterJenjang(null);
    setFilterGrade(null);
  };

  const filterClick = event => {
    setFilterAnchor(filterAnchor ? null : event.currentTarget);
  };

  const [dataByNis, setDataByNis] = useState({});

  const getDataByNis = async nis => {
    setDataByNis({});
    if (filterExam === null) {
      dispatch(infoSnackbar("please choose the exam"));
    } else {
      let params = {
        exam_id: filterExam.value,
        nis: nis
      };

      const response = await doGet("result/nis", params);

      if (response.data) setDataByNis(response.data);
    }
  };

  const [dataByClass, setDataByClass] = useState([]);
  const getDataByClass = async kelas => {    
    setDataByClass([]);
    if (kelas === null ) {
      dispatch(infoSnackbar("please choose the class"));
    } else if (filterJenjang===null) {
      dispatch(infoSnackbar("please choose jenjang"));
    }else if (filterExam===null) {
      dispatch(infoSnackbar("please choose the exam"));
    }
    else {
      let params = {
        exam_id: filterExam.value,
        kelas_id: kelas.value,
        jenjang:filterJenjang.value
      };

      const response = await doGet("result/kelas", params);

      if (response.data) setDataByClass(response.data);
    }
  };

  return (
    <>
      <Conditional condition={filterAnchor!==null}>
               
          <Grid
            item
            spacing={1}
            container
            className={classes.filterActions}
            style={{padding:8}}
          >
            <Grid item>
            <Select
              value={participantRole}
              onChange={participantRoleChange}
              name="participant Type"
              options={dataParticipantRole}
              placeholder="participant..."
              styles={selectCustomZindex}
            />
            </Grid>
            <Grid item>
              <Select
                value={filterJenjang}
                onChange={filterJenjangChange}
                name="jenjang"
                options={dataJenjang}
                styles={selectCustomZindex}
                isClearable={true}
                placeholder={"select jenjang..."}
              />
            </Grid>
            <Grid item>
              <Select
                value={filterGrade}
                onChange={filterGradeChange}
                name="grade"
                options={dataGrade}
                styles={selectCustomZindex}
                isClearable={true}
                placeholder={"select grade..."}
              />
            </Grid>

            <Grid item>
              <Select
                value={filterSubject}
                onChange={filterSubjectChange}
                name="subject"
                options={dataSubject}
                isClearable={true}
                placeholder="select subject..."
                styles={selectCustomZindex}
              />
            </Grid>

            <Grid item>
              <Select
                value={filterExamType}
                onChange={filterExamTypeChange}
                name="exam type"
                options={dataFilterExamType}
                placeholder="exam type..."
                styles={selectCustomZindex}                
              />
            </Grid>

            <Grid item>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  id="filter-start-date"
                  label="filter start date"
                  value={filterStartDate}
                  onChange={filterStartDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "start date"
                  }}
                  autoOk
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  id="filter-end-date"
                  label="filter end date"
                  value={filterEndDate}
                  onChange={filterEndDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "end date"
                  }}
                  autoOk
                />
              </MuiPickersUtilsProvider>
            </Grid>

            <Grid item xs={4} className={classes.selectContainer}>
              <Select
                value={filterExam}
                onChange={filterExamChange}
                name="exams"
                options={dataFilterExam}
                placeholder="axams..."
                styles={selectCustomZindex}
              />
            </Grid>
            <Grid item xs={1} container justify="center" alignItems="center">
              <RefreshButton action={clear} />
            </Grid>
          
        </Grid>  
        </Conditional>
      <Grid
        wrap="nowrap"
        container
        justify="space-between"
        className={classes.header}
      >        
        <Grid item>
          <Tabs
            value={activePath}
            onChange={tabChange}
            aria-label="simple tabs example"
            centered
          >
            <Tab label="Siswa" value={`${url}/siswa`} />
            <Tab label="Kelas" value={`${url}/kelas`} />            
          </Tabs>
        </Grid>
        <Grid item>
          <IconButton
            onClick={filterClick}
            className={common.headerIconButton}
            size="medium"
          >
            <Search fontSize="inherit" />
          </IconButton>
        </Grid>
      </Grid>
      <Grid container justify="center" className={classes.content_wrapper}>
        <Grid container className={classes.content}>
          <Grid item xs={12} container className={clsx(common.borderTopRadius)}>
            <Switch>
              <Route exact path="/home/result">
                <ResultSiswaPage onGo={getDataByNis} data={dataByNis} />
              </Route>
              <Route path="/home/result/siswa">
                <ResultSiswaPage onGo={getDataByNis} data={dataByNis} />
              </Route>
              <Route path="/home/result/kelas">
                <ResultKelasPage
                  onGo={getDataByClass}
                  data={dataByClass}
                  filterOptions={datafilterClass}
                />
              </Route>
              <Route path="/home/result/sekolah">
                <ResultSekolahPage onGo={getDataByNis} data={dataByNis} />
              </Route>
            </Switch>
          </Grid>
        </Grid>
      </Grid>

   
    </>
  );
};

export default ResultMainPage;
