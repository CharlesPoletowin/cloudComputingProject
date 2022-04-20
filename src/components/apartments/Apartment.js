import React, { useEffect, useState } from 'react';
import './Apartment.css';
import { useSelector } from 'react-redux';
import axios from 'axios';

const api = axios.create({
    baseURL: "https://kgr24rcf4c.execute-api.us-west-2.amazonaws.com/dev"
})

function Apartment() {
    const user = useSelector(e => e.user)
    const [roommates, setRoommates] = useState([])
    const [apartmentName, setApartmentName] = useState("")

    const createApartment = objSubmit => {
        setRoommates(user.attributes.email)
        setApartmentName(objSubmit.apartmentName)
    }

    const addNewRoommate = objSubmit => {
        const updatedRoommates = [...roommates, objSubmit.userId]
        setRoommates(updatedRoommates)
    }

    const getRoommates = async() => {
        if (!user | !user.attributes | !user.attributes.email) return;
        var getRoommatesRes = await api.post("/",
            {
                userId: user.attributes.email,
                status: "roommates",
            }
        ).then(({data}) => data)
        if (getRoommatesRes.statusCode === 200) {
            setRoommates(JSON.parse(getRoommatesRes.body))
        }
    }

    useEffect(getRoommates, [user])
    if (roommates.length === 0) {
        return (
            <div>
                <p>No roommates available</p>
                <p>Would you like to register your apartment?</p>
                <RegisterApartment
                    createApartment={createApartment}
                    user={user}
                    apartmentName={apartmentName}
                    setApartmentName={setApartmentName}
                />
            </div>
        )
    } else {
        return (
            <div>
                <p>Your apartment is {apartmentName}</p>
                <p>Your roommates are {roommates}</p>
                <br/>
                <AddRoommate
                    user={user}
                    apartmentName={apartmentName}
                    addNewRoommate={addNewRoommate}
                />
            </div>
        )
    }
}

function RegisterApartment({createApartment, user, apartmentName, setApartmentName}) {
    const handleSubmit = e => {
        e.preventDefault();
        if (!user | !user.attributes | !user.attributes.email) return;

        var objSubmit = {
            userId: user.attributes.email,
            status: "create",
            apartmentName: apartmentName
        }
        console.log(objSubmit)
        api.post(
            "/",
            objSubmit
        ).then(
            registerAptRes => {
                createApartment(objSubmit)
            }
        ).catch(error => {
            console.log(error)
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                className="input"
                value={apartmentName}
                placeholder="Apartment name"
                onChange={e => setApartmentName(e.target.value)}
                required
            />
            <input
                type="submit"
                value="Register"
                style={{
                    background: "#649cf5",
                    color: 'white',
                    fontSize: "20px",
                    fontWeight: "bold"
                }}
            />
        </form>
    )
}

function AddRoommate({user, apartmentName, addNewRoommate}) {
    const [newRoommateEmail, setNewRoommateEmail] = useState("")

    const handleSubmit = e => {
        e.preventDefault();
        if (!user | !user.attributes | !user.attributes.email) return;
        if (!apartmentName) return;

        var objSubmit = {
            userId: newRoommateEmail,
            status: "add",
            apartmentName: apartmentName
        }
        console.log(objSubmit)
        api.post(
            "/",
            objSubmit
        ).then(
            addRoommateRes => {
                addNewRoommate(objSubmit)
            }
        ).catch(error => {
            console.log(error)
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                className="input"
                value={newRoommateEmail}
                placeholder="New roommate email"
                onChange={e => setNewRoommateEmail(e.target.value)}
                required
            />
            <input
                type="submit"
                value="Add"
                style={{
                    background: "#649cf5",
                    color: 'white',
                    fontSize: "20px",
                    fontWeight: "bold"
                }}
            />
        </form>
    )
}

export default Apartment