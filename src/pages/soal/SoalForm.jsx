import React, { useState, useCallback, useEffect, useContext } from "react";
import { isEmpty } from "lodash";
import Grid from "@material-ui/core/Grid";
import { useUpdateEffect } from "react-use";
import clsx from "clsx";
import { doUpload, doPost, doGet, doPut } from "apis/api-service";
import useStyles, { selectCustomZindex } from "./soalStyle";
import { useCommonStyles } from "themes/commonStyle";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Editor } from "react-draft-wysiwyg";
import {
  EditorState,
  convertFromHTML,
  blocksFromHTML,
  ContentState,
  createFromBlockArray
} from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import "assets/css/react-draft-wysiwyg.css";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from "@material-ui/core/Chip";
import AddButton from "components/AddButton";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import Conditional from "components/Conditional";
import MathInput from "components/MathInput";
import MathDisplay from "components/MathDisplay";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import PopUp from "components/PopUp";
import AnswerForm from "./AnswerForm";
import DeleteButton from "components/DeleteButton";
import Avatar from "@material-ui/core/Avatar";
import { UserContext } from "contexts/UserContext";
import { default as RSelect } from "react-select";
import MultipleSelect from "components/MultipleSelect";
import MultipleSelectCheckBox from "components/MultipleSelectCheckBox";
import { useDropzone } from "react-dropzone";
import ReactAudioPlayer from "react-audio-player";
import { Typography } from "@material-ui/core";
import ApproveButton from "../../components/ApproveButton";
import CancelButton from "../../components/CancelButton";

const SoalForm = ({ create, update, onClose, soal, action, open }) => {
  const classes = useStyles();
  const common = useCommonStyles();

  const user = useContext(UserContext);

  const [audio, setAudio] = useState(null);
  const uploadAudio = async () => {
    let formData = new FormData();
    formData.append("audio", audio);
    const url = await doUpload("audios/up", formData);
    setContent(url.data.link);
    setAudio(null);
  };

  const changeAudio = () => {
    setAudio(null);
    setContent("");
  };

  const [errorState, setErrorState] = useState({});
  const [content, setContent] = useState("");
  const [plainContent, setPlainContent] = useState("");
  const plainContentChange = e => {
    if (action === "edit" || action === "create")
      setPlainContent(e.target.value);
  };
  const [mathContent, setMathContent] = useState("");
  const mathContentChange = content => {
    if (action === "edit" || action === "create") {
      setMathContent(content);
    }
  };
  const [plainQuestion, setPlainQuestion] = useState("");
  const plainQuestionChange = e => {
    if (action === "edit" || action === "create")
      setPlainQuestion(e.target.value);
  };
  const [mathQuestion, setMathQuestion] = useState("");

  const [dataMathFormula, setDataMathFormula] = useState("");
  const getDataMathFormula = async params => {
    const response = await doGet("math");
    setDataMathFormula(response.data);
  };

  const [active, setActive] = useState(true);
  const [status, setStatus] = useState(true);
  const [mediaUrl, setMediaUrl] = useState("");

  const [answers, setAnswers] = useState([]);
  const addAnswers = answer => {
    let exist = answers.filter(
      a => a.code === answer.code || a.content === answer.content
    ).length;
    if (exist < 1) {
      setAnswers([...answers, answer]);
      setAnswerFormAnchor(null);
    } else {
      return false;
    }
  };

  const deleteAnswer = deleted => {
    if (action === "edit" || action === "create") {
      const newAns = answers.filter(a => a.code !== deleted.code);
      setAnswers(newAns);
      if (deleted.code === rightAnswer) {
        setRightAnswer("");
      }
    }
  };

  const [answerFormAnchor, setAnswerFormAnchor] = useState(null);
  const showAnswerForm = event => {
    if (action === "edit" || action === "create")
      setAnswerFormAnchor(answerFormAnchor ? null : event.currentTarget);
  };

  const [rightAnswer, setRightAnswer] = useState("");
  const chooseRightAnswer = e => {
    if (action === "edit" || action === "create")
      setRightAnswer(e.target.value);
  };

  const [external, setExternal] = useState(0);
  const externalChange = e => {
    if (action === "edit" || action === "create")
      setExternal(e.target.checked ? 1 : 0);
  };

  const [source, setSource] = useState("");
  const sourceChange = e => {
    if (action === "edit" || action === "create") setSource(e.target.value);
  };

  const [contentType, setContentType] = useState(1);
  const contentTypeChange = e => {
    if (action === "edit" || action === "create")
      setContentType(e.target.value);
  };

  const [questionType, setQuestionType] = useState(1);
  const questionTypeChange = e => {
    if (action === "edit" || action === "create")
      setQuestionType(e.target.value);
  };

  const [contentEditor, setContentEditor] = useState(EditorState.createEmpty());
  const contentEditorChange = contentEditor => {
    if (action === "edit" || action === "create")
      setContentEditor(contentEditor);
  };

  const [questionEditor, setQuestionEditor] = useState(
    EditorState.createEmpty()
  );
  const questionEditorChange = questionEditor => {
    if (action === "edit" || action === "create")
      setQuestionEditor(questionEditor);
  };

  const [answerType, setAnswerType] = useState("E");
  const answerTypeChange = e => {
    if (action === "edit" || action === "create") setAnswerType(e.target.value);
  };

  const [dataSubject, setDataSubject] = useState([]);
  const [subject, setSubject] = useState(null);
  const subjectChange = e => {
    if (action === "edit" || action === "create") setSubject(e);
  };
  const getDataSubject = async () => {
    const params = { jenjang: jenjang.value, grade: grade.value };
    const response = await doGet("mapel", params);
    setDataSubject(
      response.data.map(data => ({ label: data.name, value: data.id }))
    );
  };

  const [dataKd, setDataKd] = useState([]);
  const [kd, setKd] = useState([]);

  const getDataKd = async () => {
    const params = {
      selection: 1,
      jenjang: jenjang.value,
      grade: grade.value,
      subject: subject.value,
      ki: 3
    };

    const response = await doGet("kd", params);
    if (response.data) {
      setDataKd(
        response.data.map(data => ({
          id: data.id,
          value: data.kd,
          description: data.kd_desc,
          meta: `kd : ${data.kd} | semester : ${data.semester}`
        }))
      );
    }
  };

  const [dataRanah, setDataRanah] = useState([]);
  const [ranah, setRanah] = useState([]);
  const getDataRanah = async kds => {
    const kd_ids = kds.map(kd => kd.id);
    const params = {
      selection: 1,
      kd_ids: kd_ids
    };
    const response = await doGet("kd/ranah", params);
    setDataRanah(
      response.data.map(data => ({
        id: data.ranah_id,
        value: data.ranah_code,
        description: `${data.ranah_code} - ${data.ranah_ket}`,
        meta: `kd : ${data.kd}`
      }))
    );
  };

  const [dataIndicator, setDataIndicator] = useState([]);
  const [indicator, setIndicator] = useState([]);

  const getDataIndicator = async ranahs => {
    const kd_ids = kd.map(kd => kd.id);
    const ranah_codes = ranahs.map(ranah => ranah.value);

    const params = {
      selection: 1,
      kd_ids: kd_ids,
      ranah_codes: ranah_codes
    };
    const response = await doGet("kd/indicator", params);
    setDataIndicator(
      response.data.map(data => ({
        id: data.trx_indi_id,
        value: data.indikator,
        description: data.indikator,
        meta: `ranah : ${data.ranah}`
      }))
    );
  };

  const [dataLevel, setDataLevel] = useState([]);
  const [level, setLevel] = useState(null);
  const levelChange = e => {
    if (action === "edit" || action === "create") setLevel(e);
  };
  const getDataLevel = async () => {
    const params = { group: "question_level" };
    const response = await doGet("param", params);
    setDataLevel(
      response.data.map(j => ({ label: j.value, value: j.num_code }))
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
  }; //

  const [dataGrade, setDataGrade] = useState([]);
  const [grade, setGrade] = useState(null);
  const gradeChange = e => {
    if (action === "edit" || action === "create") setGrade(e);
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

  const [dataContentTypes, setDataContentTypes] = useState([]);
  const getDataContentTypes = async () => {
    const params = { group: "content_type" };
    const response = await doGet("param", params);
    setDataContentTypes(
      response.data.map(data => ({
        id: data.num_code,
        value: data.value,
        code: data.num_code
      }))
    );
  };

  useUpdateEffect(() => {
    if (open === false) clear();
  }, [open]);

  useEffect(() => {
    getDataJenjang();
    getDataLevel();
    getDataContentTypes();
    getDataMathFormula();
  }, []);

  useEffect(() => {
    if (soal) {
      setExternal(soal.external);
      setJenjang({
        label: soal.jenjang,
        value: soal.jenjang,
        load: "first-load"
      });
      setGrade({
        label: soal.grade_num,
        value: soal.grade_char,
        load: "first-load"
      });
      setSubject({
        label: soal.subject_name,
        value: soal.subject_id,
        load: "first-load"
      });
      setKd(
        soal.kds.map(kd => ({
          id: kd.id,
          value: kd.kd,
          description: kd.kd_desc,
          load: "first-load"
        }))
      );
      setRanah(
        soal.ranahs.map(ranah => ({
          id: ranah.id,
          value: ranah.ranah_kode,
          description: `${ranah.ranah_kode} - ${ranah.ranah_ket}`,
          meta: `jenis : ${ranah.ranah_jenis}`,
          load: "first-load"
        }))
      );
      setIndicator(
        soal.indicators.map(data => ({
          id: data.id,
          value: data.indi_pencapaian,
          description: data.indi_pencapaian,
          meta: `ranah : ${data.indi_ranah}`,
          load: "first-load"
        }))
      );
      setLevel({ label: soal.level.value, value: soal.level.num_code });
      setSource(soal.source);
      setAnswerType(soal.answer_type);

      if (soal.answer_type === "M") {
        setAnswers(
          soal.options.map(op => ({
            id: op.id,
            code: op.code,
            content: op.content,
            contentType: op.content_type
          }))
        );
        setRightAnswer(soal.right_answer);
      }
      setContentType(soal.content_type);
      if (soal.content_type === 1) {
        setPlainContent(soal.content);
      } else if (soal.content_type === 2) {
        const blocksFromHTML = convertFromHTML(soal.content);
        const state = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        );

        setContentEditor(EditorState.createWithContent(state));
      } 
      else if(soal.content_type===3) {
        setMathContent(soal.content);
      } 
      else if(soal.content_type===5){
        setContent(soal.content);
      }

      setQuestionType(soal.question_type);
      if (soal.question_type === 1) {
        setPlainQuestion(soal.question);
      } else if (soal.question_type === 2) {
        const blocksFromHTML = convertFromHTML(soal.question);
        const state = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        );

        setQuestionEditor(EditorState.createWithContent(state));
      } else {
        setMathQuestion(soal.content);
      }
    }
  }, [soal]);

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

  useUpdateEffect(() => {
    if (answers.length > 0) {
      setErrorState({ ...errorState, echoices: "" });
    }
    if (rightAnswer !== "") {
      setErrorState({ ...errorState, erightAns: "" });
    }
  }, [answers, rightAnswer]);

  useUpdateEffect(() => {
    if (action === "edit" || action === "create") {
      if (subject === null) {
        setKd([]);
        setDataKd([]);
      } else {
        if (!subject.load) {
          setKd([]);
          setDataKd([]);
        }
        if (jenjang !== null && grade !== null) {
          getDataKd();
        }
      }
    }
  }, [subject]);

  const kdOnChange = kds => {
    setKd(kds);
    setRanah([]);
    setDataRanah([]);
    if (kds.length > 0) getDataRanah(kds);
    setIndicator([]);
  };

  const ranahOnChange = ranahs => {
    setRanah(ranahs);
    setIndicator([]);
    setDataIndicator([]);
    if (ranahs.length > 0) getDataIndicator(ranahs);
  };

  const indicatorOnChange = indicators => {
    setIndicator(indicators);
  };

  const cancel = () => {
    clear();
    onClose();
  };

  const uploadImageCallBack = img => {
    const formData = new FormData();
    formData.append("img", img);
    return doUpload("images/up", formData);
  };

  const onDrop = useCallback(files => {
    setAudio(files[0]);
    let reader = new FileReader();

    reader.onloadend = () => {
      setContent(reader.result);
    };

    reader.readAsDataURL(files[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const submit = () => {
    let contentx = "";
    let question = "";
    let errors = {};

    if (external === 0) {
      if (kd.length < 1) {
        errors = { ...errors, ekd: "please choose kd" };
      }

      if (ranah.length < 1) {
        errors = { ...errors, eranah: "please choose ranah" };
      }

      if (indicator.length < 1) {
        errors = { ...errors, eindicator: "please choose indicator" };
      }
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

    if (level === null) {
      errors = { ...errors, elevel: "please choose level" };
    }

    if (answerType === "M") {
      if (answers.length < 1) {
        errors = { ...errors, echoices: "multiple choice should have choices" };
      } else {
        if (rightAnswer === "") {
          errors = { ...errors, erightAns: "please choose the right answer" };
        }
      }
    }

    if (contentType === 1) {
      contentx = plainContent;
    } else if (contentType === 2) {
      if (contentEditor.getCurrentContent().hasText())
      contentx = stateToHTML(contentEditor.getCurrentContent());
    } else if (contentType === 3) {
      contentx = mathContent;
    } else if (contentType === 5) {
      contentx = content;
    } 

    if (questionType === 1) {
      question = plainQuestion;
    } else if (questionType === 2) {
      if (questionEditor.getCurrentContent().hasText())
        question = stateToHTML(questionEditor.getCurrentContent());
    } else if (questionType === 3) {
      question = mathQuestion;
    }

    if (contentx === "") {
      errors = { ...errors, econtent: "please fill the content" };
    }

    if (question === "") {
      errors = { ...errors, equestion: "please fill the question" };
    }

    setErrorState(errors);

    if (isEmpty(errors)) {
      let newSoal = {
        source: source,
        jenjang: jenjang.value,
        grade_char: grade.value,
        grade_num: grade.label,
        subject: subject.value,
        kds: kd.map(kd => kd.id),
        ranahs: ranah.map(ranah => ranah.id),
        indicators: indicator.map(indicator => indicator.id),
        external: external,
        create_by: user.id,
        active: active,
        answer_type: answerType,
        content_type: contentType,
        question_type: questionType,
        status: status,
        content: contentx,
        question: question,
        right_answer: rightAnswer,
        media_url: mediaUrl,
        level: level.value,
        options: answers
      };

      if (soal) {
        newSoal = { ...newSoal, id: soal.id };
        update(newSoal);
      } else {
        create(newSoal);
      }

      clear();
      onClose();
    }
  };

  const clear = () => {
    setContent('');
    setExternal(0);
    setJenjang(null);
    setGrade(null);
    setSubject(null);
    setKd([]);
    setRanah([]);
    setIndicator([]);
    setLevel(null);
    setSource("");
    setAnswerType("E");
    setContentType(1);
    setQuestionType(1);
    setAnswers([]);
    setRightAnswer("");
    setContentEditor(EditorState.createEmpty());
    setPlainContent("");
    setMathContent("");
    setQuestionEditor(EditorState.createEmpty());
    setMathQuestion("");
    setPlainQuestion("");
    setErrorState({});
  };

  return (
    <>
      <Grid container direction="column" className={classes.addContent}>
        <Grid container className={common.paddingX}>
          <FormControlLabel
            className={classes.checkbox}
            control={
              <Checkbox
                checked={external === 1}
                onChange={externalChange}
                value={external}
                color="primary"
                inputProps={{
                  "aria-label": "external"
                }}
              />
            }
            label="external"
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

          <Conditional condition={external === 0}>
            <MultipleSelect
              readOnly={!create && !update}
              value={kd}
              options={dataKd}
              onChange={kdOnChange}
              placeholder="kd"
            />

            <MultipleSelect
              readOnly={!create && !update}
              value={ranah}
              options={dataRanah}
              onChange={ranahOnChange}
              placeholder="ranah"
            />

            <MultipleSelectCheckBox
              readOnly={!create && !update}
              value={indicator}
              options={dataIndicator}
              onChange={indicatorOnChange}
              placeholder="indicator"
            />
          </Conditional>

          <RSelect
            value={level}
            onChange={levelChange}
            name="level"
            options={dataLevel}
            placeholder="level..."
            styles={selectCustomZindex}
          />

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
            {errorState.ekd}
          </span>
          <span style={{ color: "red", margin: "0 16px" }}>
            {errorState.eranah}
          </span>
          <span style={{ color: "red", margin: "0 16px" }}>
            {errorState.eindicator}
          </span>
          <span style={{ color: "red", margin: "0 16px" }}>
            {errorState.elevel}
          </span>
        </Grid>

        <Grid container className={common.marginY}>
          <TextField
            id="source"
            value={source}
            margin="dense"
            onChange={sourceChange}
            fullWidth
            variant="outlined"
            label="sumber soal..."
          />
        </Grid>
        <Grid
          container
          className={clsx(classes.editorWrapper, common.marginBottom)}
        >
          <Grid
            container
            justify="space-evenly"
            wrap="nowrap"
            className={classes.editorHeader}
          >
            <Grid container justify="flex-start" alignItems="center">
              <Chip size="small" label="Content" className={common.marginTop} />
            </Grid>
            <Conditional condition={errorState.econtent !== ""}>
              <Grid item xs={8}>
                <span style={{ color: "red" }}>{errorState.econtent}</span>
              </Grid>
            </Conditional>
            <Grid container justify="flex-end">
              <Select
                value={contentType}
                onChange={contentTypeChange}
                displayEmpty
                name="contentType"
                className={classes.selectEmpty}
              >
                {dataContentTypes.map(type => (
                  <MenuItem key={type.id} value={type.code}>
                    {type.value}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
          <Grid container className={classes.inputWraper}>
            <Conditional condition={contentType === 1}>
              <TextField
                id="plainContent"
                value={plainContent}
                multiline
                margin="normal"
                onChange={plainContentChange}
                fullWidth
                variant="outlined"
                placeholder="text content"
              />
            </Conditional>
            <Conditional condition={contentType === 2}>
              <Editor
                editorState={contentEditor}
                onEditorStateChange={contentEditorChange}
                toolbar={{
                  image: {
                    uploadCallback: uploadImageCallBack,
                    previewImage: true
                  }
                }}
              />
            </Conditional>
            <Conditional condition={contentType === 3}>
              <MathInput
                value={mathContent}
                type="asciimath"
                action={mathContentChange}
                formulas={dataMathFormula}
              />
              <MathDisplay value={mathContent} />
            </Conditional>
            <Conditional condition={contentType === 5}>
              <Grid
                container
                justify="center"
                alignItems="center"
                className={common.margin}
              >
                <Conditional condition={content === ""}>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Typography variant="h5" style={{cursor:'pointer', borderRadius:4, backgroundColor:'green', color:'white', padding:16}}>
                      Click or Drag 'n' drop file here
                    </Typography>
                  </div>
                </Conditional>
                <Conditional condition={content !== ""}>
                  <ReactAudioPlayer controlsList="nodownload" style={{flex:'1'}} src={content} controls />
                  <Conditional condition={action !== "detail"}>
                    <CancelButton action={changeAudio} tooltip="change audio" />
                    <Conditional condition={audio !== null}>
                      <ApproveButton
                        action={uploadAudio}
                        tooltip="upload audio"
                      />
                    </Conditional>
                  </Conditional>
                </Conditional>
              </Grid>
            </Conditional>
          </Grid>
        </Grid>

        <Grid container className={classes.editorWrapper}>
          <Grid
            container
            justify="space-evenly"
            wrap="nowrap"
            className={classes.editorHeader}
          >
            <Grid container justify="flex-start" alignItems="center">
              <Chip
                size="small"
                label="Question"
                className={common.marginTop}
              />
            </Grid>
            <Conditional condition={errorState.equestion !== ""}>
              <Grid item xs={8}>
                <span style={{ color: "red" }}>{errorState.equestion}</span>
              </Grid>
            </Conditional>
            <Grid container justify="flex-end">
              <Select
                value={questionType}
                onChange={questionTypeChange}
                displayEmpty
                name="questionType"
                className={classes.selectEmpty}
              >
                {dataContentTypes.map(type => (
                  <MenuItem key={type.id} value={type.code}>
                    {type.value}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
          <Grid container className={classes.inputWraper}>
            <Conditional condition={questionType === 1}>
              <TextField
                id="plainQuestion"
                value={plainQuestion}
                multiline
                margin="normal"
                onChange={plainQuestionChange}
                fullWidth
                variant="outlined"
                placeholder="text content"
              />
            </Conditional>

            <Conditional condition={questionType === 2}>
              <Editor
                editorState={questionEditor}
                onEditorStateChange={questionEditorChange}
                toolbar={{
                  image: {
                    uploadCallback: uploadImageCallBack,
                    previewImage: true
                  }
                }}
              />
            </Conditional>
            <Conditional condition={questionType === 3}>
              <MathInput
                value={mathQuestion}
                type="asciimath"
                action={setMathQuestion}
                formulas={dataMathFormula}
              />
              <MathDisplay value={mathQuestion} />
            </Conditional>
          </Grid>
        </Grid>

        <Grid container className={classes.answerTypeWrapper}>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">
            <Chip size="small" label="Answer Type" />
            </FormLabel>
            <RadioGroup
              aria-label="answer type"
              name="answer type"
              className={classes.answerTypeGroup}
              value={answerType}
              onChange={answerTypeChange}
            >
              <FormControlLabel
                value="E"
                control={<Radio color="primary" />}
                label="Essay"
              />
              <FormControlLabel
                value="M"
                control={<Radio color="primary" />}
                label="Multiple Choice"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Conditional condition={answerType === "M"}>
          <Grid container className={classes.editorWrapper}>
            <Grid
              container
              justify="space-evenly"
              wrap="nowrap"
              className={classes.editorHeader}
            >
              <Grid container justify="flex-start" alignItems="center">
                <Chip size="small" label="Answer choices" />
              </Grid>

              <Grid item xs={8} container alignItems="center">
                <Conditional
                  condition={
                    answerType === "M" &&
                    rightAnswer === "" &&
                    answers.length > 0
                  }
                >
                  dont forget to choose the right answer
                </Conditional>
                <Conditional condition={rightAnswer !== ""}>
                  right answer = <strong>{rightAnswer}</strong>
                </Conditional>
                <Conditional condition={errorState.echoices !== ""}>
                  <span style={{ color: "red" }}>{errorState.echoices}</span>
                </Conditional>
                <Conditional condition={errorState.erightAns !== ""}>
                  <span style={{ color: "red" }}>{errorState.erightAns}</span>
                </Conditional>
              </Grid>

              <Grid container justify="flex-end">
                <AddButton action={showAnswerForm} tooltip="add choice" />
              </Grid>
            </Grid>
            <Grid container direction="column" style={{ padding: 8 }}>
              {answers.map(answer => (
                <Grid
                  key={answer.code}
                  container
                  spacing={1}
                  className={classes.hoverable}
                >
                  <Grid container alignItems="center" item xs={1}>
                    <Avatar className={classes.avatar}>{answer.code}</Avatar>
                  </Grid>
                  <Grid container alignItems="center" item xs={9}>
                    <Conditional condition={answer.contentType === 1}>
                      {answer.content}
                    </Conditional>
                    <Conditional condition={answer.contentType === 3}>
                      <MathDisplay value={answer.content} />
                    </Conditional>
                    <Conditional condition={answer.contentType === 4}>
                      <img
                        className={classes.imageOption}
                        src={answer.content}
                      />
                    </Conditional>
                  </Grid>
                  <Grid item xs={1} container alignItems="center">
                    <Tooltip title="choose right answer">
                      <Checkbox
                        checked={rightAnswer === answer.code}
                        onChange={chooseRightAnswer}
                        value={answer.code}
                        color="primary"
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={1} container alignItems="center">
                    <DeleteButton
                      tooltip="remove answer"
                      action={() => deleteAnswer(answer)}
                    />
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Conditional>

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
      <PopUp anchor={answerFormAnchor} position={"top-end"}>
        <AnswerForm
          save={addAnswers}
          cancel={() => {
            setAnswerFormAnchor(null);
          }}
          formulas={dataMathFormula}
        />
      </PopUp>
    </>
  );
};

export default SoalForm;
