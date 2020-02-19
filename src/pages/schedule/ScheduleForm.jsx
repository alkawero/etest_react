import React, { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { isEmpty } from "lodash";
import Grid from "@material-ui/core/Grid";
import { useUpdateEffect } from "react-use";
import clsx from "clsx";
import { doUpload, doPost, doGet, doPut,doDownloadPdf } from "apis/api-service";
import useStyles, { selectCustomZindex } from "./scheduleStyle";
import { useCommonStyles } from "themes/commonStyle";
import Button from "@material-ui/core/Button";
import DateFnsUtils from "@date-io/date-fns";
import differenceInMinutes from "date-fns/differenceInMinutes";
import format from "date-fns/format";
import parse from "date-fns/parse";
import {
  MuiPickersUtilsProvider,
  TimePicker,
  DatePicker
} from "@material-ui/pickers";
import TextField from "@material-ui/core/TextField";

import "assets/css/react-draft-wysiwyg.css";

import AddButton from "components/AddButton";

import Conditional from "components/Conditional";

import PopUp from "components/PopUp";

import { UserContext } from "contexts/UserContext";
import { default as RSelect } from "react-select";
import SearchListAsync from "components/SearchListAsync";
import BottomDrawer from "components/BottomDrawer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";

import CheckButton from "components/CheckButton";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Close from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import MultipleSelectCheckBox from "components/MultipleSelectCheckBox";


const ScheduleForm = ({ create, update, onClose, exam, action, open }) => {
      
  const common = useCommonStyles();
  const classes = useStyles();
  

  const user = useContext(UserContext);
  const currentAccess = useSelector(state => state.ui.active_page.access);

  const [errorState, setErrorState] = useState({});

  const [status, setStatus] = useState(0);
  const [openStudentsDrawer, setopenStudentsDrawer] = useState(false);
  const [isUserGenerated, setIsUserGenerated] = useState(false);
  
  const [openBottomDrawer, setOpenBottomDrawer] = useState(false);
  const [bottomDrawerTittle, setBottomDrawerTittle] = useState("");

  const [participantsClass, setParticipantsClass] = useState([]);
  const [participantChanged, setParticipantChanged] = useState(false);

  const updateStudentParticipant = async () => {
    const params={
      exam_id:exam.id,
      classes:participantsClass.map(cls=>(cls.id))
    }
    await doPut('exam/users',params,'update peserta')
    setParticipantChanged(false)
  }
  

  const [participantsUser, setParticipantsUser] = useState([]);
  const getParticipantsUser = async () => {
    const params = {
      jenjang: jenjang.value,
      ids: JSON.stringify(
        participantsClass.map(cls => cls.id)
        )
    };
    const response = await doGet("kelas/many/student", params);
    setParticipantsUser(response.data);
  };

  const [participantsClassOption, setParticipantsClassOption] = useState([]);
  const getParticipantsClassOption = async () => {
    const params = {
      jenjang: jenjang.value,
      grade_num: grade.label,
      grade_char: grade.value
    };
    const response = await doGet("kelas", params);
    setParticipantsClassOption(
      response.data.map(kelas => ({
        id: kelas.id,
        value: kelas.name,
        description: kelas.description
      }))
    );
  };

  const chooseParticipantsClass = p => {
    setParticipantsClass(p);
    setParticipantChanged(true)
  };

  const [rancanganSoal, setRancanganSoal] = useState(null);
  const [rancanganSoalData, setRancanganSoalData] = useState([]);
  const getRancanganSoal = async () => {
    let params = {};
    if (jenjang !== null) {
      params = { ...params, jenjang: jenjang.value };
    }
    if (grade !== null) {
      params = { ...params, grade: grade.value };
    }
    if (subject !== null) {
      params = { ...params, subject: subject.value };
    }

    const response = await doGet("rancangan", params);
    if (!response.error) {
      setRancanganSoalData(response.data);
    }
  };

  const [pengawas, setPengawas] = useState(null);
  const addPengawas = user => {
    setPengawas({ id: user.id, name: user.text });
    setPopUpAnchor(null);
  };

  const removePengawas = user => {
    if (action === "edit" || action === "create") {
      setPengawas(null);
    }
  };

  const [popUpAnchor, setPopUpAnchor] = useState(null);
  const showAddPengawas = e => {
    setPopUpAnchor(popUpAnchor ? null : e.currentTarget);
  };

  const [scheduleDate, setScheduleDate] = useState(new Date());
  const scheduleDateChange = e => {
    if (action === "edit" || action === "create") {
      setScheduleDate(e);
    }
  };
  const [scheduleTimeStart, setScheduleTimeStart] = useState(new Date());
  const scheduleTimeStartChange = e => {
    if (action === "edit" || action === "create") {
      setScheduleTimeStart(e);
    }
  };
  const [scheduleTimeEnd, setScheduleTimeEnd] = useState(new Date());
  const scheduleTimeEndChange = e => {
    if (action === "edit" || action === "create") {
      setScheduleTimeEnd(e);
    }
  };

  const [duration, setDuration] = useState(0);

  const [dataSubject, setDataSubject] = useState([]);
  const [subject, setSubject] = useState(null);
  const subjectChange = e => {
    if (action === "edit" || action === "create") {
      setSubject(e);
      setRancanganSoal(null);
    }
  };
  const getDataSubject = async () => {
    const params = { jenjang: jenjang.value, grade: grade.value };
    const response = await doGet("mapel", params);
    setDataSubject(
      response.data.map(data => ({ label: data.name, value: data.id }))
    );
  };

  const [dataExamType, setDataExamType] = useState([]);
  const [examType, setExamType] = useState(null);
  const examTypeChange = e => {
    if (action === "edit" || action === "create") setExamType(e);
  };
  const getDataExamType = async () => {
    const params = { group: "exam_type" };
    const response = await doGet("param", params);
    setDataExamType(
      response.data.map(j => ({ label: j.value, value: j.num_code }))
    );
  };

  const [dataSemester, setDataSemester] = useState([]);
  const [semester, setSemester] = useState(null);
  const semesterChange = e => {
    if (action === "edit" || action === "create") setSemester(e);
  };
  const getDataSemester = async () => {
    const params = { group: "semester", status: 1 };
    const response = await doGet("param", params);
    setDataSemester(
      response.data.map(j => ({ label: j.desc, value: j.num_code }))
    );
  };

  const [dataJenjang, setDataJenjang] = useState([]);
  const [jenjang, setJenjang] = useState(null);
  const jenjangChange = e => {
    if (action === "edit" || action === "create") setJenjang(e);
  };
  const getDataJenjang = async () => {
    const params = { group: "jenjang" };
    const response = await doGet("param", params);
    setDataJenjang(
      response.data.map(j => ({ label: j.value, value: j.char_code }))
    );
  };

  const [dataGrade, setDataGrade] = useState([]);
  const [grade, setGrade] = useState(null);
  const gradeChange = e => {
    if (action === "edit" || action === "create") {
      setGrade(e);
      setParticipantsClass([]);
      setParticipantChanged(true);
    }
    
  };
  const getDataGrade = async () => {
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

  useUpdateEffect(() => {
    if (open === false) clear();
  }, [open]);

  useUpdateEffect(() => {
    const minDiff = differenceInMinutes(scheduleTimeEnd, scheduleTimeStart);
    setDuration(minDiff);
  }, [scheduleTimeStart, scheduleTimeEnd]);

  const [tahunAjaran, setTahunAjaran] = useState("");
  const getTahunAjaran = async () => {
    const params = { group: "tahun_pelajaran", status: 1, single: 1 };
    const response = await doGet("param", params);
    setTahunAjaran(response.data.value);
  };

  useEffect(() => {
    getTahunAjaran();
    getDataSemester();
    getDataExamType();
    getDataJenjang();
  }, []);

  useUpdateEffect(() => {
    if (jenjang !== null && grade !== null) {
      getParticipantsClassOption();      
    }
  }, [grade]);

  useEffect(() => {
    //setting for detail/edit
    if (exam) {
      setExamType({
        label: exam.exam_type.value,
        value: exam.exam_type.num_code
      });
      setSemester({
        label: exam.exam_type.desc,
        value: exam.exam_type.num_code
      });
      setJenjang({
        label: exam.jenjang,
        value: exam.jenjang,
        load: "first-load"
      });
      setGrade({
        label: exam.grade_num,
        value: exam.grade_char,
        load: "first-load"
      });
      setSubject({
        label: exam.subject_name,
        value: exam.subject_id,
        load: "first-load"
      });
      setScheduleDate(parse(exam.schedule_date, "yyyy-MM-dd", new Date()));
      setScheduleTimeStart(
        parse(exam.start_time, "yyyy-MM-dd HH:mm:ss", new Date())
      );
      setScheduleTimeEnd(
        parse(exam.end_time, "yyyy-MM-dd HH:mm:ss", new Date())
      );
      setDuration(exam.duration);
      if (exam.pengawas_id !== null)
        setPengawas({ id: exam.pengawas.emp_id, name: exam.pengawas.emp_name });
      setRancanganSoal(exam.rancangan);
      setParticipantsClass(exam.class_participants);
      setIsUserGenerated(exam.user_generated)
    }
  }, [exam]);

  useUpdateEffect(() => {
    if (action === "edit" || action === "create") {
      if (jenjang === null) {
        setGrade(null);
        setDataGrade([]);
      } else {
        if (!jenjang.load) {
          setGrade(null);
          setDataGrade([]);
        }
        getDataGrade();
      }
    }
  }, [jenjang]);

  useUpdateEffect(() => {
    if (action === "edit" || action === "create") {
      if (grade === null) {
        setSubject(null);
        setDataSubject([]);
      } else {
        if (!grade.load) {
          setSubject(null);
          setDataSubject([]);
        }
        if (jenjang !== null) {
          getDataSubject();
        }
      }
    }
  }, [grade]);

  const showAddRancanganSoal = () => {
    getRancanganSoal();
    setOpenBottomDrawer(true);
    setBottomDrawerTittle("Add Rancangan Soal To Exam");
  };

  const closeAddRancanganSoal = () => {
    setRancanganSoalData([]);
    setOpenBottomDrawer(false);
  };

  const closeStudentsDrawer = () => {
    setopenStudentsDrawer(false);
  };

  const getById = async id => {
    const response = await doGet("rancangan/" + id);
    if (!response.error) {
      return response.data;
    }
  };

  

  const chooseRancanganSoal = soal => {
    setRancanganSoal(soal);
    closeAddRancanganSoal();
  };

  const removeRancanganSoal = () => {
    if (action === "edit" || action === "create") {
      setRancanganSoal(null);
    }
  };

  const showParticipantsUser = () => {
    getParticipantsUser();
    setopenStudentsDrawer(true);
    setBottomDrawerTittle("Exam's Participants");
  };

  const cetak = () => {
    const params={exam_id:exam.id}
    doDownloadPdf('exam/users/print',params);
  };

  const cancel = () => {
    clear();
    onClose();
  };

  const submit = () => {
    let errors = {};

    if (participantsClass.length < 1) {
      errors = {
        ...errors,
        eparticipants: "please choose the participants of this exam"
      };
    }

    if (jenjang === null) {
      errors = { ...errors, ejenjang: "please choose jenjang" };
    }

    if (grade === null) {
      errors = { ...errors, egrade: "please choose grade" };
    }

    if (subject === null) {
      errors = { ...errors, esubject: "please choose subject" };
    }

    if (pengawas === null) {
      errors = { ...errors, epengawas: "please add pengawas" };
    }

    if (rancanganSoal === null) {
      errors = { ...errors, erancangan: "please add rancangan soal" };
    }

    setErrorState(errors);

    if (isEmpty(errors)) {
      let newExam = {
        jenjang: jenjang.value,
        grade_char: grade.value,
        grade_num: grade.label,
        subject: subject.value,
        tahun_ajaran_char: tahunAjaran,
        creator: user.id,
        schedule_date: format(scheduleDate, "yyyy/MM/dd"),
        start_time: format(scheduleTimeStart, "yyyy/MM/dd HH:mm"),
        end_time: format(scheduleTimeEnd, "yyyy/MM/dd HH:mm"),
        status: status,
        exam_type: examType.value,
        duration: duration,
        pengawas: pengawas.id,
        rancangan: rancanganSoal.id,
        participant_class: participantsClass.map(cls => cls.id)
      };

      if (exam) {
        newExam = { ...newExam, id: exam.id };
        update(newExam);
      } else {
        create(newExam);
      }

      clear();
      onClose();
    }
  };

  const clear = () => {
    setExamType(null);
    setJenjang(null);
    setGrade(null);
    setSubject(null);

    setPengawas(null);
    setRancanganSoal(null);
    setErrorState({});
  };

  return (
    <>
      <Grid container direction="column" className={classes.addContent}>      
        <Grid container className={common.paddingX}>
          <Grid item className={common.marginBottom}>
            <RSelect
              value={examType}
              onChange={examTypeChange}
              name="exam type"
              options={dataExamType}
              placeholder="exam type..."
              styles={selectCustomZindex}
            />
          </Grid>

          <RSelect
            value={semester}
            onChange={semesterChange}
            name="semester"
            options={dataSemester}
            placeholder="semester..."
            styles={selectCustomZindex}
          />

          <RSelect
            value={jenjang}
            onChange={jenjangChange}
            name="jenjang"
            options={dataJenjang}
            placeholder="jenjang..."
            styles={selectCustomZindex}
          />

          <RSelect
            value={grade}
            onChange={gradeChange}
            name="grade"
            options={dataGrade}
            placeholder="grade..."
            styles={selectCustomZindex}
          />

          <RSelect
            value={subject}
            onChange={subjectChange}
            name="subject"
            options={dataSubject}
            placeholder="subject..."
            styles={selectCustomZindex}
          />

          <Conditional
            condition={
              rancanganSoal === null &&
              (action === "edit" || action === "create")
            }
          >
            <Grid
              container
              alignItems="center"
              style={{ height: 40, width: 210 }}
            >
              <AddButton
                text="Rancangan Soal"
                action={showAddRancanganSoal}
                classes={common.marginX}
              />
            </Grid>
          </Conditional>

          <MultipleSelectCheckBox
            readOnly={!(action === "edit" || action === "create")}
            value={participantsClass}
            options={participantsClassOption}
            onChange={chooseParticipantsClass}
            placeholder="class room"
          />

          <Conditional
            condition={
              pengawas === null && (action === "edit" || action === "create")
            }
          >
            <Grid
              container
              alignItems="center"
              style={{ height: 40, width: 160 }}
            >
              <AddButton
                text="Pengawas"
                action={showAddPengawas}
                classes={common.marginX}
              />
            </Grid>
          </Conditional>

          <Grid container>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                disableToolbar
                variant='inline'                
                autoOk
                format="dd/MM/yyyy"
                margin="normal"
                id="schedule-date"
                label="schedule date"
                value={scheduleDate}
                onChange={scheduleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date"
                }}
              />

              <TimePicker
                margin="normal"
                variant='inline'                
                id="schedule-time-start"
                label="schedule time start"
                value={scheduleTimeStart}
                onChange={scheduleTimeStartChange}
                KeyboardButtonProps={{
                  "aria-label": "change time"
                }}
              />

              <TimePicker
                margin="normal"
                variant='inline'                
                id="schedule-time-end"
                label="schedule time end"
                value={scheduleTimeEnd}
                onChange={scheduleTimeEndChange}
                KeyboardButtonProps={{
                  "aria-label": "change time"
                }}
              />
            </MuiPickersUtilsProvider>
            <Grid container alignItems="center" style={{ width: 80 }}>
              <TextField
                id="duration"
                value={duration}
                margin="dense"
                variant="outlined"
                label="duration"
                helperText="minutes"
                style={{ margin: "-1px 4px 0 4px", width: 65 }}
              />
            </Grid>
          </Grid>
          <span style={{ color: "red", margin: "0 16px" }}>
            {errorState.ejenjang}
          </span>
          <span style={{ color: "red", margin: "0 16px" }}>
            {errorState.egrade}
          </span>
          <span style={{ color: "red", margin: "0 16px" }}>
            {errorState.esubject}
          </span>
          <span style={{ color: "red", margin: "0 16px" }}>
            {errorState.epengawas}
          </span>
          <span style={{ color: "red", margin: "0 16px" }}>
            {errorState.erancangan}
          </span>
          <span style={{ color: "red", margin: "0 16px" }}>
            {errorState.eparticipants}
          </span>
        </Grid>

        <Grid container spacing={2} className={common.marginY}>
          <Conditional condition={rancanganSoal !== null}>
            <Grid item>
              <Card className={classes.card}>
                <CardHeader
                  title="Soal Ujian"
                  action={
                    <IconButton
                      aria-label="settings"
                      className={classes.iconButton}
                      onClick={removeRancanganSoal}
                    >
                      <Close />
                    </IconButton>
                  }
                  style={{ color: "white", backgroundColor: "#15cd8f" }}
                />
                <CardContent>
                  <Typography
                    variant="h5"
                    component="h2"
                    className={classes.title}
                    gutterBottom
                  >
                    {rancanganSoal !== null && rancanganSoal.exam_type.value}{" "}
                    {rancanganSoal !== null && rancanganSoal.jenjang}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    className={classes.title}
                    gutterBottom
                  >
                    {rancanganSoal !== null && rancanganSoal.subject_name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    className={classes.title}
                    gutterBottom
                  >
                    Kelas {rancanganSoal !== null && rancanganSoal.grade_num}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Conditional>

          <Conditional condition={pengawas !== null}>
            <Grid item>
              <Card className={classes.card}>
                <CardHeader
                  title="Pengawas"
                  action={
                    <IconButton
                      onClick={removePengawas}
                      aria-label="settings"
                      className={classes.iconButton}
                    >
                      <Close />
                    </IconButton>
                  }
                  style={{ color: "white", backgroundColor: "#15cd8f" }}
                />
                <CardContent>
                  <Typography
                    variant="h5"
                    component="h2"
                    className={classes.title}
                    gutterBottom
                  >
                    {pengawas !== null && pengawas.name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    className={classes.title}
                    gutterBottom
                  >
                    {pengawas !== null && pengawas.id}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Conditional>
        </Grid>

        <Grid container spacing={2} className={common.marginY}>
          <Grid item>
            <Conditional condition={isUserGenerated===true && participantChanged===false}>
              <Button variant="contained" onClick={cetak} color="secondary">
                cetak kartu ujian
              </Button>
            </Conditional>
            <Conditional condition={participantChanged===true && action!=='create' && participantsClass.length>0}>
              <Button variant="contained" onClick={updateStudentParticipant} color="secondary">
                update peserta ujian
              </Button>
            </Conditional>
          </Grid>
          <Grid item>
          <Conditional condition={participantsClass.length>0}>
            <Button
              variant="contained"
              onClick={showParticipantsUser}
              color="secondary"
            >
              lihat daftar Participants
            </Button>
            </Conditional>
          </Grid>
        </Grid>

        <Conditional condition={action === "edit" || action === "create"}>
          <Grid
            item
            container
            justify="space-between"
            className={classes.addAction}
          >
            <Grid item>
              <Button variant="outlined" onClick={cancel}>
                cancel
              </Button>
              <Button
                variant="outlined"
                onClick={clear}
                className={common.marginLeft}
              >
                reset
              </Button>
            </Grid>
            <Button onClick={submit} color="primary" variant="contained">
              Save
            </Button>
          </Grid>
        </Conditional>
      </Grid>

      <PopUp anchor={popUpAnchor} position="bottom">
        <SearchListAsync path={"user"} action={addPengawas} />
      </PopUp>

      <BottomDrawer
        tittle={bottomDrawerTittle}
        open={openBottomDrawer}
        close={closeAddRancanganSoal}
      >
        <Grid
          item
          xs={12}
          container
          className={clsx(classes.table_wrapper, common.borderTopRadius)}
        >
          <Table className={classes.table}>
            <TableHead>
              <TableRow className={classes.table_header}>
                <TableCell className={common.borderTopLeftRadius}>
                  Ujian
                </TableCell>
                <TableCell>Pelajaran</TableCell>
                <TableCell>Jenjang</TableCell>
                <TableCell>Kelas</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rancanganSoalData.map(row => (
                <TableRow key={row.id} className={classes.tableRow}>
                  <TableCell>{row.exam_type.value}</TableCell>
                  <TableCell>{row.subject_name}</TableCell>
                  <TableCell>{row.jenjang}</TableCell>
                  <TableCell>{row.grade_num}</TableCell>
                  <TableCell>
                    <Grid container wrap="nowrap">
                      <CheckButton
                        tooltip="choose soal"
                        action={() => chooseRancanganSoal(row)}
                        classes={classes.floatButton}
                      />
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableHead>
              <TableRow className={classes.table_header}>
                <TableCell>Ujian</TableCell>
                <TableCell>Pelajaran</TableCell>
                <TableCell>Jenjang</TableCell>
                <TableCell>Kelas</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </Grid>
      </BottomDrawer>

      <BottomDrawer
        tittle={bottomDrawerTittle}
        open={openStudentsDrawer}
        close={closeStudentsDrawer}
      >
        <Grid
          item
          xs={12}
          container
          className={clsx(classes.table_wrapper, common.borderTopRadius)}
        >
          <Table className={classes.table}>
            <TableHead>
              <TableRow className={classes.table_header}>
                <TableCell className={common.borderTopLeftRadius}>
                  Nis
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Class</TableCell>                
              </TableRow>
            </TableHead>
            <TableBody>
              {participantsUser.map(row => (
                <TableRow key={row.nis} className={classes.tableRow}>
                  <TableCell>{row.nis}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.kelas.name}</TableCell>                  
                </TableRow>
              ))}
            </TableBody>            
          </Table>
        </Grid>
      </BottomDrawer>
    </>
  );
};

export default ScheduleForm;
