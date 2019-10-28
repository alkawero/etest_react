import React, { useState, useCallback } from "react";
import Button from "@material-ui/core/Button";
import useStyles from "./soalStyle";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Conditional from "components/Conditional";
import MathInput from "components/MathInput";
import MathDisplay from "components/MathDisplay";
import TextField from "@material-ui/core/TextField";
import { useDropzone } from "react-dropzone";
import { doUpload} from "apis/api-service";

const answerContentTypes = [
  { id: 1, value: "plain text", code: 1 },
  { id: 3, value: "equation", code: 3 },
  { id: 4, value: "image", code: 4 }
];

const AnswerForm = ({ save, cancel, formulas }) => {
  const classes = useStyles();
  const [contentType, setContentType] = useState(1);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [plainContent, setPlainContent] = useState("");
  const [mathContent, setMathContent] = useState("");
  const [file, setFile] = useState(null);
  const [filePath, setFilePath] = useState("");

  const contentTypeChange = e => {
    setContentType(e.target.value);
  };

  const codeChange = e => {
    if (e.target.value.trim() !== "" && e.target.value.length === 1)
      setCode(e.target.value.toUpperCase());
    else {
      setCode("");
    }
  };

  const onDrop = useCallback(files => {
    setFile(files[0]);
    let reader = new FileReader();

    reader.onloadend = () => {
      setFilePath(reader.result);
    };

    reader.readAsDataURL(files[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const submit = async () => {
    let error  = '';
    let content = null;
    let url = ''
    switch (contentType) {
      case 1:
        content = plainContent;
        break;
      case 3:
        content = mathContent;
        break;
      case 4:
        content = file;
        break;
      default:
        break;
    }

    if (contentType!==4) {
        if(code.trim() == "" || content.trim() == ""){
            error = "please complete the form"
        }      
    }else{
        if(code.trim() == ""){
            error = "please complete the form"
        }else{
            let formData = new FormData();
            formData.append('file', file);
            url = await doUpload('option/image',formData)
            content = url.data.link
        }
    } 

    if(error !== ""){
        setError(error);
    }else{
        if (
            save({ code: code, content: content, contentType: contentType }) === false
          ) {
            setError("answer code or content already exist");
          } else {
            setError("");
          }
    }
  };
  return (
    <Grid container direction="column" className={classes.answerFormContainer}>
      <Grid container className={classes.padding}>
        <Select
          value={contentType}
          onChange={contentTypeChange}
          displayEmpty
          name="contentType"
          className={classes.fullWidth}
          autoWidth={true}
          variant="outlined"
        >
          {answerContentTypes.map(type => (
            <MenuItem key={type.id} value={type.code}>
              {type.value}
            </MenuItem>
          ))}
        </Select>
      </Grid>

      <Grid container className={classes.padding}>
        <TextField
          id="code"
          value={code}
          margin="normal"
          onChange={codeChange}
          fullWidth
          maxLength="1"
          variant="outlined"
          placeholder="code"
        />
      </Grid>

      <Grid container className={classes.padding}>
        <Conditional condition={contentType === 1}>
          <TextField
            id="mathInput"
            value={plainContent}
            multiline
            margin="normal"
            onChange={e => setPlainContent(e.target.value)}
            fullWidth
            variant="outlined"
            placeholder="text content"
          />
        </Conditional>
        <Conditional condition={contentType === 3}>
          <MathInput
            value={mathContent}
            type="asciimath"
            action={setMathContent}
            formulas={formulas}
          />
          <MathDisplay value={mathContent} />
        </Conditional>
        <Conditional condition={contentType === 4}>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag 'n' drop some files here, or click to select files</p>
            )}
          </div>
          <Conditional condition={file !== null}>
            <img src={filePath} />
          </Conditional>
        </Conditional>
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
        <Conditional condition={error !== ""}>
          <span style={{ color: "red" }}>{error}</span>
        </Conditional>
        <Button onClick={submit} color="primary" variant="contained">
          Save
        </Button>
      </Grid>
    </Grid>
  );
};

export default AnswerForm;
