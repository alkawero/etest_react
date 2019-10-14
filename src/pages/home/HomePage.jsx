/*
author alka@2019
*/
import React,{lazy,Suspense,useState} from 'react';
import { Route,Redirect,Switch } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import {hideSnackbar,setActivePage,logout} from 'reduxs/actions'
import AlkaSnackbar from 'components/AlkaSnackbar'
import Hidden from '@material-ui/core/Hidden';
import Grid  from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import IconButton from '@material-ui/core/IconButton';
import NotificationsIcon from '@material-ui/icons/Notifications';
import DirectionsRun from '@material-ui/icons/DirectionsRun';
import Person from '@material-ui/icons/Person';
import MailIcon from '@material-ui/icons/Mail';
import LinearProgress from '@material-ui/core/LinearProgress';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import LeftNavigation from './LeftNavigation';
import {isLogged} from 'utils/Auths'
import MainComponentLoader from 'components/MainComponentLoader';
import FullMenu from './FullMenu';
import PopUp  from 'components/PopUp';
import Button  from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
 
const Page =  lazy(() => import('pages/page/Page'))
const RolePage =  lazy(() => import('pages/role/RolePage'))
const RancanganPage =  lazy(() => import('pages/rancangan/RancanganPage'))
const SoalPage =  lazy(() => import('pages/soal/SoalPage'))
const ParamPage =  lazy(() => import('pages/parameter/ParamPage'))
const SchedulePage =  lazy(() => import('pages/schedule/SchedulePage'))
const Dashboard =  lazy(() => import('pages/dashboard/Dashboard'))









const HomePage = (props) => {
    const dispatch = useDispatch()
    const ui = useSelector(state => state.ui);
    const user = useSelector(state => state.user);
    const [openFullMenu, setOpenFullMenu] = useState(false)
    const [profileAnchor, setProfileAnchor] = useState(null)
    
    const isLoading = ui.loading
    const classes = useStyles({isLoading})
    
    const closeSnackBar = () => {dispatch(hideSnackbar())}        
    const closeFullMenu = ()=>{setOpenFullMenu(false)}
    const buttonMenuClick = ()=>{setOpenFullMenu(true)}

    const setPage = (page)=>{
        dispatch(setActivePage(page))
    }

    const openProfile=(e)=>{
        setProfileAnchor(profileAnchor ? null: e.currentTarget)        
    }

    const doLogout=()=>{
        localStorage.removeItem('pahoaUserPersist')
        dispatch(logout())
    }

    if(isLogged(user)){
        return(
            <>
            <Grid container spacing={0} className={classes.root} wrap='nowrap'>
                <Hidden smDown>
                    <Grid container item sm={2} className={classes.left} direction='column' wrap='nowrap'>
                        <Grid item container alignItems='center' justify='center'  className={classes.app_name_wrapper}>
                            
                            <Grid item container alignItems='center' justify='center' className={classes.app_name}>                            
                                <Typography variant="subtitle2" className={classes.typography}>
                                    eTEST
                                </Typography>
                            </Grid>
                            
                        </Grid>
                        <Grid className={classes.loadingWraper}>
                            <LinearProgress className={classes.loading}/>
                        </Grid>
                        <Grid container className={classes.left_nav}>
                            <LeftNavigation setPage={setPage} pages={user.pages}/>
                        </Grid>
                        
                    </Grid>
                </Hidden>
                <Grid container item sm={10} alignContent='flex-start' className={classes.right}> 
                    <Grid container className={classes.topBar} justify='flex-end' alignItems='center'>
                        <Hidden mdUp>                                
                            <IconButton onClick={buttonMenuClick} aria-label="menu" className={classes.menuButton} size="medium">
                                <MenuIcon fontSize="inherit"/>
                            </IconButton>                                
                        </Hidden>
                        
                        <Hidden only='xs'>                            
                            <IconButton className={classes.iconButton} size="medium">
                                <MailIcon fontSize="inherit" />
                            </IconButton>
                            <IconButton className={classes.iconButton} size="medium">
                                <NotificationsIcon fontSize="inherit" />
                            </IconButton>
                            <IconButton onClick={openProfile} className={classes.iconButton} size="medium">
                                <Person fontSize="inherit" />
                            </IconButton>
                        </Hidden>                        
                    </Grid>
                    <Grid container className={classes.main}>                        
                        <Suspense fallback={<MainComponentLoader/>}>
                            <Switch>
                                <Route exact path='/' component={Dashboard} />   
                                <Route exact path='/home' component={Dashboard} />   
                                <Route path='/home/pages' component={Page} />
                                <Route path='/home/roles' component={RolePage} />
                                <Route path='/home/soal' component={SoalPage} />
                                <Route path='/home/rancangan' component={RancanganPage} />
                                <Route path='/home/parameters' component={ParamPage} />
                                <Route path='/home/schedule' component={SchedulePage} />                                
                            </Switch>             
                        </Suspense>
                    </Grid>
                     
                </Grid>
            </Grid>                        
            <AlkaSnackbar 
                show={ui.snack_show} 
                variant={ui.snack_var} 
                txt={ui.snack_txt}
                close={closeSnackBar}
            />    
            <FullMenu open={openFullMenu} close={closeFullMenu}>
                <LeftNavigation close={closeFullMenu} setPage={setPage} pages={user.pages}/>
            </FullMenu>   

            <PopUp anchor={profileAnchor} position='bottom-end'>
                <Grid container direction='column' className={classes.profileContainer}>
                    <Grid container className={classes.profileContent}>
                        <Grid container justify='center' >{user.id}</Grid>
                        <Grid container justify='center'>{user.name}</Grid>
                        <Grid container justify='center'>
                        {
                            user.roles.map(role=>(
                                <Chip key={role.id} label={role.code} />
                            ))
                        }
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Button onClick={doLogout} fullWidth variant="contained" color="primary" className={classes.button}>
                            Logout
                            <DirectionsRun/>
                        </Button>
                    </Grid>
                </Grid> 
            </PopUp>
            </>                    
                
            )
    }else{
        return <Redirect to={{ pathname: "/login" }} />
    }
    
}

export default  HomePage

const useStyles = makeStyles(theme => ({    
    root:{
      height:'100vh' ,
    },
    topBar: {
      background: 'linear-gradient(to right, #1269dc, #1269dc, #1269dc, #1269dc, #1269dc)',
      boxShadow: '0 6px 5px -3px rgba(0,0,0,.3)',
      zIndex:1100,
    },
    main:{
      height:'92%' ,
      overflowY:'auto',
      backgroundColor:'rgba(63, 81, 181, 0.05)',
      position:'relative'
    },
    left:{
        background: 'white',
        height:'100%', 
        color:'#8c9497',
        boxShadow: '4px 4px 10px rgba(69,65,78,.06)',
        zIndex:1000   
    },
    left_nav:{
        height:'80%',        
        overflowY:'auto',
        
    },
    right:{
        height:'100%',
                
    },
    iconButton:{
       color:'white'  ,
       padding:8,            
    },
    menuButton:{    
        padding:8,            
        marginLeft:12,
        marginRight:'auto',
        color:'white'
             
    },
    
    app_name_wrapper:{
        height: 86,
        borderBottom: '1px solid #ebecef',
        background:'linear-gradient(to top, #1f0afd, #330bf9, #410df5, #4b10f2, #5412ee);'
    },
    app_name:{
        minHeight: 30,
        color:'white',
        backgroundColor: '#16cd90',        
        boxShadow: '0px 10px 10px 0px rgba(0,0,0,0.5)',
        borderRadius:'6px',
        zIndex:1200, 
        width:100       
    },
    loading:{ 
        display:({isLoading})=>{
            const display = isLoading?'block':'none'; 
            return display; }
    },
    loadingWraper:{
        height:5
    },
    profileContainer:{
        marginTop:8,
        width:200,
        padding:8
    },
    profileContent:{
        height:150
    },
    
    
  }));
