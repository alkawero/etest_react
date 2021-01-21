import React,{useState, useEffect} from "react";
import clsx from "clsx";
import { doGet } from "apis/api-service";
import useStyles from "./resultStyle";
import { useCommonStyles } from "themes/commonStyle";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "components/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import SoalForm from "pages/soal/SoalForm"; 

const DetailResult = props => {      
    const {participantId, examId, user, setOpenTopDrawer, setTopDrawerTittle, setTopDrawerContent, closeTopDrawer,setOpenBottomDrawer, setBottomDrawerTittle, setBottomDrawerContent, closeBottomDrawer} = props
    const classes = useStyles();
    const common = useCommonStyles();
    const [detail, setdetail] = useState([]);

    const getHeaders = ()=> {
        return {"Authorization": user.token}    
    }
    
    useEffect(() => {
        console.log(participantId,examId);
        if(participantId && examId){
            getdetail(participantId,examId)
        }
      }, [participantId,examId]);

    
    const getdetail = async(participantId,examId) => {
        let params = {
        participant_id: participantId,
        exam_id:examId
        };      
        
        const response = await doGet("result/exam/detail", params, getHeaders());

        if (response.data) setdetail(response.data);
    };

    const soalDetail = async soalId => {
        const soal = await getSoalById(soalId);
        setBottomDrawerContent(
          <SoalForm user={user} action="detail" soal={soal} onClose={closeTopDrawer} />
        );
        setOpenBottomDrawer(true);
        setBottomDrawerTittle("Soal Detail");
      };

    const getSoalById = async id => {
        const response = await doGet("soal/" + id,{},getHeaders());
        if (!response.error) {
            return response.data;
        }
    };  
    
    return(
        <Grid container className={classes.tableContainer}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={clsx(common.table_header)}>
              <TableCell className={common.borderTopLeftRadius}>
                ID. Soal
              </TableCell>
              <TableCell>Jenis</TableCell>
              <TableCell>Dijawab</TableCell>
              <TableCell>Jawaban Benar</TableCell>
              <TableCell>Bobot</TableCell>
              <TableCell className={common.borderTopRightRadius}>
                Skor
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>          
          {
            detail.map(result=>
                (
                    <TableRow className={classes.tableRow}>
                    <TableCell className={common.clickable} onClick={()=>soalDetail(result.soal_id) } >{result.soal_id}</TableCell>
                    <TableCell>{result.answer_type}</TableCell>
                    <TableCell >{result.answer_code}</TableCell>
                    <TableCell>{result.right_answer}</TableCell>                
                    <TableCell>{result.bobot}</TableCell>
                    <TableCell>{result.score}</TableCell>                                    
                    </TableRow> 
                )
            )
            }
            </TableBody>
          <TableHead>
            <TableRow className={clsx(common.table_header)}>
              <TableCell className={common.borderBottomLeftRadius}>
                ID. Soal
              </TableCell>
              <TableCell>Jenis</TableCell>
              <TableCell>Dijawab</TableCell>
              <TableCell>Jawaban Benar</TableCell>
              <TableCell>Bobot</TableCell>
              <TableCell className={common.borderBottomRightRadius}>
                Skor
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </Grid>        
    )
}

export default DetailResult