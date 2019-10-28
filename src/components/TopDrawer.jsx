import React from "react";
import Drawer from "@material-ui/core/Drawer";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";

const TopDrawer = props => {
  const ui = useSelector(state => state.ui);
  const isLoading = ui.loading;
  const classes = useStyles({isLoading});
  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="top"
      open={props.open}
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <Grid container justify="center" className={classes.drawerContainer}>
        <Grid container className={classes.header}>
          <Grid item xs={5}>
              <Typography variant="h6">{props.tittle}</Typography>              
          </Grid>
          <Grid item xs={2}>
          <LinearProgress className={classes.loading} />            
          </Grid>
          <Grid item xs={5} container>
            <IconButton
              onClick={props.close}
              className={classes.arrowButton}
              size="medium"
            >
              <ArrowUpward fontSize="inherit" />
            </IconButton>
          </Grid>
        </Grid>
        {props.children !== null &&
          React.cloneElement(props.children, { open: props.open })}
      </Grid>
    </Drawer>
  );
};

export default TopDrawer;

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    display: "flex",
    justifyContent: "center",
    background: "white",
    flexDirection: "row",
    //opacity: '0.1'
    overflowX: "hidden"
  },
  drawerContainer: {
    borderRadius: "0px 0px 10px 10px",
    border: "1px solid #1269dc",
    minWidth: 300,
    height: "fit-content"
  },
  header: {
    height: 68,
    backgroundColor: "#1269dc",
    color: "white",
    padding: 12
  },
  arrowButton: {
    color: "white",
    margin: "0 0 auto auto"
  },
  loading: {
    marginTop:8,
    display: ({ isLoading }) => {
      const display = isLoading ? "block" : "none";
      return display;
    }
  },
  loadings: {
    marginTop:8,  
    display: ({ isLoading }) => {
      const display = "block";
      return display;
    }
  }
}));
