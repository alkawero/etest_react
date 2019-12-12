import React, { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { isEmpty, sortBy } from "lodash";
import Grid from "@material-ui/core/Grid";
import { useUpdateEffect } from "react-use";
import clsx from "clsx";
import { doUpload, doPost, doGet, doPut, doPatch } from "apis/api-service";
import useStyles, { selectCustomZindex } from "./rancanganStyle";
import { useCommonStyles } from "themes/commonStyle";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import "assets/css/react-draft-wysiwyg.css";
import Chip from "@material-ui/core/Chip";
import AddButton from "components/AddButton";
import Conditional from "components/Conditional";
import PopUp from "components/PopUp";
import DeleteButton from "components/DeleteButton";
import { UserContext } from "contexts/UserContext";
import { default as RSelect } from "react-select";
import SearchListAsync from "components/SearchListAsync";
import BottomDrawer from "components/BottomDrawer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
//import TableCell from "@material-ui/core/TableCell";
import TableCell from "components/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Protected from "components/Protected";
import StatusChip from "components/StatusChip";
import DetailButton from "components/DetailButton";
import CheckButton from "components/CheckButton";
import TopDrawer from "components/TopDrawer";
import SoalForm from "../soal/SoalForm";
import ApproveButton from "components/ApproveButton";
import EditButton from "components/EditButton";
import CancelButton from "components/CancelButton";
import Typography from "@material-ui/core/Typography";
import MailButton from "components/MailButton";

import Notes from "components/Notes";
import InputText from "../../components/InputText";

const RancanganForm = ({
  create,
  update,
  onClose,
  rancangan,
  action,
  open
}) => {
  const classes = useStyles();
  const common = useCommonStyles();

  const user = useContext(UserContext);
  const currentAccess = useSelector(state => state.ui.active_page.access);

  const [errorState, setErrorState] = useState({});

  const [title, setTitle] = useState("");
  const titleChange = text => {
    setTitle(text);
  };
  const [status, setStatus] = useState(0);
  const [openTopDrawer, setOpenTopDrawer] = useState(false);
  const [topDrawerTittle, setTopDrawerTittle] = useState("");
  const [openNotes, setOpenNotes] = useState(false);
  const [openBottomDrawer, setOpenBottomDrawer] = useState(false);
  const [bottomDrawerTittle, setBottomDrawerTittle] = useState("");
  const [rancanganStatus, setRancanganStatus] = useState("New");

  const [notesData, setNotesData] = useState([]);
  const [notesType, setNotesType] = useState(1);
  const [disableNoteTypeChange, setDisableNoteTypeChange] = useState(false);
  const notesTypeOption = [
    { value: 1, label: "Notes" },
    { value: 3, label: "Revision Reason" },
    { value: 4, label: "Reject Reason" }
  ];
  const notesTypeChange = event => {
    setNotesType(event.target.value);
  };

  const getNotesData = async () => {
    const reviewers = rancangan.reviewers.filter(ran => ran.emp_id === user.id);
    let role_id = null;
    let user_id = null;
    if (reviewers.length > 0) {
      role_id = 9;
      user_id = rancangan.creator_id;
    } else {
      user_id = user.id;
    }
    const params = {
      object_id: rancangan.id,
      user_id: user_id,
      to_role: role_id,
      note_type_codes: notesTypeOption.map(note => note.value)
    };

    const response = await doGet("note", params);
    setNotesData(response.data);
  };

  const [soal, setSoal] = useState(null);
  const [selectedSoal, setSelectedSoal] = useState([]);
  const [soalData, setSoalData] = useState([]);
  const getSoal = async () => {
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

    if (quotaComposition !== null) {
      if (quotaComposition.value !== "C") {
        params = { ...params, answer_type: quotaComposition.value };
      }
    }

    const response = await doGet("soal", params);
    if (!response.error) {
      const selectedIds = selectedSoal.map(soal => soal.id);
      const availableData = response.data.filter(
        data => !selectedIds.includes(data.id)
      );
      setSoalData(availableData);
    }
  };

  const [soalQuota, setSoalQuota] = useState(10);
  const soalQuotaChange = e => {
    const value = parseInt(e.target.value);
    if ((action === "edit" || action === "create")&& isCreator()) {
      if (value > 0) {
        setSoalQuota(value);
        setPartnerMc(0);
        setPartnerEs(0);
        if (quotaComposition === "M") {
          setMcComposition(value);
          setEsComposition(0);
        } else if (quotaComposition === "E") {
          setEsComposition(value);
          setMcComposition(0);
        } else {
          setMcComposition(value - 1);
          setEsComposition(1);
          setCreatorMc(value - 1);
          setCreatorEs(1);
        }
      }
    }
  };

  const [creatorMc, setCreatorMc] = useState(6);
  const creatorMcChange = e => {
    const creatorMcValue = parseInt(e.target.value);
    if ((action === "edit" || action === "create") && isCreator()) {
      if (creatorMcValue <= mcComposition && creatorMcValue > 0) {
        setCreatorMc(creatorMcValue);
        setPartnerMc(mcComposition - creatorMcValue);
      }
    }
  };
  const [creatorEs, setCreatorEs] = useState(4);
  const creatorEsChange = e => {
    const creatorEsValue = parseInt(e.target.value);
    if ((action === "edit" || action === "create") && isCreator()) {
      if (creatorEsValue <= esComposition && creatorEsValue > 0 ) {
        setCreatorEs(creatorEsValue);
        setPartnerEs(esComposition - creatorEsValue);
      }
    }
  };
  const [partnerMc, setPartnerMc] = useState(0);
  const partnerMcChange = e => {
    const value = parseInt(e.target.value);
    if ((action === "edit" || action === "create") && isCreator()) {
      if (value <= mcComposition && value > 0 ) {
        setPartnerMc(value);
        setCreatorMc(mcComposition - value);
      }
    }
  };
  const [partnerEs, setPartnerEs] = useState(0);
  const partnerEsChange = e => {
    const value = parseInt(e.target.value);
    if ((action === "edit" || action === "create") && isCreator()) {
      if (value <= esComposition && value > 0 ) {
        setPartnerEs(value);
        setCreatorEs(esComposition - value);
      }
    }
  };
  const [dataQuotaComposition, setDataQuotaComposition] = useState([]);
  const getDataQuotaComposition = async () => {
    const params = { group: "quota_composition" };
    const response = await doGet("param", params);
    setDataQuotaComposition(
      response.data.map(j => ({ label: j.value, value: j.char_code }))
    );
  };
  const [quotaComposition, setQuotaComposition] = useState({
    value: "M",
    label: "multiple choice"
  });
  const quotaCompositionChange = e => {
    if ((action === "edit" || action === "create") && isCreator()) {
      setQuotaComposition(e);
      if (e.value === "M") {
        setMcComposition(soalQuota);
        setEsComposition(0);
        setCreatorMc(soalQuota - partnerMc);
        setCreatorEs(0);
      } else if (e.value === "E") {
        setEsComposition(soalQuota);
        setMcComposition(0);
        setCreatorMc(0);
        setCreatorEs(soalQuota - partnerEs);
      } else {
        setCreatorMc(soalQuota - 1);
        setCreatorEs(1);
        setPartnerMc(0);
        setPartnerEs(0);
      }
    }
  };

  const [mcComposition, setMcComposition] = useState(6);
  const mcCompositionChange = e => {
    const value = parseInt(e.target.value);
    if ((action === "edit" || action === "create") && isCreator()) {
      if (value < soalQuota && value > 0) {
        setMcComposition(value);
        setEsComposition(soalQuota - value);
        setCreatorMc(value);
        setCreatorEs(soalQuota - value);
        setPartnerMc(0)
        setPartnerEs(0)
      }
    }
  };

  const isCreator = () =>{
    if(partner!==null && partner.id===user.id){
      return false
    }
    else {
      return true
    }

  }

  const isMine = (owner_id) =>{
    if(owner_id === user.id){
      return true
    }    
    return false   

  }

  const [esComposition, setEsComposition] = useState(4);
  const esCompositionChange = e => {
    const value = parseInt(e.target.value);
    if ((action === "edit" || action === "create") && isCreator() ) {
      if (value < soalQuota && value > 0) {
        setEsComposition(value);
        setMcComposition(soalQuota - value);
        setCreatorEs(value);
        setCreatorMc(soalQuota - value);
        setPartnerMc(0)
        setPartnerEs(0)
      }
    }
  };

  const [collaboration, setCollaboration] = useState("F");

  const [partner, setPartner] = useState(null);
  const addPartner = user => {
    if ((action === "edit" || action === "create") && isCreator()) {
    setPartner({ id: user.id, name: user.text });
    setCollaboration("P");
    setPopUpAnchor(null);
    }
  };

  const removePartner = user => {
    if ((action === "edit" || action === "create") && isCreator()) {
    setPartner(null);
    setCollaboration("F");
    setPartnerQuota(0);
    }
  };

  const [partnerQuota, setPartnerQuota] = useState(0);
  const partnerQuotaChange = e => {
    const value = parseInt(e.target.value);
    if (action === "edit" || action === "create") {
      if (value < soalQuota && value > 0) setPartnerQuota(value);
    }
  };

  const [popUpAnchor, setPopUpAnchor] = useState(null);
  const showAddPartner = e => {
    setPopUpAnchor(popUpAnchor ? null : e.currentTarget);
  };

  const [dataSubject, setDataSubject] = useState([]);
  const [subject, setSubject] = useState(null);
  const subjectChange = e => {
    if ((action === "edit" || action === "create") && isCreator()) {
      setSubject(e);
      setSelectedSoal([]);
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
    if ((action === "edit" || action === "create") && isCreator()) setExamType(e);
  };
  const getDataExamType = async () => {
    const params = { group: "exam_type" };
    const response = await doGet("param", params);
    setDataExamType(
      response.data.map(j => ({ label: j.value, value: j.num_code }))
    );
  };

  const [dataJenjang, setDataJenjang] = useState([]);
  const [jenjang, setJenjang] = useState(null);
  const jenjangChange = e => {
    if ((action === "edit" || action === "create") && isCreator()) setJenjang(e);
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
    if ((action === "edit" || action === "create") && isCreator()) setGrade(e);
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

  const [tahunAjaran, setTahunAjaran] = useState("");
  const getTahunAjaran = async () => {
    const params = { group: "tahun_pelajaran", status: 1, single: 1 };
    const response = await doGet("param", params);
    setTahunAjaran(response.data.value);
  };

  useEffect(() => {
    getTahunAjaran();
    getDataExamType();
    getDataJenjang();
    getDataQuotaComposition();
  }, []);

  useEffect(() => {
    //setting for detail/edit
    if (rancangan) {
      setTitle(rancangan.title);
      setExamType({
        label: rancangan.exam_type.value,
        value: rancangan.exam_type.num_code
      });
      setJenjang({
        label: rancangan.jenjang,
        value: rancangan.jenjang,
        load: "first-load"
      });
      setGrade({
        label: rancangan.grade_num,
        value: rancangan.grade_char,
        load: "first-load"
      });
      setSubject({
        label: rancangan.subject_name,
        value: rancangan.subject_id,
        load: "first-load"
      });
      setSoalQuota(rancangan.soal_quota);
      setQuotaComposition({
        label: rancangan.quota_composition.value,
        value: rancangan.quota_composition.char_code
      });
      setMcComposition(rancangan.mc_composition);
      setEsComposition(rancangan.es_composition);
      setCreatorMc(rancangan.mc_creator);
      setCreatorEs(rancangan.es_creator);
      setPartnerMc(rancangan.mc_partner);
      setPartnerEs(rancangan.es_partner);

      setCollaboration(rancangan.collaboration.char_code);
      if (rancangan.partner_id !== null)
        setPartner({ id: rancangan.partner_id, name: rancangan.partner_name });
      setPartnerQuota(rancangan.partner_quota);
      const sorted = sortBy(rancangan.soals, soal => soal.no);
      setSelectedSoal(sorted);
      setRancanganStatus(rancangan.status.value);      
    }

    
  }, [rancangan]);

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

  const showAddSoal = () => {
    getSoal();
    setOpenBottomDrawer(true);
    setBottomDrawerTittle("Add Soal To Rancangan");
  };

  const closeAddSoal = () => {
    setSoalData([]);
    setOpenBottomDrawer(false);
  };

  const getById = async id => {
    const response = await doGet("soal/" + id);
    if (!response.error) {
      return response.data;
    }
  };

  const detail = async obj => {
    const soal = await getById(obj.id);
    setSoal(soal);
    setOpenTopDrawer(true);
    setTopDrawerTittle("Soal Detail");
  };

  const closeDetailSoal = () => {
    setSoal(null);
    setOpenTopDrawer(false);
  };

  const chooseSoal = soal => {
    const mySoal = getSoalByMe();
    let quotaSoal = 0;
    
      if (isCreator()) {
        quotaSoal = creatorMc + creatorEs;        
      } else {
        quotaSoal = partnerMc + partnerEs;
      }
    

    if (quotaSoal > mySoal.length) {
      const soalByMe = { ...soal, add_by: user.id };
      const soalWithNo = { ...soalByMe, no: selectedSoal.length + 1, bobot: 0 };
      const added = [...selectedSoal, soalWithNo];
      const sorted = sortBy(added, soal => soal.no);
      setSelectedSoal(sorted);
    }

    closeAddSoal();
  };

  const removeSoal = removedSoal => {
    const filtered = selectedSoal.filter(
      selected => selected.id !== removedSoal.id
    );
    let no = 0;
    const arranged = filtered.map(soal => ({ ...soal, no: ++no }));
    setSelectedSoal(arranged);
  };

  const bobotChange = soal => e => {
    const value = parseFloat(e.target.value);
    if (action === "edit" || action === "create")
      if (value > 0) {
        let filtered = selectedSoal.filter(existing => existing.id !== soal.id);
        soal = { ...soal, bobot: value };
        filtered = [...filtered, soal];
        const sorted = sortBy(filtered, soal => soal.no);
        setSelectedSoal(sorted);
      }
  };

  const cancel = () => {
    clear();
    onClose();
  };

  const approved = async id => {
    const params = { id: id, approve_by: user.id };
    await doPatch("rancangan/approve", params, "verified by reviewer");
    setRancanganStatus("Verified");
  };

  const openNotesBeforeAction = notesType => {
    setOpenNotes(true);
    setNotesType(notesType);
    setDisableNoteTypeChange(true);
  };
  const rejected = async (notes) => {
    const params = { id: rancangan.id, reject_by: user.id, notes : notes };
    await doPatch("rancangan/reject", params, "rejected by reviewer");
    setRancanganStatus("Rejected");
  };

  const revision = async (notes) => {
    const params = { id: rancangan.id, revise_by: user.id,notes : notes };
    await doPatch("rancangan/revise", params, "need for revision");
    setRancanganStatus("Need Revision");
  };

  const showNotes = () => {
    setNotesType(1)
    setOpenNotes(true);
    getNotesData();
    setDisableNoteTypeChange(true);
  };

  const sendNotes = async notes => {
    const reviewers = rancangan.reviewers.filter(ran => ran.emp_id === user.id);
    let to_person = null;
    let to_role = null;
    if (reviewers.length > 0) {
      to_person = rancangan.creator_id;
    } else {
      to_role = 9;
    }

    const params = {
      note_type_code: notesType,
      text: notes,
      from: user.id,
      to_person: to_person,
      to_role: to_role,
      object_id: rancangan.id,
      status: 0
    };

    await doPost("note", params, "note saved");
    getNotesData();

    if (notesType === 3) {
      revision(notes);
    } else if (notesType === 4) {
      rejected(notes);
    }
    setNotesType(1)
  };

  const getSoalByMe = () => {
    const byMe = selectedSoal.filter(soal => soal.add_by === user.id);    
    return byMe
  };

  const submit = () => {
    let errors = {};

    if (jenjang === null) {
      errors = { ...errors, ejenjang: "please choose jenjang" };
    }

    if (grade === null) {
      errors = { ...errors, egrade: "please choose grade" };
    }

    if (subject === null) {
      errors = { ...errors, esubject: "please choose subject" };
    }

    if (sumBobot() !== 100) {
      errors = { ...errors, ebobot: "total bobot must be 100" };
    }

    const soalByMe = getSoalByMe();
    let quotaSoal = 0;
    if (isCreator()) {
      quotaSoal = creatorMc + creatorEs;        
    } else {
      quotaSoal = partnerMc + partnerEs;
    }
    
    if (soalByMe.length !== quotaSoal) {
      errors = {
        ...errors,
        equota:
          "you already add " +
          soalByMe.length +
          ", you have to add " +
          quotaSoal +
          " soal"
      };
    }

    setErrorState(errors);

    if (isEmpty(errors)) {
      let newRancangan = {
        title: title,
        jenjang: jenjang.value,
        grade_char: grade.value,
        grade_num: grade.label,
        subject: subject.value,
        tahun_ajaran_char: tahunAjaran,
        soal_quota: soalQuota,
        quota_composition: quotaComposition.value,
        mc_composition: mcComposition,
        es_composition: esComposition,
        mc_creator: creatorMc,
        es_creator: creatorEs,
        mc_partner: partnerMc,
        es_partner: partnerEs,
        collaboration_type: collaboration,
        partner_quota: partnerQuota,        
        status: status,
        exam_type_code: examType.value
      };

      if (partner !== null) {
        newRancangan = { ...newRancangan, partner: partner.id };
      }

      const soals = selectedSoal.map(soal => ({
        id: soal.id,
        bobot: soal.bobot,
        soal_num: soal.no,
        add_by: soal.add_by
      }));

      newRancangan = { ...newRancangan, soals: soals };

      if (rancangan) {
        const updatedRancangan = { ...newRancangan, id: rancangan.id };
        update(updatedRancangan);
      } else {
        newRancangan = { ...newRancangan, creator: user.id }
        create(newRancangan);
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
    setSoalQuota(0);
    setQuotaComposition({ value: "M", label: "multiple choice" });
    setMcComposition(0);
    setEsComposition(0);
    setPartner(null);
    setCollaboration("F");
    setPartnerQuota(0);
    setSelectedSoal([]);
    setErrorState({});
    setRancanganStatus("New");
  };

  const sumBobot = () => {
    return selectedSoal.reduce((a, b) => a + (b["bobot"] || 0), 0);
  };

  const splitBobot = () => {
    if (action === "edit" || action === "create") {
      const newBobot = Math.floor(100 / selectedSoal.length);
      let splitted = selectedSoal.map(soal => ({ ...soal, bobot: newBobot }));
      const sorted = sortBy(splitted, soal => soal.no);
      setSelectedSoal(sorted);
    }
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

          <TextField
            id="soalQuota"
            value={soalQuota}
            margin="dense"
            onChange={soalQuotaChange}
            variant="outlined"
            type="number"
            label="jumlah soal"
            style={{ margin: "-1px 4px 0 4px", width: 100 }}
          />

          <RSelect
            value={quotaComposition}
            onChange={quotaCompositionChange}
            name="bentuk soal"
            options={dataQuotaComposition}
            placeholder="bentuk soal..."
            styles={selectCustomZindex}
          />

          <Conditional condition={quotaComposition.value === "C"}>
            <TextField
              id="mcComposition"
              value={mcComposition}
              margin="dense"
              type="number"
              onChange={mcCompositionChange}
              variant="outlined"
              label="MC"
              style={{ margin: "-1px 4px 0 4px", width: 60 }}
            />
            <TextField
              id="esComposition"
              value={esComposition}
              margin="dense"
              onChange={esCompositionChange}
              variant="outlined"
              type="number"
              label="ES"
              style={{ margin: "-1px 4px 0 4px", width: 60 }}
            />
          </Conditional>

          <Conditional condition={collaboration === "P"}>
            <Conditional
              condition={
                quotaComposition.value === "M" || quotaComposition.value === "C"
              }
            >
              <TextField
                id="creatorMc"
                value={creatorMc}
                margin="dense"
                variant="outlined"
                type="number"
                label="creator MC"
                style={{ margin: "-1px 4px 0 4px", width: 100 }}
                onChange={creatorMcChange}
              />
            </Conditional>

            <Conditional
              condition={
                quotaComposition.value === "E" || quotaComposition.value === "C"
              }
            >
              <TextField
                id="creatorEs"
                value={creatorEs}
                margin="dense"
                variant="outlined"
                type="number"
                label="creator ES"
                style={{ margin: "-1px 4px 0 4px", width: 100 }}
                onChange={creatorEsChange}
              />
            </Conditional>
          </Conditional>

          <Conditional
            condition={
              collaboration === "F" &&
              (action === "edit" || action === "create")
            }
          >
            <Grid
              container
              item
              xs={2}
              alignItems="center"
              style={{ height: 40 }}
            >
              <AddButton
                text="Add Partner"
                action={showAddPartner}
                classes={common.marginX}
              />
            </Grid>
          </Conditional>
          <Conditional condition={collaboration === "P"}>
            <Grid
              wrap="nowrap"
              container
              item
              xs={4}
              alignItems="center"
              justify="space-around"
              style={{ height: 40 }}
            >
              <Chip
                label={
                  partner !== null &&
                  "partner : " + partner.name.substring(0, 15)
                }
                onDelete={isCreator() && (action === "edit" || action === "create") && removePartner}
                className={classes.chip}
                color="primary"
              />

              <Conditional
                condition={
                  quotaComposition.value === "M" ||
                  quotaComposition.value === "C"
                }
              >
                <TextField
                  id="partnerMc"
                  value={partnerMc}
                  margin="dense"
                  onChange={partnerMcChange}
                  variant="outlined"
                  type="number"
                  label="partner MC"
                  style={{ margin: "-1px 4px 0 4px", width: 100 }}
                />
              </Conditional>
              <Conditional
                condition={
                  quotaComposition.value === "E" ||
                  quotaComposition.value === "C"
                }
              >
                <TextField
                  id="partnerEs"
                  value={partnerEs}
                  margin="dense"
                  onChange={partnerEsChange}
                  variant="outlined"
                  type="number"
                  label="partner ES"
                  style={{ margin: "-1px 4px 0 4px", width: 100 }}
                />
              </Conditional>
            </Grid>
          </Conditional>

          <span style={{ color: "red", margin: "0 16px" }}>
            {errorState.ejenjang ||
              errorState.egrade ||
              errorState.esubject ||
              errorState.ebobot ||
              errorState.equota}
          </span>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h5">status : {rancanganStatus}</Typography>
            </Grid>

            <Grid item>
              <Conditional
                condition={rancangan && rancangan.status.num_code !== 5}
              >
                <Protected current={currentAccess} only="A">
                  <ApproveButton
                    tooltip="Approve"
                    action={() => approved(rancangan.id)}
                    classes={classes.floatButton}
                  />

                  <EditButton
                    tooltip="Need Revision"
                    action={() => openNotesBeforeAction(3)}
                    classes={classes.floatButton}
                  />
                  <CancelButton
                    tooltip="Reject"
                    action={() => openNotesBeforeAction(4)}
                    classes={classes.floatButton}
                  />
                </Protected>
              </Conditional>
              <Protected current={currentAccess} access={["W", "A"]}>
                <MailButton
                  tooltip="Create Notes"
                  action={showNotes}
                  classes={classes.floatButton}
                />
              </Protected>
            </Grid>
          </Grid>
        </Grid>
        <Grid container wrap="nowrap" className={common.paddingX}>
          <Grid item container>
            <InputText
              input={title}
              onChange={titleChange}
              readOnly={action !== "edit" && action !== "create"}
            />
          </Grid>
          <Grid item xs={2} container alignItems="center" justify="flex-end">
            Total Bobot : {sumBobot("bobot")}
          </Grid>

          <Conditional condition={action === "edit" || action === "create"}>
            <Grid item xs={3} container alignItems="center" justify="flex-end">
              <Button variant="contained" color="primary" onClick={splitBobot}>
                Samakan Bobot
              </Button>
            </Grid>
            <Grid container item xs={2} alignItems="center" justify="center">
              <AddButton text="Add Soal" action={showAddSoal} />
            </Grid>
          </Conditional>
        </Grid>
        <Grid
          container
          className={clsx(
            classes.table_wrapper,
            common.borderTopRadius,
            common.marginTop
          )}
        >
          <Table className={classes.table}>
            <TableHead>
              <TableRow className={classes.table_header}>
                <TableCell className={common.borderTopLeftRadius}>No</TableCell>
                <TableCell>KD</TableCell>
                <TableCell>Materi</TableCell>
                <TableCell>Ranah</TableCell>
                <TableCell>Pembuat</TableCell>
                <TableCell>Bentuk</TableCell>
                <TableCell className={common.borderTopRightRadius}>
                  Status
                </TableCell>
                <TableCell>Bobot</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedSoal.map(row => (
                <TableRow key={row.id} className={classes.tableRow}>
                  <TableCell>{row.no}</TableCell>
                  <TableCell>{row.kds.join(",")}</TableCell>
                  <TableCell>{row.materis.join(",")}</TableCell>
                  <TableCell>{row.ranahs.join(",")}</TableCell>
                  <TableCell>{row.creator_name}</TableCell>
                  <TableCell>{row.type_name}</TableCell>
                  <TableCell>
                    <StatusChip status={row.active} />
                  </TableCell>
                  <TableCell>
                    <TextField
                      id="bobot"
                      value={row.bobot}
                      margin="dense"
                      onChange={bobotChange(row)}
                      variant="outlined"
                      type="number"
                      label="bobot"
                      style={{ margin: "-1px 4px 0 4px", width: 100 }}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <Grid container wrap="nowrap">
                      <DetailButton
                        tooltip="detail"
                        action={() => detail(row)}
                        classes={classes.floatButton}
                      />
                      <Conditional
                        condition={(action === "edit" || action === "create") && isMine(row.add_by)}
                      >
                        <Protected current={currentAccess} only="D">
                          <DeleteButton
                            tooltip="remove soal"
                            action={() => removeSoal(row)}
                            classes={classes.floatButton}
                          />
                        </Protected>
                      </Conditional>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
        <SearchListAsync path={"user"} action={addPartner} />
      </PopUp>

      <BottomDrawer
        tittle={bottomDrawerTittle}
        open={openBottomDrawer}
        close={closeAddSoal}
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
                  Pelajaran
                </TableCell>
                <TableCell>Jenjang</TableCell>
                <TableCell>Kelas</TableCell>
                <TableCell>KD</TableCell>
                <TableCell>Materi</TableCell>
                <TableCell>Ranah</TableCell>
                <TableCell>Pembuat</TableCell>
                <TableCell>Bentuk</TableCell>
                <TableCell className={common.borderTopRightRadius}>
                  Status
                </TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {soalData.map(row => (
                <TableRow key={row.id} className={classes.tableRow}>
                  <TableCell>{row.subject_name}</TableCell>
                  <TableCell>{row.jenjang}</TableCell>
                  <TableCell>{row.grade_num}</TableCell>
                  <TableCell>{row.kds.join(",")}</TableCell>
                  <TableCell>{row.materis.join(",")}</TableCell>
                  <TableCell>{row.ranahs.join(",")}</TableCell>
                  <TableCell>{row.creator_name}</TableCell>
                  <TableCell>{row.type_name}</TableCell>
                  <TableCell>
                    <StatusChip status={row.active} />
                  </TableCell>
                  <TableCell>
                    <Grid container wrap="nowrap">
                      <DetailButton
                        tooltip="detail"
                        action={() => detail(row)}
                        classes={classes.floatButton}
                      />
                      <CheckButton
                        tooltip="choose soal"
                        action={() => chooseSoal(row)}
                        classes={classes.floatButton}
                      />
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableHead>
              <TableRow className={classes.table_header}>
                <TableCell>Pelajaran</TableCell>
                <TableCell>Jenjang</TableCell>
                <TableCell>Kelas</TableCell>
                <TableCell>KD</TableCell>
                <TableCell>Materi</TableCell>
                <TableCell>Ranah</TableCell>
                <TableCell>Pembuat</TableCell>
                <TableCell>Bentuk</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </Grid>
      </BottomDrawer>

      <TopDrawer
        tittle={topDrawerTittle}
        open={openTopDrawer}
        close={closeDetailSoal}
      >
        <SoalForm action="detail" soal={soal} onClose={closeDetailSoal} />
      </TopDrawer>

      <Notes
        open={openNotes}
        onClose={() => setOpenNotes(false)}
        notesData={notesData}
        notesType={notesType}
        notesTypeChange={notesTypeChange}
        notesTypeOption={notesTypeOption}
        onSubmit={sendNotes}
        disabled={disableNoteTypeChange}
      />
    </>
  );
};

export default RancanganForm;
