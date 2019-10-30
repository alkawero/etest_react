import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import TextField from "@material-ui/core/TextField";
import AddButton from "components/AddButton";
import PopUp from "components/PopUp";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import SubdirectoryArrowLeft from "@material-ui/icons/SubdirectoryArrowLeft";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@material-ui/core";

const MathInput = ({ value, action, formulas }) => {
  const classes = useStyles();
  const [anchor, setAnchor] = useState(null);
  const [mathType, setMathType] = useState("asciimath");
  

  const showEquationButton = event => {
    setAnchor(anchor ? null : event.currentTarget);
  };

  const equationClick = formula => {
    const chars =
      mathType === "asciimath"
        ? `\`${formula.asciimath}\``
        : `$${formula.latex}$`;
    action(value + chars);
  };

  const inputChange = e => {
    action(e.target.value);
  };

  const enterButton = () => {
    const p = " <p>type here</p> ";
    action(value + p);
  };

  const mathTypeChange = event => {
    setMathType(event.target.value);
  };

  return (
    <>
      <Grid container className={classes.root}>
        <Grid item xs={10}>
          <TextField
            id="mathInput"
            value={value}
            multiline
            rows="5"
            className={classes.mathInput}
            margin="normal"
            onChange={inputChange}
            fullWidth
            variant="outlined"
            placeholder="equation content"
          />
        </Grid>
        <Grid item xs={2} container direction="column">
          <Grid container justify="center">
            <AddButton
              action={showEquationButton}
              tooltip="add equation symbol"
            />
          </Grid>
          <Grid container justify="center">
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Format</FormLabel>
              <RadioGroup
                aria-label="format"
                name="format"
                className={classes.answerTypeGroup}
                value={mathType}
                onChange={mathTypeChange}
              >
                <FormControlLabel
                  value="latex"
                  control={<Radio color="primary" />}
                  label="latex"
                />
                <FormControlLabel
                  value="asciimath"
                  control={<Radio color="primary" />}
                  label="asciimath"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
      <PopUp anchor={anchor} position={"left-start"}>
        <Grid container className={classes.equationContainer}>
          <IconButton
            onClick={enterButton}
            className={classes.arrowButton}
            size="medium"
          >
            <SubdirectoryArrowLeft />
          </IconButton>

          {formulas && formulas.map(f => (
            <IconButton
              key={f.id}
              onClick={() => equationClick(f)}
              className={classes.arrowButton}
              size="medium"
            >
              <span dangerouslySetInnerHTML={{__html: f.html_symbol}}/>
            </IconButton>
          ))}
        </Grid>
      </PopUp>
    </>
  );
};

export default MathInput;

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  equationContainer: {
    width: 500
  },
  mathInput: {}
}));
