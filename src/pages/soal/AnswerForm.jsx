import React, { useState, useCallback } from "react";
import Button from "@material-ui/core/Button";
import useStyles from "./soalStyle";
import Grid from "@material-ui/core/Grid";
import Select from "react-select";
import Conditional from "components/Conditional";
import MathInput from "components/MathInput";
import MathDisplay from "components/MathDisplay";
import TextField from "@material-ui/core/TextField";
import { useDropzone } from "react-dropzone";
import { doUpload } from "apis/api-service";
import Typography from "@material-ui/core/Typography";
import { selectCustomZindex } from "themes/commonStyle";
import { Editor } from "react-draft-wysiwyg";
import {
  EditorState
} from "draft-js";
import { stateToHTML } from "draft-js-export-html";

const answerContentTypes = [
  { id: 1, label: "plain text", value: 1 },
  { id: 2, label: "rich text", value: 2 },
  { id: 3, label: "equation", value: 3 },
  { id: 4, label: "image", value: 4 }
];

const AnswerForm = ({ save, cancel, formulas }) => {
  const classes = useStyles();
  const [contentType, setContentType] = useState(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [plainContent, setPlainContent] = useState("");
  const [mathContent, setMathContent] = useState("");
  const [file, setFile] = useState(null);
  const [filePath, setFilePath] = useState("");
  const [contentEditor, setContentEditor] = useState(EditorState.createEmpty());
  
  const contentEditorChange = contentEditor => {    
      setContentEditor(contentEditor);
  };

  const contentTypeChange = e => {
    setContentType(e);
  };

  const codeChange = e => {
    if (e.target.value.trim() !== "" && e.target.value.length === 1)
      setCode(e.target.value.toUpperCase());
    else {
      setCode("");
    }
  };

  const uploadImageCallBack = img => {
    const formData = new FormData();
    formData.append("img", img);
    return doUpload("images/up", formData);
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
    let error = "";
    let content = null;
    let url = "";
    if(contentType!==null){
      switch (contentType.value) {
        case 1:
          content = plainContent;
          break;
        case 2:
            if (contentEditor.getCurrentContent().hasText())
            content = stateToHTML(contentEditor.getCurrentContent())            
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
  
      if (contentType.value !== 4) {
        if (code.trim() == "" || content.trim() == "") {
          error = "please complete the form";
        }
      } else {
        if (code.trim() == "") {
          error = "please complete the form";
        } else {
          let formData = new FormData();
          formData.append("file", file);
          url = await doUpload("option/image", formData);
          content = url.data.link;
        }
      }

      if (error !== "") {
        setError(error);
      } else {
        if (
          save({ code: code, content: content, contentType: contentType.value }) ===
          false
        ) {
          setError("answer code or content already exist");
        } else {
          setError("");
        }
      }
    }
    

    
  };
  return (
    <Grid container direction="column" className={classes.answerFormContainer}>
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
      <Grid
        container
        alignItems="center"        
        className={classes.padding}
      >  

        <Select
                value={contentType}
                onChange={contentTypeChange}
                name="contentType"
                options={answerContentTypes}
                styles={selectCustomZindex}
                isClearable={true}
                placeholder={"select content type..."}
              />          
        
      </Grid>
      <Grid container className={classes.padding}>
        <Conditional condition={contentType!==null && contentType.value === 1}>
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
        <Conditional condition={contentType!==null && contentType.value === 2}>
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
        <Conditional condition={contentType!==null && contentType.value === 3}>
          <MathInput
            value={mathContent}
            type="asciimath"
            action={setMathContent}
            formulas={formulas}
          />
          <MathDisplay value={mathContent} />
        </Conditional>
        <Conditional condition={contentType!==null &&  contentType.value === 4}>
        <Grid
        container
        alignItems="center"        
        justify='center'
        className={classes.padding}
      >
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <Typography variant='h5' style={{cursor:'pointer', borderRadius:4, backgroundColor:'green', color:'white', padding:16}}>Click or Drag 'n' drop file here</Typography>
          </div>
          </Grid>
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
