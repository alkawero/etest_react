import React from "react";
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
import Button from '@material-ui/core/Button'; 
import DetailResult from "./DetailResult";

const ResultExamPage = props => {
  
  const {data, user, summary, onGo, setOpenTopDrawer, setTopDrawerTittle, setTopDrawerContent, closeTopDrawer, setOpenBottomDrawer, setBottomDrawerTittle, setBottomDrawerContent, closeBottomDrawer} = props
  const classes = useStyles();
  const common = useCommonStyles();
  const [nis, setNis] = React.useState("");
  
  const getData = event => {
    onGo(nis);
  };

  const showDetailResult = (participantId,examId) => {
    setOpenTopDrawer(true)
    setTopDrawerTittle("Detail exam result")
    setTopDrawerContent(<DetailResult 
      user={user} 
      participantId={participantId} 
      examId={examId}
      setOpenTopDrawer={setOpenTopDrawer}
      setTopDrawerTittle={setTopDrawerTittle}
      setTopDrawerContent={setTopDrawerContent}
      closeTopDrawer={closeTopDrawer}
      setOpenBottomDrawer={setOpenBottomDrawer}
      setBottomDrawerTittle ={setBottomDrawerTittle}
      setBottomDrawerContent={setBottomDrawerContent}
      closeBottomDrawer={closeBottomDrawer}
      />)
  };

  return (
    <Grid container alignContent="flex-start">
      <Grid
        container
        justify="flex-end"
        alignItems="center"
        className={classes.filterContainer}
        spacing={2}
      >        
        <Grid item>
        <Button size='small'  onClick={getData} variant="contained" color="secondary" className={classes}>
            Excel
        </Button>
        </Grid>
        <Grid item>
        <Button size='small'  onClick={getData} variant="contained" color="secondary" className={classes}>
            PDF
        </Button>
        </Grid>
      </Grid>
      <Grid container className={classes.tableContainer}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={clsx(common.table_header)}>
              <TableCell className={common.borderTopLeftRadius}>
                No. Urut
              </TableCell>
              <TableCell>Nama Peserta</TableCell>
              <TableCell>No. Induk</TableCell>
              <TableCell>Jumlah Soal</TableCell>
              <TableCell>Jawaban Benar</TableCell>
              <TableCell>Skor</TableCell>
              <TableCell>KKM</TableCell>
              <TableCell className={common.borderTopRightRadius}>
              Kriteria
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>          
            {
              data.map(result=>(
              <TableRow className={classes.tableRow}>
                <TableCell>{result.counter}</TableCell>
                <TableCell onClick={()=>showDetailResult(result.user_id,result.exam_id)} className={common.clickable}>{result.name}</TableCell>
                <TableCell>{result.user_id}</TableCell>                
                <TableCell>{result.soal_count}</TableCell>
                <TableCell>{result.right_answer_count}</TableCell>
                <TableCell>{result.score}</TableCell>                
                <TableCell>{result.kkm}</TableCell>                
                <TableCell>{result.criteria}</TableCell>                
              </TableRow>  
              ))
            }
                        
          </TableBody>
          <TableHead>
            <TableRow className={clsx(common.table_header)}>
              <TableCell className={common.borderBottomLeftRadius}>
              No. Urut
              </TableCell>
              <TableCell>Nama Peserta</TableCell>
              <TableCell>No. Induk</TableCell>
              <TableCell>Jumlah Soal</TableCell>
              <TableCell>Jawaban Benar</TableCell>
              <TableCell>Skor</TableCell>
              <TableCell>KKM</TableCell>
              <TableCell className={common.borderBottomRightRadius}>
              Kriteria
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </Grid>

      <Grid container justify="space-between" style={{padding:8}}>
        <Grid container item xs={4} className={classes.summaryContainer}>
          <Grid container item xs={6} justify="flex-start" alignContent="center">
            Jumlah Tuntas
          </Grid>  
          <Grid container item xs={6} justify="flex-end" alignContent="center">
            {summary.complete}            
          </Grid>
          <Grid container item xs={6} justify="flex-start" alignContent="center">
            Jumlah Tidak Tuntas
          </Grid>  
          <Grid container item xs={6} justify="flex-end" alignContent="center">
            {summary.inComplete}                    
          </Grid>
          <Grid container item xs={6} justify="flex-start" alignContent="center">
            x ≤ 25
          </Grid>  
          <Grid container item xs={6} justify="flex-end" alignContent="center">
            {summary.less25}                  
          </Grid>
          <Grid container item xs={6} justify="flex-start" alignContent="center">
            {"25 < x ≤50"}
          </Grid>  
          <Grid container item xs={6} justify="flex-end" alignContent="center">
            {summary.more25less50}                   
          </Grid>
          <Grid container item xs={6} justify="flex-start" alignContent="center">
            {"50< x ≤75"}
          </Grid>  
          <Grid container item xs={6} justify="flex-end" alignContent="center">
            {summary.more50less75}                 
          </Grid>
          <Grid container item xs={6} justify="flex-start" alignContent="center">
            {"75< x≤100"}
          </Grid>  
          <Grid container item xs={6} justify="flex-end" alignContent="center">
            {summary.more75less100}                   
          </Grid>
        </Grid>

        <Grid container item xs={4} className={classes.summaryContainer}>
        <Grid container item xs={6} justify="flex-start" alignContent="center">
            Rata-rata
          </Grid>  
          <Grid container item xs={6} justify="flex-end" alignContent="center">
            {summary.average}                   
          </Grid>
          <Grid container item xs={6} justify="flex-start" alignContent="center">
            St. Deviasi
          </Grid>  
          <Grid container item xs={6} justify="flex-end" alignContent="center">
            {summary.deviation}               
          </Grid>
          <Grid container item xs={6} justify="flex-start" alignContent="center">
            Nilai Tertinggi
          </Grid>  
          <Grid container item xs={6} justify="flex-end" alignContent="center">
            {summary.highest}               
          </Grid>
          <Grid container item xs={6} justify="flex-start" alignContent="center">
            Nilai Terendah
          </Grid>  
          <Grid container item xs={6} justify="flex-end" alignContent="center">
            {summary.lowest}              
          </Grid>          
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ResultExamPage;
