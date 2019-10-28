/*
author alka@2019
*/
import React, { useState, useEffect } from "react";
import { doSilentPost } from "apis/api-service";
import clsx from "clsx";
import { useInterval } from "react-use";
import Grid from "@material-ui/core/Grid";
import useStyles from "./examStyle";
import { useCommonStyles } from "themes/commonStyle";
import Button from "@material-ui/core/Button";
import { withRouter } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import addMinutes from "date-fns/addMinutes";
import differenceInMinutes from "date-fns/differenceInMinutes";
import differenceInSeconds from "date-fns/differenceInSeconds";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Conditional from "components/Conditional";
import IconButton from "@material-ui/core/IconButton";
import Done from "@material-ui/icons/Done";
import MathDisplay from "components/MathDisplay";
import { doGet } from 'apis/api-service';
import ReactAudioPlayer from "react-audio-player";

const ExamPage = props => {
  const c = useStyles();
  const common = useCommonStyles();
  const exam = useSelector(state => state.exam);
  const user = useSelector(state => state.user);
  const ui = useSelector(state => state.ui);
  const [currentSoal, setCurrentSoal] = useState(null);
  const [timeMinute, setTimeMinute] = useState(0);
  const [timeSecond, setTimeSecond] = useState(0);
  const [timer, setTimer] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [tmpAnswer, setTmpAnswer] = useState("");

  const [answers, setAnswers] = useState([]);
  const [examStatus, setExamStatus] = useState(1);

  const minutes = 60;

  const [finishTime, setFinishTime] = useState(addMinutes(new Date(), minutes));

  useEffect(() => {
    if (exam.exam_data) {
      const firstSoal = exam.exam_data.rancangan.soals.filter(
        soal => soal.extra.soal_num === 1
      )[0];
      setCurrentSoal(firstSoal);
      let answersTemp = [];
      exam.exam_data.rancangan.soals.forEach(soal => {
        answersTemp = [
          ...answersTemp,
          { soal_num: soal.extra.soal_num, text: "" }
        ];
      });
      setAnswers(answersTemp);

      setFinishTime(addMinutes(new Date(), exam.exam_data.duration));
      setTimer(true);
      const stopExam = () => {
        setTimer(false);
        finish(true);
      };
      const timer = setTimeout(stopExam, exam.exam_data.duration * 60 * 1000);
      return () => clearTimeout(timer);
    }
  }, [exam]);

  useInterval(
    () => {
      const minuteDif = differenceInMinutes(finishTime, new Date());
      const secDif = differenceInSeconds(finishTime, new Date());
      setTimeMinute(minuteDif);
      setTimeSecond(secDif - minuteDif * 60);
    },
    timer === true ? 1000 : null
  );


  const getExamStatus = async(id) => {
    const params={id:id}
    const status = await doGet('exam/activity/status',params)
    setExamStatus(status.data)
  }
  
  useInterval(
    () => {
      if(exam.exam_data){
        if(examStatus===1){
          getExamStatus(exam.exam_data.id)        
        }else{
          ForcedFinish()          
        }
    }
    },
    5000
  );

  const finish = timeout => {
    const incompletes = answers.filter(ans => !ans.answered);
    if (incompletes.length < 1 || timeout === true) {
      props.history.push("/");
    }
    setOpenModal(true);
  };

  const ForcedFinish = () => {
    setOpenModal(false);
    props.history.push("/");
  };

  const answerListClick = answer => {
    const nextSoal = exam.exam_data.rancangan.soals.filter(
      soal => soal.extra.soal_num === answer.soal_num
    )[0];
    setCurrentSoal(nextSoal);
  };

  const next = () => {
    if (currentSoal.extra.soal_num < exam.exam_data.rancangan.soals.length) {
      const nextSoal = exam.exam_data.rancangan.soals.filter(
        soal => soal.extra.soal_num === currentSoal.extra.soal_num + 1
      )[0];
      setCurrentSoal(nextSoal);
      setTemporaryAnswer(nextSoal);
    } else {
      const nextSoal = exam.exam_data.rancangan.soals.filter(
        soal => soal.extra.soal_num === 1
      )[0];
      setCurrentSoal(nextSoal);
      setTemporaryAnswer(nextSoal);
    }
  };

  const prev = () => {
    if (currentSoal.extra.soal_num > 1) {
      const prevSoal = exam.exam_data.rancangan.soals.filter(
        soal => soal.extra.soal_num === currentSoal.extra.soal_num - 1
      )[0];
      setCurrentSoal(prevSoal);
      setTemporaryAnswer(prevSoal);
    } else {
      const prevSoal = exam.exam_data.rancangan.soals.filter(
        soal => soal.extra.soal_num === exam.exam_data.rancangan.soals.length
      )[0];
      setCurrentSoal(prevSoal);
      setTemporaryAnswer(prevSoal);
    }
  };

  const setTemporaryAnswer = soal => {
    if (soal.answer_type === "E") {
      const answer = answers.filter(
        ans => ans.soal_num === soal.extra.soal_num
      )[0].text;
      setTmpAnswer(answer);
    }
  };

  const answering = option => {
    if (ui.active_page.access && ui.active_page.access.includes("E")) {
      const answerIndex = answers.findIndex(
        answer => answer.soal_num === currentSoal.extra.soal_num
      );
      let newAnswers = [...answers];
      newAnswers[answerIndex] = {
        soal_num: currentSoal.extra.soal_num,
        code: option.code,
        answered: true
      };
      setAnswers(newAnswers);
      const params = {
        user_id: user.id,
        soal_id: currentSoal.id,
        exam_id: exam.exam_data.id,
        rancangan_id: exam.exam_data.rancangan.id,
        answer_code: option.code,
        answer_text: ""
      };

      doSilentPost("exam/answer", params);
    }
  };

  const ragu = () => {
    if (ui.active_page.access && ui.active_page.access.includes("E")) {
      const answerIndex = answers.findIndex(
        answer => answer.soal_num === currentSoal.extra.soal_num
      );
      let newAnswers = [...answers];
      newAnswers[answerIndex] = {
        soal_num: currentSoal.extra.soal_num,
        ragu: true,
        text: ""
      };
      setAnswers(newAnswers);

      const params = {
        user_id: user.id,
        soal_id: currentSoal.id,
        exam_id: exam.exam_data.id,
        rancangan_id: exam.exam_data.rancangan.id,
        answer_code: "",
        answer_text: ""
      };

      doSilentPost("exam/answer", params);
    }
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const essayChange = e => {
    setTmpAnswer(e.target.value);
  };

  const answeringEssay = () => {
    if (ui.active_page.access && ui.active_page.access.includes("E")) {
      if (tmpAnswer.trim() !== "") {
        const answerIndex = answers.findIndex(
          answer => answer.soal_num === currentSoal.extra.soal_num
        );
        let newAnswers = [...answers];
        newAnswers[answerIndex] = {
          soal_num: currentSoal.extra.soal_num,
          text: tmpAnswer,
          answered: true
        };
        setAnswers(newAnswers);

        const params = {
          user_id: user.id,
          soal_id: currentSoal.id,
          exam_id: exam.exam_data.id,
          rancangan_id: exam.exam_data.rancangan.id,
          answer_code: "",
          answer_text: tmpAnswer
        };

        doSilentPost("exam/answer", params);
      }
    }
  };

  return (
    <Grid container direction="column" alignItems="stretch" className={c.root}>
      <Grid container alignItems="center" className={c.header} wrap="nowrap">
        <Grid container spacing={2} alignItems="center">
          <Grid item>Nomor Soal</Grid>
          <Grid
            item
            container
            justify="center"
            alignItems="center"
            className={c.noSoal}
          >
            {currentSoal !== null && currentSoal.extra.soal_num}
          </Grid>
        </Grid>

        <Grid item xs={3} justify="center" spacing={1} container wrap="nowrap">
          <Grid
            container
            justify="center"
            alignItems="center"
            className={c.timerWrapper}
          >
            <Typography variant="h4">
              {timeMinute < 10 ? "0" + timeMinute : timeMinute}:
              {timeSecond < 10 ? "0" + timeSecond : timeSecond}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid container justify="space-between" className={c.content}>
        <Grid
          container
          item
          xs={8}
          direction="column"
          justify="space-between"
          className={c.soalWrapper}
        >
          <Grid container className={c.soalContent}>
            <Conditional
              condition={currentSoal !== null && currentSoal.content_type === 1}
            >
              {currentSoal !== null && currentSoal.content}
            </Conditional>
            <Conditional
              condition={currentSoal !== null && currentSoal.content_type === 2}
            >
              <p>{currentSoal !== null && currentSoal.content}</p>
            </Conditional>
            <Conditional
              condition={currentSoal !== null && currentSoal.content_type === 3}
            >
              <MathDisplay
                value={currentSoal !== null && currentSoal.content}
              />
            </Conditional>

            <Conditional
              condition={currentSoal !== null && currentSoal.content_type === 5}
            >
              <ReactAudioPlayer controlsList="nodownload" style={{flex:'1'}} src={currentSoal !== null && currentSoal.content} controls />              
            </Conditional>
          </Grid>

          <Grid container className={c.soalOptionWrapper}>
            <Conditional
              condition={
                currentSoal !== null && currentSoal.answer_type === "M"
              }
            >
              {currentSoal !== null &&
                currentSoal.options.map(option => (
                  <Grid
                    key={option.code}
                    alignItems="center"
                    spacing={2}
                    container
                    className={clsx(
                      c.soalOption,
                      option.code ===
                        answers.filter(
                          ans => ans.soal_num === currentSoal.extra.soal_num
                        )[0].code && c.choosenOption
                    )}
                    onClick={() => answering(option)}
                  >
                    <Grid
                      item
                      container
                      justify="center"
                      alignItems="center"
                      className={clsx(
                        c.optionCode,
                        option.code ===
                          answers.filter(
                            ans => ans.soal_num === currentSoal.extra.soal_num
                          )[0].code && c.choosenOptionCode
                      )}
                      onClick={() => answering(option)}
                    >
                      {option.code}
                    </Grid>
                    <Grid item>
                      <Conditional condition={option.content_type === 1}>
                        {option.content}
                      </Conditional>
                      <Conditional condition={option.content_type === 3}>
                        <MathDisplay value={option.content} />
                      </Conditional>
                      <Conditional condition={option.content_type === 4}>                      
                        <img className={c.imageOption} src={option.content}/>
                    </Conditional>
                    </Grid>
                  </Grid>
                ))}
            </Conditional>
            <Conditional
              condition={
                currentSoal !== null && currentSoal.answer_type === "E"
              }
            >
              <Grid container wrap="nowrap" alignItems="center">
                <TextField
                  id="answerTextArea"
                  label="Essay Answer"
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows="7"
                  fullWidth
                  onChange={essayChange}
                  value={tmpAnswer}
                />
                <IconButton
                  aria-label="set-answer"
                  className={common.margin}
                  onClick={answeringEssay}
                >
                  <Done fontSize="large" />
                </IconButton>
              </Grid>
            </Conditional>
          </Grid>
        </Grid>

        <Grid item xs={3} container alignItems="flex-end" direction="column">
          <Grid
            item
            xs={10}
            container
            alignContent="flex-start"
            className={c.answerWrapper}
          >
            {currentSoal !== null &&
              answers.map(answer => (
                <Grid
                  key={answer.soal_num}
                  container
                  justify="center"
                  alignItems="center"
                  className={clsx(
                    c.answer,
                    answer.answered && c.answered,
                    answer.ragu && c.ragu,
                    answer.soal_num === currentSoal.extra.soal_num &&
                      c.selectedAnswerList
                  )}
                  onClick={() => answerListClick(answer)}
                >
                  {answer.soal_num}
                  <Badge
                    className={c.answerBadge}
                    overlap="circle"
                    badgeContent={answer.code}
                    color="primary"
                  >
                    <span />
                  </Badge>
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Grid>

      <Grid container className={c.footer} justify="space-between">
        <Grid item xs={8} container justify="space-around" alignItems="center">
          <Button
            variant="contained"
            color="primary"
            className={c.button}
            onClick={prev}
          >
            {"<-"} sebelumnya
          </Button>

          <Button variant="contained" className={c.ragu} onClick={ragu}>
            ragu - ragu
          </Button>

          <Button
            variant="contained"
            color="primary"
            className={c.button}
            onClick={next}
          >
            selanjutnya ->
          </Button>
        </Grid>

        <Grid item xs={3} container justify="center" alignItems="center">
          <Button
            variant="contained"
            color="primary"
            className={c.button}
            onClick={finish}
          >
            selesai
          </Button>
        </Grid>
      </Grid>
      <Modal
        aria-labelledby="confirmation"
        aria-describedby="confirmation"
        open={openModal}
        onClose={closeModal}
      >
        <Grid
          container
          justify="center"
          alignItems="center"
          className={c.modalRoot}
        >
          <Grid container justify="center" alignItems="center">
            <Paper>
              <Grid justify="center" container className={common.padding}>
                <Typography variant="h5">
                  Are you sure you want to finish, your exam is not complete ?
                </Typography>
              </Grid>
              <Grid justify="space-around" container className={common.padding}>
                <Button onClick={ForcedFinish}>Finish</Button>
                <Button
                  onClick={closeModal}
                  variant="contained"
                  color="primary"
                >
                  Cancel
                </Button>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Modal>
    </Grid>
  );
};

export default withRouter(ExamPage);
