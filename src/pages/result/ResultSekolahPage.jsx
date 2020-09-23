import React  from "react";
import clsx from "clsx";
import useStyles from "./resultStyle";
import { useCommonStyles } from "themes/commonStyle";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import PlayArrow from "@material-ui/icons/PlayArrow";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "components/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const ResultSekolahPage = props => {
  const classes = useStyles();
  const common = useCommonStyles();
  const [nis, setNis] = React.useState("");

  const nisChange = e => {
    setNis(e.target.value);
  };

  const getData = event => {
    props.onGo(nis);
  };

  return (
    <Grid container alignContent="flex-start">
      <Grid
        container
        justify="center"
        alignItems="center"
        className={classes.filterContainer}
        spacing={2}
      >
        <Grid item>
          <TextField
            id="nis"
            label="Nomor Induk Peserta..."
            variant="outlined"
            margin="dense"
            value={nis}
            onChange={nisChange}
          />
        </Grid>
        <Grid item>
          <IconButton onClick={getData} size="small">
            <PlayArrow fontSize="default" />
          </IconButton>
        </Grid>
      </Grid>
      <Grid container className={classes.tableContainer}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={clsx(common.table_header)}>
              <TableCell className={common.borderTopLeftRadius}>
                Jumlah Soal
              </TableCell>
              <TableCell>Benar</TableCell>
              <TableCell className={common.borderTopRightRadius}>
                Salah
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              <TableRow className={classes.tableRow}>
                <TableCell>{props.data&&props.data.soal_count}</TableCell>
                <TableCell>{props.data&&props.data.right_answer_count}</TableCell>
                <TableCell>{props.data&&props.data.wrong_answer_count}</TableCell>
              </TableRow>            
          </TableBody>
          <TableHead>
            <TableRow className={clsx(common.table_header)}>
              <TableCell className={common.borderBottomLeftRadius}>
                Jumlah Soal
              </TableCell>
              <TableCell>Benar</TableCell>
              <TableCell className={common.borderBottomRightRadius}>
                Salah
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </Grid>
    </Grid>
  );
};

export default ResultSekolahPage;
