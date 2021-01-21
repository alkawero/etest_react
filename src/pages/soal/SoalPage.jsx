import React, { useState, useEffect } from "react";
import useStyles, { selectCustomSize } from "./soalStyle";
import { useUpdateEffect } from "react-use";
import { useCommonStyles } from "themes/commonStyle";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "components/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import Search from "@material-ui/icons/Search";
import ArrowForward from "@material-ui/icons/ArrowForward";
import TopDrawer from "components/TopDrawer";
import SoalForm from "./SoalForm";
import Select from "react-select";

import { doGet, doPost, doDelete, doPut, doPatch } from "apis/api-service";
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
import InlineText from "components/InlineText";
import { useSelector } from "react-redux";

const SoalPage = props => {
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
    
    const response = await doGet("mapel", params,getHeaders());
    setDataSubject(
      response.data.map(data => ({ label: data.name, value: data.id }))
    );
  };

  const [rowsPerHalaman, setRowsPerHalaman] = useState(10);
  const [soalData, setSoalData] = useState([]);
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
  
  const getSoal = async () => {
    let params = { pageNum: rowsPerHalaman, user_id:user.id };
    if (filterJenjang !== null) {
      params = { ...params, jenjang: filterJenjang.value };
    }
    if (filterGrade !== null) {
      params = { ...params, grade_char: filterGrade.value };
    }
    if (filterSubject !== null) {
      params = { ...params, subject: filterSubject.value };
    }

    
    const response = await doGet("soal?page=" + halaman, params,getHeaders());
    if (!response.error) {
      setTotalRows(response.data.meta.total);
      setSoalData(response.data.data);
    }
  };

  //const getSoalCallback = useCallback(getSoal, []);
  
  useEffect(() => {
    getDataJenjang();
    getSoal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  useEffect(() => {
    getSoal()    
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
  

  const refreshPage = () => {
    setRefresh(refresh + 1);
  };

  

  const getById = async id => {
    
    const response = await doGet("soal/" + id,{},getHeaders());
    if (!response.error) {
      return response.data;
    }
  };

  const addButtonClick = () => {
    setOpenTopDrawer(true);
    setTopDrawerTittle("Buat Soal");
    setTopDrawerContent(
      <SoalForm user={user} action="create" create={create} onClose={closeTopDrawer} />
    );
  };

  const closeTopDrawer = () => {
    setOpenTopDrawer(false);
  };

  const create = async p => {
    
    await doPost("soal", p, "save soal", getHeaders());
    setRefresh(refresh + 1);
  };

  const update = async p => {
    await doPut("soal", p, "save soal", getHeaders());
    setRefresh(refresh + 1);
  };

  const toggle = async s => {
    const newObject = {
      ...s,
      active: s.active === 0 ? 1 : 0
    };
    await doPatch("soal/toggle", newObject, "save soal", getHeaders());
    setRefresh(refresh + 1);
  };

  const filterClick = event => {
    setFilterAnchor(filterAnchor ? null : event.currentTarget);
  };

  const detail = async obj => {
    const soal = await getById(obj.id);
    setTopDrawerContent(
      <SoalForm user={user} action="detail" soal={soal} onClose={closeTopDrawer} />
    );
    setOpenTopDrawer(true);
    setTopDrawerTittle("Soal Detail");
  };

  const edit = async p => {
    const soal = await getById(p.id);
    setTopDrawerContent(
      <SoalForm
        user={user}
        action="edit"
        update={update}
        soal={soal}
        onClose={closeTopDrawer}
      />
    );
    setOpenTopDrawer(true);
    setTopDrawerTittle("Edit soal");
  };

  const deleteById = async s => {
    await doDelete("soal", s, "delete soal", getHeaders());
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
    getSoal();
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
              text="Add Soal"
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
                    Pelajaran
                  </TableCell>
                  <TableCell>Jenjang</TableCell>
                  <TableCell>Kelas</TableCell>
                  <TableCell>Preview</TableCell>
                  <TableCell>KD</TableCell>
                  <TableCell>Materi</TableCell>
                  <TableCell>Ranah</TableCell>
                  <TableCell>Indikator</TableCell>
                  <TableCell>Pembuat</TableCell>
                  <TableCell>Bentuk</TableCell>
                  <TableCell className={common.borderTopRightRadius}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {soalData.map(row => (
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
                          <SwitchButton
                            tooltip="change status"
                            action={() => toggle(row)}
                            checked={row.active === 1 || row.active === true}
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

                      <InlineText>{row.subject_name}</InlineText>
                    </TableCell>
                    <TableCell>{row.jenjang}</TableCell>
                    <TableCell>{row.grade_num}</TableCell>
                    <TableCell>{row.content}</TableCell>
                    <TableCell>{row.kds.join(",")}</TableCell>
                    <TableCell>
                      <InlineText>{row.materis.join(",")}</InlineText>
                    </TableCell>

                    <TableCell>{row.ranahs.join(",")}</TableCell>
                    <TableCell>
                      <InlineText>{row.indicators.join(",")}</InlineText>
                    </TableCell>
                    <TableCell>
                      <InlineText>{row.creator_name}</InlineText>
                    </TableCell>
                    <TableCell>
                      <InlineText>{row.type_name}</InlineText>
                    </TableCell>
                    <TableCell>
                      <StatusChip status={row.active} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableHead>
                <TableRow className={classes.table_header}>
                  <TableCell>Pelajaran</TableCell>
                  <TableCell>Jenjang</TableCell>
                  <TableCell>Kelas</TableCell>
                  <TableCell>Preview</TableCell>
                  <TableCell>KD</TableCell>
                  <TableCell>Materi</TableCell>
                  <TableCell>Ranah</TableCell>
                  <TableCell>Indikator</TableCell>
                  <TableCell>Pembuat</TableCell>
                  <TableCell>Bentuk</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </Grid>
          <Grid container justify="flex-end">
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
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



export default SoalPage;
