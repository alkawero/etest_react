import React,{useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import FormControl  from "@material-ui/core/FormControl";

const Notes = ({ disabled,open, onClose, notesData, notesType,notesTypeChange, notesTypeOption,onSubmit }) => {
  const classes = useStyles();
  const [notes, setNotes] = useState("");
  const notesChange = e => {
    setNotes(e.target.value);
  };

  const submit=()=>{
    onSubmit(notes)
    setNotes("");
  }

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Notes</DialogTitle>
      <DialogContent>
        <Grid container className={classes.chatList}>
          <List className={classes.root}>
            {notesData.map(note => (
              <>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={`${note.from_name} - ${note.type.value}`}
                    secondary={note.text}
                  />
                </ListItem>
                <Divider component="li" />
              </>
            ))}
          </List>
        </Grid>
        <TextField
          autoFocus
          variant="outlined"
          margin="dense"
          id="notes"
          placeholder="type..."
          fullWidth
          multiline
          rows="3"
          value={notes}
          onChange={notesChange}
        />
      </DialogContent>
      <DialogActions>
      <FormControl className={classes.formControl} disabled={disabled}>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={notesType}
          onChange={notesTypeChange}
        >
          {
              notesTypeOption.map(type=>(
            <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
          ))  
          }
        </Select>
        </FormControl>  
        <Button onClick={onClose}>Cancel</Button>

        <Button onClick={submit} color="primary" variant="contained">
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Notes;

const useStyles = makeStyles(theme => ({
  chatList: {
    maxHeight: "50vh",
    overflowY: "auto"
  }
}));
