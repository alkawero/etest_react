import React, { useState } from "react";
import clsx from "clsx";
import useStyles from "./resultStyle";
import { useCommonStyles,selectCustomSize } from "themes/commonStyle";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import PlayArrow from "@material-ui/icons/PlayArrow";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "components/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Select from "react-select";

const ResultKelasPage = props => {
  const classes = useStyles();
  const common = useCommonStyles();
  const [filterClass, setFilterClass] = useState(null);
  const filterClassChange = e => {
    setFilterClass(e);
    if(e!==null)
    props.onGo(e);
  };

  const getData = event => {
    props.onGo(filterClass);
  };
  
  return (
    <Grid container alignContent="flex-start">
      <Grid
        container
        alignItems="center"
        className={classes.filterContainer}
        spacing={2}
      >
        <Grid item>
          <Select
            value={filterClass}
            onChange={filterClassChange}
            name="Class"
            options={props.filterOptions}
            styles={selectCustomSize}
            isClearable={true}
            placeholder={"select Class..."}
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
                Nomer Induk
              </TableCell>
              <TableCell>Nama</TableCell>
              <TableCell>Dijawab</TableCell>
              <TableCell>Benar</TableCell>
              <TableCell className={common.borderTopRightRadius}>
                Salah
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              props.data.map(row=>(
                <TableRow key={row.nis}className={classes.tableRow}>
              <TableCell>{row.nis}</TableCell>
              <TableCell>
                {row.nama}
              </TableCell>
              <TableCell>{row.answered_count}</TableCell>
              <TableCell>{row.right_answer_count}</TableCell>
              <TableCell>{row.wrong_answer_count}</TableCell>
            </TableRow>
              ))
            }
            
          </TableBody>
          <TableHead>
            <TableRow className={clsx(common.table_header)}>
              <TableCell className={common.borderBottomLeftRadius}>
                Nomor Induk
              </TableCell>
              <TableCell>Nama</TableCell>
              <TableCell>Dijawab</TableCell>
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

export default ResultKelasPage;
