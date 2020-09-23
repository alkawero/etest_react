/*
author alka@2019
*/
import { applyMiddleware,createStore } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import appReducer from "./reducers";
import createSagaMiddleware from 'redux-saga';
import {rootSaga} from './saga'

const sagaMiddleware  = createSagaMiddleware();

const store = createStore(appReducer, 
    composeWithDevTools( applyMiddleware(sagaMiddleware)));

sagaMiddleware.run(rootSaga)    
export default store;