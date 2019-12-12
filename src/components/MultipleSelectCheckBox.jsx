import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Grid from "@material-ui/core/Grid";
import PopUp from "./PopUp";
import Tooltip from "@material-ui/core/Tooltip";
import Conditional from "./Conditional";
import { Checkbox, Button } from "@material-ui/core";

const MultipleSelectCheckBox = ({
  options,
  onChange,
  placeholder,
  value,
  readOnly = false,
  extraAction,
  extraCommand
}) => {
  //data should be [{id:1, value:'', description:'',meta:''}]
  const classes = useStyles();
  const [optionAnchor, setOptionAnchor] = useState(null);
  const [availableData, setAvailableData] = useState(options);

  useEffect(() => {
    const selectedIds = value.map(data => data.id);
    setAvailableData(
      options.filter(option => !selectedIds.includes(option.id))
    );
  }, [value, options]);

  

  const onChoose = obj => {
    if (!readOnly) {
      const existed = value.filter(ex => obj.id === ex.id);

      if (existed.length > 0) {
        onChange(value.filter(ex => ex.id !== obj.id));
      } else {
        onChange([...value, obj]);
      }
    }
  };

  const showOption = event => {
    setOptionAnchor(optionAnchor ? null : event.currentTarget);
  };

  const optionsOrSelected = value.length > 0 && readOnly ? value : options;

  return (
    <>
      <Grid
        onClick={e => showOption(e)}
        container
        alignItems="center"
        wrap="nowrap"
        className={classes.root}
      >
        <span>{`${value.length} ${placeholder} selected `}</span>
      </Grid>
      <PopUp anchor={optionAnchor} position={"bottom-end"}>
        <List dense className={classes.listPage}>
          <Conditional condition={availableData.length < 1 && value.length < 1}>
            <ListItem key="noitem">
              <ListItemText primary={`no ${placeholder} available...`} />
            </ListItem>
          </Conditional>
          {optionsOrSelected.map(data => (
            <Tooltip key={data.id} title={data.description}>
              <ListItem
                button
                className={classes.listItem}
                onClick={() => onChoose(data)}
              >
                <ListItemText
                  primary={
                    data.description.length < 50
                      ? data.description
                      : data.description.substring(0, 50) + "..."
                  }
                  secondary={data.meta ? data.meta : null}
                />
                <ListItemSecondaryAction>
                  <Checkbox
                    edge="end"
                    onChange={() => onChoose(data)}
                    checked={value.map(s => s.id).includes(data.id)}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </Tooltip>
          ))}

          {extraAction && extraCommand && (
            <Grid container justify="center">
              <Button onClick={extraAction} variant="contained" color="primary">
                {" "}
                {extraCommand}{" "}
              </Button>
            </Grid>
          )}
        </List>
      </PopUp>
    </>
  );
};

export default MultipleSelectCheckBox;

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 150,
    maxWidth: 200,
    height: 38,
    padding: 4,
    borderRadius: 6,
    border: "1px solid #cccccc",
    overflowX: "auto",
    overflowY: "hidden",
    margin: "0 4px"
  },
  listPage: {
    width: "100%",
    maxHeight: 300,
    overflowY: "auto"
  },
  listItem: {
    borderRadius: 6,
    "&:hover": {
      background: "#E5E9F2",
      color: "black"
    }
  },
  chip: {
    margin: "0 2px"
  }
}));
