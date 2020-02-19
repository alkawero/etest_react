import React, {lazy,Suspense} from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider } from '@material-ui/styles';
import defaultTheme from 'themes/default'
import { Provider } from "react-redux";
import store from 'reduxs/store';
import AppSkeleton from 'components/AppSkeleton';

const LoginPage =  lazy(() => import("pages/login/LoginPage"))
const HomePage =  lazy(() => import("pages/home/HomePage"))
const NotFoundPage =  lazy(() => import("pages/error/NotFoundPage"))
const ExamPage =  lazy(() => import("pages/exam/ExamPage"))

const falbackComponent = <AppSkeleton/>

const App = () => {
  
  return (
    <ThemeProvider theme={defaultTheme}>
    <Provider store={store}>      
      <Router>  
        <Suspense fallback={falbackComponent}>               
          <Switch>      
            <Route exact path="/" component={HomePage} />
            <Route path="/home" component={HomePage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/exam" component={ExamPage} />
            <Route component={NotFoundPage} />
          </Switch> 
        </Suspense>                     
      </Router>      
    </Provider>
    </ThemeProvider>
  );
}

export default App;
