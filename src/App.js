import React, { useEffect, useState } from 'react'
import Amplify, { API, graphqlOperation } from 'aws-amplify'

import {
  Routes,
  Route,
} from "react-router-dom";
import '@aws-amplify/ui-react/styles.css';
import { Provider } from 'react-redux'
import {createStore} from 'redux'

import AmplifyTodo from './routes/amplifyTodo'
import LambdaTodo from './routes/lambdaTodo'
import IndexPage from './routes/IndexPage';
import Apartment from './routes/apartment';
import Statistics from './routes/statistics';

import allReducers from './redux/reducer';

import Headers from './common/header'

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const store = createStore(allReducers)

const App = () => {

  return (
    <Provider store={store}>
      <div
          style={{ width: "400", margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: "20" }}>

        <Headers/>

        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="amplify" element={<AmplifyTodo />} />
          <Route path="lambda" element={<LambdaTodo />} />
          <Route path="apartment/*" element={<Apartment />} />
        </Routes>

      </div>
    </Provider>
  );
}

export default App