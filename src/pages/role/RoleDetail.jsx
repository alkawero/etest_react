import React from 'react'
import useStyles from './roleStyle'
import Grid from '@material-ui/core/Grid'; 
import Conditional from 'components/Conditional';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PageMapping from './PageMapping';
import UserMapping from './UserMapping';

const RoleDetail = ({selectedRoleId,refreshUsers,refreshPages,detailTab,setDetailTab}) => {
    const classes = useStyles()
    const handleChange = (event,value)=>{
        setDetailTab(value)
    }
    return (
        <Grid container>
            <Grid item xs={12} className={classes.tabHeader}>
                <Tabs value={detailTab} onChange={handleChange} indicatorColor="primary" >
                    <Tab label="Page Access" />
                    <Tab label="User" />                            
                </Tabs>
            </Grid>            
            <Grid container item xs={12}>
                <Conditional condition={detailTab===0}>
                    <PageMapping selectedRoleId={selectedRoleId} refresh={refreshPages} />
                </Conditional>
                <Conditional condition={detailTab===1}>
                    <UserMapping selectedRoleId={selectedRoleId} refresh={refreshUsers} />
                </Conditional>
            </Grid> 
        </Grid>
    );
}

export default RoleDetail;