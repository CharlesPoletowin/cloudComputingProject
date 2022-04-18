

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import AppBar from './appBar'
import UserStatus from './userStatus'

// use react redux to save user log in state and use in other places
const App = () => {

    return (
        <div>
            <Authenticator>
                {({ signOut, user }) => (
                    <div>
                        <AppBar logout={signOut}/>
                        <UserStatus user={user} />
                    </div>
                )}
            </Authenticator>
        </div>
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
