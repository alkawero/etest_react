import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import useStyles from "./reviewerStyle";
import Button from "@material-ui/core/Button";
import { doGet, doPost, doDelete, doPut, doPatch } from "apis/api-service";
import SearchListAsync from "components/SearchListAsync";
import Conditional from "components/Conditional";
import { Typography, IconButton } from "@material-ui/core";
import Close from "@material-ui/icons/Close";
import Select from "react-select";
import { selectCustomZindex } from "themes/commonStyle";

const ReviewerForm = ({ action, reviewer, create, update, onClose }) => {
  const classes = useStyles();
  const [user, setUser] = useState(null);
  const [popUpAnchor, setPopUpAnchor] = useState(null);
  const [subject, setSubject] = useState(null);

  const [dataJenjang, setDataJenjang] = useState([]);
  const [jenjang, setJenjang] = useState(null);
  useEffect(() => {
    getDataSubject()
  }, [jenjang]);

  const jenjangChange = e => {
    if (action === "edit" || action === "create") 
    {
        setJenjang(e);
    }    
  };
  const getDataJenjang = async () => {
    const params = { group: "jenjang" };
    const response = await doGet("param", params);
    setDataJenjang(
      response.data.map(j => ({ label: j.value, value: j.char_code }))
    );
  }; //

  const [dataSubject, setDataSubject] = useState([]);
  const subjectChange = e => {
    if (action === "edit" || action === "create") setSubject(e);
  };
  const getDataSubject = async () => {
    if(jenjang!==null){
        const params = { jenjang: jenjang.value };
        const response = await doGet("mapel", params);
        setDataSubject(
        response.data.map(data => ({ label: data.name, value: data.id }))
        );
    }
  };

  useEffect(() => {
    if (reviewer) {
      setUser({ id: reviewer.reviewer_id, text: reviewer.reviewer_name });
      setSubject({ label: reviewer.subject_name, value: reviewer.subject.id });
      setJenjang({ label: reviewer.jenjang, value: reviewer.jenjang });
    }
  }, [reviewer]);

  useEffect(() => {
    getDataJenjang();
  }, []);

  const clear = () => {
    setUser(null);
    setSubject(null);
    setJenjang(null);
  }; 
  

  const submit = () => {
    if (reviewer) {
      const newReviewer = {
        ...reviewer,
        user_id: user.id,
        subject_id: subject.value,
        jenjang: jenjang.value
      };
      update(newReviewer);
      clear();
    } else {
      const reviewer = {
        user_id: user.id,
        subject_id: subject.value,
        jenjang: jenjang.value
      };
      create(reviewer);
      clear();
    }

    onClose();
  };
  const cancel = () => {
    clear();
    onClose();
  };

  return (
    <Grid container justify="center" className={classes.addContent}>
      <Grid item xs={12} container wrap="nowrap" alignItems="center">
        <Grid item xs={3}>
          <Typography>reviewer :</Typography>
        </Grid>

        <Conditional condition={user === null}>
          <SearchListAsync path="user" action={setUser} />
        </Conditional>
        <Conditional condition={user !== null}>
          <Grid item xs={8}>
            <Typography>{user !== null && user.text}</Typography>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              aria-label="settings"
              className={classes.iconButton}
              onClick={() => setUser(null)}
            >
              <Close color="primary" />
            </IconButton>
          </Grid>
        </Conditional>
      </Grid>

      <Grid item xs={12} container wrap="nowrap" alignItems="center">
        <Grid item xs={3}>
          <Typography>Jenjang :</Typography>
        </Grid>
        <Select
          value={jenjang}
          onChange={jenjangChange}
          name="jenjang"
          options={dataJenjang}
          placeholder="select jenjang"
          styles={selectCustomZindex}
        />
      </Grid>

      <Grid item xs={12} container wrap="nowrap" alignItems="center">
        <Grid item xs={3}>
          <Typography>Subject :</Typography>
        </Grid>
        <Select
          value={subject}
          onChange={subjectChange}
          name="subject"
          options={dataSubject}
          placeholder="select subject"
          styles={selectCustomZindex}
        />
      </Grid>
      <Grid
        item
        container
        justify="space-between"
        className={classes.addAction}
      >
        <Button variant="outlined" onClick={cancel}>
          cancel
        </Button>
        <Conditional condition={action!=='detail'}>
        <Button onClick={submit} color="primary" variant="contained">
          Save
        </Button>
        </Conditional>
      </Grid>
    </Grid>
  );
};

export default ReviewerForm;
