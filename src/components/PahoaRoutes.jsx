import React,{lazy,Suspense} from 'react';
import { RouteSwitch } from "react-router-dom";
import MainComponentLoader from 'components/MainComponentLoader';

const ListButirSoalPage =  lazy(() => import('pages/butir-soal/ListButirSoalPage'))
const Page =  lazy(() => import('pages/page/Page'))
const getComponent = (path)=>{
    switch(display){
      case '/home':
          return    
      case '/home/butir-soal':
          return <ListButirSoalPage/>   
      case '/home/page':
          return <Page/>      
      case 'role':
          return <Page/>  
    }              
    
}  


const PahoaRoutes = (props)=>{
    const pages = props.user.pages
    return(
        pages.map((page)=>(
            <Suspense fallback={<MainComponentLoader/>}>
                <Switch>
                    <Route exact path="" component={<DashboardPage/>} />   
                    <Route path="" component={} />
                    <Route path="" component={} />
                </Switch>             
            </Suspense>
        ))
        
    )
}

export default PahoaRoutes