import React, { useState, useEffect } from "react";
import { useUpdateEffect } from "react-use";
import { useSelector } from "react-redux";
import useStyles from "./reviewerStyle";
import { selectCustomSize } from "themes/commonStyle";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import Search from "@material-ui/icons/Search";
import ArrowForward from "@material-ui/icons/ArrowForward";
import RightDrawer from "components/RightDrawer";
import Select from "react-select";
import SearchListAsync from "components/SearchListAsync";
import Conditional from "components/Conditional";

import { doGet, doPost, doDelete, doPut } from "apis/api-service";
import Protected from "components/Protected";
import clsx from "clsx";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import TablePagination from "@material-ui/core/TablePagination";
import EditButton from "components/EditButton";
import DeleteButton from "components/DeleteButton";
import AddButton from "components/AddButton";
import RefreshButton from "components/RefreshButton";
import DetailButton from "components/DetailButton";
import PopUp from "components/PopUp";
import ReviewerForm from "./ReviewerForm";
import Close from "@material-ui/icons/Close";

const ReviewerPage = props => {
  const user = useSelector(state => state.user);
  const ui = useSelector(state => state.ui);
  const [openRightDrawer, setOpenRightDrawer] = useState(false);
  const [rightDrawerTittle, setRightDrawerTittle] = useState("");
  const [RightDrawerContent, setRightDrawerContent] = useState(null);

  const [filterAnchor, setFilterAnchor] = useState(null);
  const [filterUser, setFilterUser] = useState(null); 
  
  const [dataJenjang, setDataJenjang] = useState([]);
  const [filterJenjang, setFilterJenjang] = useState(null);
  const filterJenjangChange = e => {
    setFilterJenjang(e);
  };
  const getDataJenjang = async () => {
    let params = { group: "jenjang" };
    
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
  const [reviewerData, setReviewerData] = useState([]);
  const [refresh, setRefresh] = useState(1);
  const [halaman, setHalaman] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  const md = useMediaQuery("(min-width:570px)");
  const xl = useMediaQuery("(min-width:1000px)");
  const dimension = { md: md, xl: xl };

  const classes = useStyles({ dimension });

  const getHeaders = ()=> {
    return {"Authorization": user.token}    
  }
  
  const refreshPage = () => {
    setRefresh(refresh + 1);
  };

  const getReviewer = async () => {
    let params = { pageNum: rowsPerHalaman };

    if (filterJenjang !== null) {
        params = { ...params, jenjang: filterJenjang.value };
      }
    if (filterSubject !== null) {
      params = { ...params, subject_id: filterSubject.value };
    }
    if (filterUser !== null) {
        params = { ...params, user_id: filterUser.id };
      }
    
    const response = await doGet("subject/reviewer?page=" + halaman, params, getHeaders());
    if (!response.error) {
      setTotalRows(response.data.meta.total);
      setReviewerData(response.data.data);
    }
  };

  useEffect(() => {
    getDataJenjang();
    getReviewer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const addButtonClick = () => {
    setRightDrawerContent(
      <ReviewerForm
        create={create}
        action="create"
        onClose={closeRightDrawer}
      />
    );
    setOpenRightDrawer(true);
    setRightDrawerTittle("Add New Reviewer");
  };

  const closeRightDrawer = () => {
    setOpenRightDrawer(false);
  };

  const create = async p => {
    
    await doPost("subject/reviewer", p, "save Reviewer", getHeaders());
    setRefresh(refresh + 1);
  };

  const update = async p => {
    await doPut("subject/reviewer", p, "save Reviewer", getHeaders());
    setRefresh(refresh + 1);
  };

  const filterClick = event => {
    setFilterAnchor(filterAnchor ? null : event.currentTarget);
  };

  const detail = async reviewer => {
    setRightDrawerContent(
      <ReviewerForm
        reviewer={reviewer}
        action="detail"
        onClose={closeRightDrawer}
      />
    );
    setOpenRightDrawer(true);
    setRightDrawerTittle("Reviewer Detail");
  };
  const edit = async reviewer => {
    setRightDrawerContent(
      <ReviewerForm
        reviewer={reviewer}
        update={update}
        action="edit"
        onClose={closeRightDrawer}
      />
    );
    setOpenRightDrawer(true);
    setRightDrawerTittle("Edit reviewer");
  };

  const deleteById = async p => {
    await doDelete("subject/reviewer", p, "delete reviewer");
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
    setFilterUser(null)
  };

  const filtering = () => {
    getReviewer();
  };

  const currentAccess = ui.active_page.access;

  return (
    <>
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
              text="Add Reviewer"
              action={addButtonClick}
              classes={classes.bigAddButton}
            />
          </Protected>
        </Grid>
      </Grid>
      <Grid
        container
        justify="space-between"
        className={classes.content_wrapper}
      >
        <Grid item xs={12} className={classes.content}>
          <Paper>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Jenjang</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reviewerData.map(row => (
                  <TableRow key={row.id} className={classes.tableRow}>
                    <TableCell> {row.jenjang}</TableCell>
                    <TableCell>{row.subject_name}</TableCell>
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
                      </div>
                      {row.reviewer_name}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

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
          </Paper>
        </Grid>
      </Grid>
      <RightDrawer
        tittle={rightDrawerTittle}
        open={openRightDrawer}
        close={closeRightDrawer}
      >
        {RightDrawerContent}
      </RightDrawer>
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
            <Grid item>
              <Conditional condition={filterUser === null}>
                <SearchListAsync user={user} path="user" action={setFilterUser} placeholder="filter user..." />
              </Conditional>
              <Conditional condition={filterUser !== null}>
                <Grid item container wrap="nowrap" alignItems="center">
                <Grid item>
                  <Typography>{filterUser !== null && filterUser.text}</Typography>
                </Grid>
                <Grid item>
                  <IconButton
                    aria-label="settings"
                    className={classes.iconButton}
                    onClick={() => setFilterUser(null)}
                  >
                    <Close color="primary" />
                  </IconButton>
                </Grid>
                </Grid>
              </Conditional>
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
    </>
  );
};


export default ReviewerPage;
