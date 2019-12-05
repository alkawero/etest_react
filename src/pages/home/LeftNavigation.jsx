import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import List from "@material-ui/core/List";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/icons/Menu";
import ListIcon from "@material-ui/icons/List";
import Group from "@material-ui/icons/Group";
import BubbleChart from "@material-ui/icons/BubbleChart";
import ViewCarousel from "@material-ui/icons/ViewCarousel";
import Dashboard from "@material-ui/icons/Dashboard";
import InsertDriveFile from "@material-ui/icons/InsertDriveFile";
import SettingsApplications from "@material-ui/icons/SettingsApplications";
import Schedule from "@material-ui/icons/Schedule";
import LocalLibrary from "@material-ui/icons/LocalLibrary";
import Functions from "@material-ui/icons/Functions";
import Drafts from "@material-ui/icons/Drafts";
import ShowChart from "@material-ui/icons/ShowChart";
import { withRouter } from "react-router";

const LeftNavigation = props => {
  const [active, setActive] = useState({ navigation: "" });
  const classes = useStyles();
  const pages = props.pages.filter(p => p.navigation !== "-");
  const getIcon = icon => {
    switch (icon) {
      case "menu":
        return <Menu style={{ color: "#8c9497" }} />;
      case "dashboard":
        return <Dashboard style={{ color: "#8c9497" }} />;
      case "view_carousel":
        return <ViewCarousel style={{ color: "#8c9497" }} />;
      case "group":
        return <Group style={{ color: "#8c9497" }} />;
      case "insert_drive_file":
        return <InsertDriveFile style={{ color: "#8c9497" }} />;
      case "list":
        return <ListIcon style={{ color: "#8c9497" }} />;
      case "settings_applications":
        return <SettingsApplications style={{ color: "#8c9497" }} />;
      case "schedule":
        return <Schedule style={{ color: "#8c9497" }} />;
      case "drafts":
        return <Drafts style={{ color: "#8c9497" }} />;
      case "local_library":
        return <LocalLibrary style={{ color: "#8c9497" }} />;
      case "functions":
        return <Functions style={{ color: "#8c9497" }} />;
      case "show_chart":
        return <ShowChart style={{ color: "#8c9497" }} />;
      default:
        return <BubbleChart style={{ color: "#8c9497" }} />;
    }
  };

  const handleClick = page => {
    setActive(page);
    props.setPage(page);
    props.history.push(page.path);
    if (props.close) {
      props.close();
    }
  };

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      className={classes.root}
    >
      {pages.map(page => (
        <ListItem
          key={page.navigation}
          button
          className={classes.listItem}
          onClick={() => handleClick(page)}
          selected={page.navigation === active.navigation}
        >
          <ListItemIcon className={classes.itemIcon}>
            {getIcon(page.icon)}
          </ListItemIcon>
          <ListItemText
            primary={page.navigation}
            className={classes.itemText}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default withRouter(LeftNavigation);

const useStyles = makeStyles(theme => ({
  root: {
    color: "#8c9497",
    width: "90%" //
  },
  nested: {
    paddingLeft: theme.spacing(4)
  },
  listItem: {
    "&:hover": {
      background: "#E5E9F2",
      color: "black"
    },
    borderRadius: 5,
    margin: 8,
    padding: "0 8px"
  },
  itemIcon: {
    minWidth: 0
  },
  itemText: {
    marginLeft: 8
  }
}));
