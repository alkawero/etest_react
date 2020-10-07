import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import useStyles from "./reviewerStyle";
import Button from "@material-ui/core/Button";
import { doGet } from "apis/api-service";
import SearchListAsync from "components/SearchListAsync";
import Conditional from "components/Conditional";
import { Typography, IconButton } from "@material-ui/core";
import Close from "@material-ui/icons/Close";
import Select from "react-select";
import { selectCustomZindex } from "themes/commonStyle";

const ReviewerForm = ({ action, reviewer, create, update, onClose }) => {
  const classes = useStyles();
  const [userParam, setUserParam] = useState(null);  
  const [subject, setSubject] = useState(null);
  const user = useSelector(state => state.user);
  
  const [dataJenjang, setDataJenjang] = useState([]);
  const [jenjang, setJenjang] = useState(null);
  
  const getHeaders = ()=> {
    return {"Authorization": user.token}    
  }

  useEffect(() => {
    getDataSubject()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jenjang]);

  const jenjangChange = e => {
    if (action === "edit" || action === "create") 
    {
        setJenjang(e);
    }    
  };
  const getDataJenjang = async () => {
    const params = { group: "jenjang" };
    
    const response = await doGet("param", params, getHeaders());
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
        
        const response = await doGet("mapel", params, getHeaders());
        setDataSubject(
        response.data.map(data => ({ label: data.name, value: data.id }))
        );
    }
  };

  useEffect(() => {
    if (reviewer) {
      setUserParam({ id: reviewer.reviewer_id, text: reviewer.reviewer_name });
      setSubject({ label: reviewer.subject_name, value: reviewer.subject.id });
      setJenjang({ label: reviewer.jenjang, value: reviewer.jenjang });
    }
  }, [reviewer]);

  useEffect(() => {
    getDataJenjang();
  }, []);

  const clear = () => {
    setUserParam(null);
    setSubject(null);
    setJenjang(null);
  }; 
  

  const submit = () => {
    if (reviewer) {
      const newReviewer = {
        ...reviewer,
        user_id: userParam.id,
        subject_id: subject.value,
        jenjang: jenjang.value
      };
      update(newReviewer);
      clear();
    } else {
      const reviewer = {
        user_id: userParam.id,
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

        <Conditional condition={userParam === null}>
          <SearchListAsync user={user} path="user" action={setUserParam} placeholder="search user..."/>
        </Conditional>
        <Conditional condition={userParam !== null}>
          <Grid item xs={8}>
            <Typography>{userParam !== null && userParam.text}</Typography>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              aria-label="settings"
              className={classes.iconButton}
              onClick={() => setUserParam(null)}
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
