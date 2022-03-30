import {useDispatch} from 'react-redux'
import {login, logout} from '../redux/action'

import { Authenticator, Button } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useState } from 'react';

// TODO: use react redux to save user log in state and use in other places
const App = () => {
    var [checkStatus, setStatus] = useState(true);
    const dispatch = useDispatch();
    return (
        <Authenticator>
            {({ signOut, user }) => (
                <div style={styles.container}>
                    {
                        checkStatus ? 
                            <h1>Are you {user.username} ?</h1>
                            :   
                            <h1>Hello {user.username}</h1> 
                    }
                    {
                        checkStatus ?
                            <div style={{flexDirection: 'row'}}>
                                <button style={{
                                    flex:"left", 
                                    width:"50%", 
                                    backgroundColor: 'black', 
                                    color: 'white', 
                                    fontSize: "20px"
                                    }}
                                    onClick={
                                        ()=>{
                                            setStatus(!checkStatus)
                                            dispatch(login(user))
                                        }
                                    }
                                >Yes</button>
                                <button style={{
                                    flex:"left", 
                                    width:"50%", 
                                    backgroundColor: 'red', 
                                    color: 'white', 
                                    fontSize: "20px"}}
                                    onClick={
                                        ()=>{
                                            setStatus(!checkStatus)
                                            dispatch(logout())
                                            signOut()
                                        }
                                    }
                                >No</button>
                            </div>
                            : 
                            <button style={styles.button} onClick={
                                () => {
                                    dispatch(logout())
                                    signOut()
                                    window.location.reload()
                                    }}
                            >
                                Sign out
                            </button>
                    }
                    
                    <br />
                </div>
            )}
        </Authenticator>
  );
}

const styles = {
    container: { width: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 },
    todo: {  marginBottom: 15 },
    input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
    todoName: { fontSize: 20, fontWeight: 'bold' },
    todoDescription: { marginBottom: 0 },
    button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
  }

export default App
