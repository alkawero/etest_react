/*
author alka@2019
*/
import React, { useState } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { setActivePage } from "reduxs/actions";
import { useLocalStorage } from "react-use";
import { useDispatch, useSelector } from "react-redux";
import { login, setUserLogin } from "reduxs/actions";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { isLogged } from "utils/Auths";
import Conditional from "components/Conditional";

const LoginPage = props => {
  const dispatch = useDispatch();
  const ui = useSelector(state => state.ui);
  const user = useSelector(state => state.user);  
  const classes = useStyles();
  const [role, setRole] = useState("officer");
  const [userName, setUserName] = useState("8817030001");
  const [password, setPassword] = useState("password");
  const [errors, setErrors] = useState({ uName: false, psw: false });
  const [pahoaUserPersist, setPahoaUserPersist] = useLocalStorage(
    "pahoaUserPersist",
    null
  );

  if (pahoaUserPersist !== null && user === null) {
    dispatch(setUserLogin(pahoaUserPersist));
  }

  if (user !== null && pahoaUserPersist === null) {
    setPahoaUserPersist(user);
  }

  const doLogin = e => {
    e.preventDefault();
    let unameError = false;
    let pswError = false;

    if (userName.trim() === "") {
      unameError = true;
    }

    if (password.trim() === "") {
      pswError = true;
    }
 
    if (unameError === false && pswError === false) {
      dispatch(login({ username: userName, password: password, role:role }));
    } else {
      setErrors({ uName: unameError, psw: pswError });
    }
  };

  const roleChange = (event, newRole) => {
    setRole(newRole);
  };
  const userNameChange = e => {
    setUserName(e.target.value);
  };

  const passwordChange = e => {
    setPassword(e.target.value);
  };

  if (isLogged(user)) {
    const activePage = user.pages.filter(page => {
      return page.path === "/";
    })[0];

    if (!ui.active_page) {
      dispatch(setActivePage(activePage));
    }

    return <Redirect to={{ pathname: "/" }} />;
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon color="primary" />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="User Name"
              name="username"
              autoComplete="username"
              autoFocus
              value={userName}
              onChange={userNameChange}
              error={errors.uName === true}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={passwordChange}
              error={errors.psw === true}
            />

            <ToggleButtonGroup
              value={role}
              exclusive
              onChange={roleChange}
              className={classes.toggleGroup}
            >
              <ToggleButton
                value="student"
                style={{ borderRadius: "5px 0 0 5px" }}
              >
                student
              </ToggleButton>
              <ToggleButton
                value="officer"
                style={{ borderRadius: "0 5px 5px 0" }}
              >
                officer
              </ToggleButton>
            </ToggleButtonGroup>

            <Conditional condition={ui.error !== ""}>
              <Typography component="h1" variant="h5" style={{ color: "red" }}>
                *{ui.error}
              </Typography>
            </Conditional>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={doLogin}
            >
              Login
            </Button>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};

export default withRouter(LoginPage);

const useStyles = makeStyles(theme => ({
  root: {
    height: "100vh"
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  toggleGroup: {
    marginTop: theme.spacing(2)
  }
}));
