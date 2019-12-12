import React from "react";
import { connect } from "react-redux";
import clsx from "clsx";
import { showSnackbar } from "reduxs/actions";
import useStyles from "./statisticStyle";
import { useCommonStyles } from "themes/commonStyle";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

const StatisticPage = props => {
  const classes = useStyles();
  const common = useCommonStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Grid
        wrap="nowrap"
        container
        justify="center"
        className={classes.header}
      >
          <Grid item xs={10}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
          centered
        >
          <Tab label="Soal" {...a11yProps(0)} />
          <Tab label="Rancangan" {...a11yProps(1)} />
          <Tab label="Nilai" {...a11yProps(2)} />
        </Tabs>
        </Grid>
      </Grid>
      <Grid container justify="center" className={classes.content_wrapper}>
        <Grid container className={classes.content}>
          <Grid
            item
            xs={12}
            container
            className={clsx(classes.table_wrapper, common.borderTopRadius)}
          >
            <TabPanel value={value} index={0}>
              Soal
            </TabPanel>
            <TabPanel value={value} index={1}>
              Rancangan
            </TabPanel>
            <TabPanel value={value} index={2}>
              Nilai
            </TabPanel>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

const mapStateToProps = state => {
  return {
    user: state.user,
    ui: state.ui
  };
};
const mapDispatchToProps = dispatch => {
  return {
    showSnackbar: (v, t) => dispatch(showSnackbar(v, t))
  };
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (    
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box p={3}>{children}</Box>}
      </Typography>    
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StatisticPage);
