import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

const AppSkeleton = () => {
  const classes = useStyles();
  return (
    <Grid container className={classes.root}>
      <Grid container item xs={2}>
      <Skeleton variant="rect"className={classes.skel1_1} />        
      </Grid>
      <Grid container item xs={10} direction="column">
        <Skeleton variant="rect" className={classes.skel2_1}  />        
      </Grid>
    </Grid>
  );
};

export default AppSkeleton;

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100vh"
  },
  skel1_1:{
    width: "100%",
    height: "100vh"
  },
  skel2_1:{
    width: "100%",
    height:40
  },
  skel2_2:{
    margin:'100px 0 0 30px',
    width: "100%",
    height: "100vh"
  }
});
