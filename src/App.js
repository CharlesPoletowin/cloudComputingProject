import React, { useEffect, useState } from 'react'
import Amplify, { API, graphqlOperation } from 'aws-amplify'

import {
  Routes,
  Route,
} from "react-router-dom";
import '@aws-amplify/ui-react/styles.css';

import AmplifyTodo from './routes/amplifyTodo'
import LambdaTodo from './routes/lambdaTodo'
import IndexPage from './routes/IndexPage';

import Headers from './common/header'

import awsExports from "./aws-exports";
Amplify.configure(awsExports);



const App = () => {
  
  return (
    <div style={{ width: "400", margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: "20" }}>
      <Headers/>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/amplify" element={<AmplifyTodo />} />
        <Route path="/lambda" element={<LambdaTodo />} />
      </Routes>
    </div>
  );
}

export default App