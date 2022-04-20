import {useDispatch} from 'react-redux'
import {login, logout} from '../redux/action'
import { useEffect } from 'react'

const UserApp = (props) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(login(props.user))
    })

    return (
        <div></div>
    )
}

export default UserApp