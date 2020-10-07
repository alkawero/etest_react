/*
author alka@2019
*/
import React, { useState, useEffect } from "react";
import useStyles, { selectCustomSize } from "./scheduleStyle";
import { useUpdateEffect } from "react-use";
import { useCommonStyles } from "themes/commonStyle";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";

import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import Search from "@material-ui/icons/Search";
import Print from "@material-ui/icons/Print";
import ArrowForward from "@material-ui/icons/ArrowForward";
import TopDrawer from "components/TopDrawer";
import ScheduleForm from "./ScheduleForm";
import Select from "react-select";
import Tooltip from "@material-ui/core/Tooltip";
import { useSelector } from "react-redux";

import {
  doGet,
  doPost,
  doDelete,
  doPut,
  doPatch,
  doDownloadPdf
} from "apis/api-service";
import Protected from "components/Protected";
import clsx from "clsx";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import StatusChip from "components/StatusChip";
import TablePagination from "@material-ui/core/TablePagination";
import SwitchButton from "components/SwitchButton";
import EditButton from "components/EditButton";
import DeleteButton from "components/DeleteButton";
import AddButton from "components/AddButton";
import RefreshButton from "components/RefreshButton";
import DetailButton from "components/DetailButton";
import PopUp from "components/PopUp";
import { UserProvider } from "contexts/UserContext";
//import TableCell  from 'components/TableCell';
import TableCell from "@material-ui/core/TableCell";
import InlineText from "components/InlineText";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import format from "date-fns/format";

const SchedulePage = props => {
  const [openTopDrawer, setOpenTopDrawer] = useState(false);
  const [topDrawerTittle, setTopDrawerTittle] = useState("");
  const [TopDrawerContent, setTopDrawerContent] = useState(null);
  const user = useSelector(state => state.user);
  const ui = useSelector(state => state.ui);

  const [filterAnchor, setFilterAnchor] = useState(null);

  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);
  const filterStartDateChange = e => {
    setFilterStartDate(e);
  };
  const filterEndDateChange = e => {
    setFilterEndDate(e);
  };

  const [dataJenjang, setDataJenjang] = useState([]);
  const [filterJenjang, setFilterJenjang] = useState(null);
  const filterJenjangChange = e => {
    setFilterJenjang(e);
  };
  const getDataJenjang = async () => {
    const params = { group: "jenjang" };
    
    const response = await doGet("param", params, getHeaders());
    setDataJenjang(
      response.data.map(j => ({ label: j.value, value: j.char_code }))
    );
  };

  const [dataGrade, setDataGrade] = useState([]);
  const [filterGrade, setFilterGrade] = useState(null);
  const filterGradeChange = e => {
    setFilterGrade(e);
  };
  const getDataGrade = async () => {
    if (filterJenjang !== null) {
      const params = { group: "grade", key: filterJenjang.value };
      
      const response = await doGet("param", params, getHeaders());
      const grades = response.data.map(grade => ({
        label: grade.value,
        value: grade.char_code
      }));
      setDataGrade(grades);
    }
  };

  const [dataSubject, setDataSubject] = useState([]);
  const [filterSubject, setFilterSubject] = useState(null);
  const filterSubjectChange = e => {
    setFilterSubject(e);
  };
  const getDataSubject = async () => {
    const params = { jenjang: filterJenjang.value, grade: filterGrade.value };
    
    const response = await doGet("mapel", params, getHeaders());
    setDataSubject(
      response.data.map(data => ({ label: data.name, value: data.id }))
    );
  };

  const [rowsPerHalaman, setRowsPerHalaman] = useState(10);
  const [examData, setExamData] = useState([]);
  const [refresh, setRefresh] = useState(1);
  const [halaman, setHalaman] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  const sm = useMediaQuery("(min-width:600px)");
  const md = useMediaQuery("(min-width:960px)");
  const lg = useMediaQuery("(min-width:1280px)");
  const xl = useMediaQuery("(min-width:1920px)");
  const dimension = { sm: sm, md: md, xl: xl, lg: lg };

  const classes = useStyles({ dimension });
  const common = useCommonStyles();


  const getHeaders = ()=> {
    return {"Authorization": user.token}    
  }

  useEffect(() => {
    getDataJenjang();
  }, []);

  useUpdateEffect(() => {
    setFilterGrade(null);
    setDataGrade([]);
    if (filterJenjang !== null) {
      getDataGrade();
    }
  }, [filterJenjang]);

  useUpdateEffect(() => {
    setFilterSubject(null);
    setDataSubject([]);
    if (filterJenjang !== null && filterGrade !== null) {
      getDataSubject();
    }
  }, [filterGrade]);

  const refreshPage = () => {
    setRefresh(refresh + 1);
  };

  const getExam = async () => {
    const roles = user.roles.map(r => r.id);
    let params = {
      user_role: JSON.stringify(roles),
      user_id: user.id,
      pageNum: rowsPerHalaman
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

    
    const response = await doGet("exam?page=" + halaman, params, getHeaders());
    if (!response.error) {
      setTotalRows(response.data.meta.total);
      setExamData(response.data.data);
    }
  };
  useEffect(() => {
    getExam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, rowsPerHalaman, halaman]);

  const getById = async id => {
    
    const response = await doGet("exam/" + id,{},getHeaders());
    if (!response.error) {
      return response.data;
    }
  };

  const addButtonClick = () => {
    setOpenTopDrawer(true);
    setTopDrawerTittle("Buat Exam");
    setTopDrawerContent(
      <ScheduleForm action="create" create={create} onClose={closeTopDrawer} />
    );
  };

  const closeTopDrawer = () => {
    setOpenTopDrawer(false);
  };

  const create = async p => {
    
    await doPost("exam", p, "save exam", getHeaders(), getHeaders(), getHeaders());
    setRefresh(refresh + 1);
  };

  const update = async p => {
    await doPut("exam", p, "save exam");
    setRefresh(refresh + 1);
  };

  const toggle = async s => {
    const newObject = {
      ...s,
      status: s.status === 0 ? 1 : 0
    };
    await doPatch("exam/toggle", newObject, "save exam", getHeaders());
    setRefresh(refresh + 1);
  };

  const filterClick = event => {
    setFilterAnchor(filterAnchor ? null : event.currentTarget);
  };

  const detail = async obj => {
    const exam = await getById(obj.id);
    setTopDrawerContent(
      <ScheduleForm action="detail" exam={exam} onClose={closeTopDrawer} />
    );
    setOpenTopDrawer(true);
    setTopDrawerTittle("Exam Detail");
  };

  const edit = async p => {
    const exam = await getById(p.id);
    setTopDrawerContent(
      <ScheduleForm
        action="edit"
        update={update}
        exam={exam}
        onClose={closeTopDrawer}
      />
    );
    setOpenTopDrawer(true);
    setTopDrawerTittle("Edit exam");
  };

  const deleteById = async s => {
    await doDelete("exam", s, "delete exam");
    setRefresh(refresh + 1);
  };

  const changeHalaman = (event, newHalaman) => {
    setHalaman(newHalaman + 1);
  };

  const changeRowsPerHalaman = event => {
    setRowsPerHalaman(+event.target.value);
    setHalaman(1);
  };

  const clear = () => {
    setFilterStartDate(null);
    setFilterEndDate(null);
    setFilterJenjang(null);
    setFilterGrade(null);
  };

  const filtering = () => {
    getExam();
  };

  const printExamCard = exam => {
    const params = { exam_id: exam.id };
    doDownloadPdf("exam/users/print", params);
  };

  const currentAccess = ui.active_page.access;

  return (
    <UserProvider user={user}>
      <Grid
        wrap="nowrap"
        container
        justify="space-between"
        className={classes.header}
      >
        <Grid item xs={10} sm={6} className={classes.headerTittle}>
          <Typography variant="h6">{ui.active_page.tittle}</Typography>
        </Grid>
        <Grid
          container
          wrap="nowrap"
          justify="flex-end"
          item
          xs={5}
          className={classes.headerToolbar}
        >
          <IconButton
            onClick={filterClick}
            className={classes.iconButton}
            size="medium"
          >
            <Search fontSize="inherit" />
          </IconButton>
          <RefreshButton action={refreshPage} classes={classes.iconButton} />
          <Protected current={currentAccess} only="W">
            <AddButton
              text="Add Exam"
              action={addButtonClick}
              classes={classes.bigAddButton}
            />
          </Protected>
        </Grid>
      </Grid>
      <Grid container justify="center" className={classes.content_wrapper}>
        <Grid container className={classes.content}>
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
                    Exam Category
                  </TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Jenjang</TableCell>
                  <TableCell>Grade</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell>End</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell className={common.borderTopRightRadius}>
                    Activity
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {examData.map(row => (
                  <TableRow key={row.id} className={classes.tableRow}>
                    <TableCell>
                      <div
                        className={clsx(classes.actionWrapper, "actionWrapper")}
                      >
                        <Protected current={currentAccess} only="R">
                          <DetailButton
                            tooltip="detail"
                            action={() => detail(row)}
                            classes={classes.floatButton}
                          />
                        </Protected>
                        <Protected current={currentAccess} only="W">
                          <Tooltip title="print exam card">
                            <IconButton
                              onClick={() => printExamCard(row)}
                              className={classes.arrowButton}
                              size="medium"
                            >
                              <Print fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <SwitchButton
                            tooltip="change status"
                            action={() => toggle(row)}
                            checked={row.status === 1 || row.status === true}
                          />
                          <EditButton
                            tooltip="edit"
                            action={() => edit(row)}
                            classes={classes.floatButton}
                          />
                        </Protected>
                        <Protected current={currentAccess} only="D">
                          <DeleteButton
                            tooltip="delete"
                            action={() => deleteById(row)}
                            classes={classes.floatButton}
                          />
                        </Protected>
                      </div>
                      {row.exam_type.char_code}
                    </TableCell>
                    <TableCell>{row.subject_name}</TableCell>
                    <TableCell>{row.jenjang}</TableCell>
                    <TableCell>{row.grade_num}</TableCell>
                    <TableCell>
                      <InlineText>{row.tahun_ajaran_char}</InlineText>
                    </TableCell>
                    <TableCell>
                      <InlineText>{row.schedule_date}</InlineText>
                    </TableCell>
                    <TableCell>{row.start_time.substring(11, 16)}</TableCell>
                    <TableCell>{row.end_time.substring(11, 16)}</TableCell>
                    <TableCell>{row.duration}</TableCell>
                    <TableCell>
                      <StatusChip status={row.status} />
                    </TableCell>
                    <TableCell>{row.activity.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableHead>
                <TableRow className={classes.table_header}>
                  <TableCell>Exam Category</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Jenjang</TableCell>
                  <TableCell>Grade</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell>End</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Activity</TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </Grid>
          <Grid container justify="flex-end">
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalRows}
              rowsPerPage={rowsPerHalaman}
              page={halaman - 1}
              backIconButtonProps={{
                "aria-label": "previous page"
              }}
              nextIconButtonProps={{
                "aria-label": "next page"
              }}
              onChangePage={changeHalaman}
              onChangeRowsPerPage={changeRowsPerHalaman}
            />
          </Grid>
        </Grid>
      </Grid>
      <TopDrawer
        tittle={topDrawerTittle}
        open={openTopDrawer}
        close={closeTopDrawer}
      >
        {TopDrawerContent}
      </TopDrawer>
      <PopUp anchor={filterAnchor} position="left">
        <Grid container className={classes.filterContainer}>
          <Grid item xs={1} container justify="center" alignItems="center">
            <RefreshButton action={clear} />
          </Grid>
          <Grid
            item
            xs={10}
            spacing={1}
            container
            className={classes.filterActions}
          >
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
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item>
              <Select
                value={filterJenjang}
                onChange={filterJenjangChange}
                name="jenjang"
                options={dataJenjang}
                styles={selectCustomSize}
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
                styles={selectCustomSize}
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
                styles={selectCustomSize}
              />
            </Grid>
          </Grid>
          <Grid item xs={1} container justify="center" alignItems="center">
            <IconButton
              onClick={filtering}
              className={classes.arrowButton}
              size="medium"
            >
              <ArrowForward fontSize="inherit" />
            </IconButton>
          </Grid>
        </Grid>
      </PopUp>
    </UserProvider>
  );
};

export default SchedulePage;
