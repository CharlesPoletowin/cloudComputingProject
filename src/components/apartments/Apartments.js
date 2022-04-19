import React, { useEffect, useState } from 'react';
import './Apartments.css';
import { useSelector } from 'react-redux';
import axios from 'axios';

const api = axios.create({
    baseURL: "https://kgr24rcf4c.execute-api.us-west-2.amazonaws.com/dev"
})


const title = "Apartment Info"

function Apartments() {
    const user = useSelector(e => e.user)
    const [roommates, setRoommates] = useState([])

    const getRoommates = async() => {
        if (!user | !user.attributes | !user.attributes.email) return;
        var res = await api.post("/",
            {
                userId: user.attributes.email,
                status: "roommates",

            }
        ).then(({data}) => data)
        setRoommates(JSON.parse(res.body))
    }
    useEffect(getRoommates, [user])
    return (
        <div>
            <p>Your roommates are {roommates}</p>
        </div>
    )
}

export default Apartments