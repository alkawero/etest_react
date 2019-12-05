/*
author alka@2019
*/
import React, { useState, useEffect } from "react";
import useStyles, { selectCustomSize } from "./rancanganStyle";
import { useUpdateEffect } from "react-use";
import { useCommonStyles } from "themes/commonStyle";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import Search from "@material-ui/icons/Search";
import FlightTakeoff from "@material-ui/icons/FlightTakeoff";
import ArrowForward from "@material-ui/icons/ArrowForward";
import Conditional from "components/Conditional";
import TopDrawer from "components/TopDrawer";
import RancanganForm from "./RancanganForm";
import Select from "react-select";

import { doGet, doPost, doDelete, doPut, doPatch } from "apis/api-service";
import Protected from "components/Protected";
import clsx from "clsx";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import TablePagination from "@material-ui/core/TablePagination";
import EditButton from "components/EditButton";
import DeleteButton from "components/DeleteButton";
import AddButton from "components/AddButton";
import ApproveButton from "components/ApproveButton";
import CancelButton from "components/CancelButton";
import RefreshButton from "components/RefreshButton";
import DetailButton from "components/DetailButton";
import PopUp from "components/PopUp";
import { UserProvider } from "contexts/UserContext";
import Tooltip from "@material-ui/core/Tooltip";
import { useSelector } from "react-redux";

const RancanganPage = props => {
  const user = useSelector(state => state.user);
  const ui = useSelector(state => state.ui);
  const [openTopDrawer, setOpenTopDrawer] = useState(false);
  const [topDrawerTittle, setTopDrawerTittle] = useState("");
  const [TopDrawerContent, setTopDrawerContent] = useState(null);

  const [filterAnchor, setFilterAnchor] = useState(null);
  const [dataJenjang, setDataJenjang] = useState([]);
  const [filterJenjang, setFilterJenjang] = useState(null);
  const filterJenjangChange = e => {
    setFilterJenjang(e);
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
    setFilterGrade(e);
  };
  const getDataGrade = async () => {
    if (filterJenjang !== null) {
      const params = { group: "grade", key: filterJenjang.value };
      const response = await doGet("param", params);
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
    const response = await doGet("mapel", params);
    setDataSubject(
      response.data.map(data => ({ label: data.name, value: data.id }))
    );
  };

  const [rowsPerHalaman, setRowsPerHalaman] = useState(10);
  const [rancanganData, setRancanganData] = useState([]);
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
  useEffect(() => {
    getDataJenjang();
  }, []);

  useEffect(() => {
    getRancangan();
  }, [refresh, rowsPerHalaman, halaman]);

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

  const getRancangan = async () => {
    let params = { pageNum: rowsPerHalaman, user_id: user.id };
    if (filterJenjang !== null) {
      params = { ...params, jenjang: filterJenjang.value };
    }

    if (filterGrade !== null) {
      params = { ...params, grade: filterGrade.value };
    }

    if (filterSubject !== null) {
      params = { ...params, subject: filterSubject.value };
    }

    const response = await doGet("rancangan?page=" + halaman, params);
    if (!response.error) {
      setTotalRows(response.data.meta.total);
      setRancanganData(response.data.data);
    }
  };

  const getById = async id => {
    const response = await doGet("rancangan/" + id);
    if (!response.error) {
      return response.data;
    }
  };

  const addButtonClick = () => {
    setOpenTopDrawer(true);
    setTopDrawerTittle("Buat Rancangan");
    setTopDrawerContent(
      <RancanganForm action="create" create={create} onClose={closeTopDrawer} />
    );
  };

  const closeTopDrawer = () => {
    setOpenTopDrawer(false);
  };

  const create = async p => {
    await doPost("rancangan", p, "save rancangan");
    setRefresh(refresh + 1);
  };

  const update = async p => {
    await doPut("rancangan", p, "save rancangan");
    setRefresh(refresh + 1);
  };

  const filterClick = event => {
    setFilterAnchor(filterAnchor ? null : event.currentTarget);
  };

  const detail = async obj => {
    const rancangan = await getById(obj.id);
    setTopDrawerContent(
      <RancanganForm
        action="detail"
        rancangan={rancangan}
        onClose={closeTopDrawer}
      />
    );
    setOpenTopDrawer(true);
    setTopDrawerTittle("Rancangan Detail");
  };

  const edit = async p => {
    const rancangan = await getById(p.id);
    setTopDrawerContent(
      <RancanganForm
        action="edit"
        update={update}
        rancangan={rancangan}
        onClose={closeTopDrawer}
      />
    );
    setOpenTopDrawer(true);
    setTopDrawerTittle("Edit rancangan");
  };

  const deleteById = async s => {
    await doDelete("rancangan", s, "delete rancangan");
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
    setFilterJenjang(null);
    setFilterGrade(null);
  };

  const filtering = () => {
    getRancangan();
  };

  const sendToReviewer = async id => {
    const params = { id: id, status: 1 };
    await doPost("rancangan/review", params, "send to reviewer");
    setRefresh(refresh + 1);
  };

  const approved = async id => {
    const params = { id: id, status: 3 };
    await doPatch("rancangan/status", params, "verified by reviewer");
    setRefresh(refresh + 1);
  };

  const rejected = async id => {
    const params = { id: id, status: 5 };
    await doPatch("rancangan/status", params, "rejected by reviewer");
    setRefresh(refresh + 1);
  };

  const revision = async id => {
    const params = { id: id, status: 4 };
    await doPatch("rancangan/status", params, "need for revision");
    setRefresh(refresh + 1);
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
              text="Add Rancangan"
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
                  <TableCell className={common.borderTopRightRadius}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rancanganData.map(row => (
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
                        <Conditional condition={row.status.num_code !== 5}>
                          <Conditional condition={row.status.num_code !== 1}>
                            <Protected current={currentAccess} only="W">
                              <Tooltip title="send to reviewer">
                                <IconButton
                                  aria-label="send-to-reviewer"
                                  className={classes.floatButton}
                                  onClick={() => sendToReviewer(row.id)}
                                >
                                  <FlightTakeoff fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Protected>
                          </Conditional>
                          <Protected current={currentAccess} only="A">
                            <ApproveButton
                              tooltip="Approve"
                              action={() => approved(row.id)}
                              classes={classes.floatButton}
                            />

                            <EditButton
                              tooltip="Need Revision"
                              action={() => revision(row.id)}
                              classes={classes.floatButton}
                            />
                            <CancelButton
                              tooltip="Reject"
                              action={() => rejected(row.id)}
                              classes={classes.floatButton}
                            />
                          </Protected>
                        </Conditional>
                      </div>
                      {row.exam_type.char_code}
                    </TableCell>
                    <TableCell>{row.subject_name}</TableCell>
                    <TableCell>{row.jenjang}</TableCell>
                    <TableCell>{row.grade_num}</TableCell>
                    <TableCell>{row.tahun_ajaran_char}</TableCell>
                    <TableCell>{row.status.value}</TableCell>
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
                  <TableCell>Status</TableCell>
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

export default RancanganPage;
