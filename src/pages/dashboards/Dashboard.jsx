import React,{ lazy,Suspense  } from 'react';
import MainComponentLoader from 'components/MainComponentLoader'

const SuperDashboardPage =  lazy(() => import("pages/dashboards/SuperDashboardPage"))
const AdmJenjangDashboardPage = lazy(() => import("pages/dashboards/AdmJenjangDashboardPage"))
const StudentDashboardPage = lazy(() => import("pages/dashboards/StudentDashboardPage"))
const TeacherDashboardPage = lazy(() => import("pages/dashboards/TeacherDashboardPage"))  

const Dashboard = ({role_code}) => {
    return (
        <Suspense fallback={<MainComponentLoader/>}>            
                {role_code === 'adm' && <AdmJenjangDashboardPage/>}
                {role_code === 'std' && <StudentDashboardPage/>}
                {role_code === 'tcr' && <TeacherDashboardPage/>}
                {role_code === 'super' && <SuperDashboardPage/>}
                {role_code === 'kps' && <TeacherDashboardPage/>}
                {role_code === 'rvw' && <TeacherDashboardPage/>}
                {role_code === 'bp4' && <TeacherDashboardPage/>}            
        </Suspense>
    )         
}

export default Dashboard