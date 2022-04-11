import React, { useEffect, useState } from 'react';
import './Todo.css';
import { useSelector } from 'react-redux';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';

const api = axios.create({
    baseURL: "https://ugnn69x209.execute-api.us-east-1.amazonaws.com/dev"
})


const title = "Manage House Chores"

function CreateTask({ addTask, user }) {
    const [value, setValue] = useState("");
    const [dateValue, setDate] = useState("2022-03-30")
    const [timeValue, setTime] = useState("22:00")
    const handleSubmit = e => {
        e.preventDefault();
        if (!value) return;
        if (!user | !user.attributes | !user.attributes.email) return;
        
        var objSubmit = {}
        objSubmit["userId"] = user.attributes.email
        objSubmit["status"] = "create"
        objSubmit["time"] = Date.now().toString()
        objSubmit["title"] = value
        objSubmit["deadlineDate"] = dateValue
        objSubmit["deadlineTime"] = timeValue
        objSubmit["completed"] = false

        api.post("/", 
            objSubmit
        ).then(_res => {
            // console.log(_res)
            addTask(objSubmit);
        }).catch(error => {
            console.log(error)
        })
        
        // addTask(value);
        setValue("");
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                className="input"
                value={value}
                placeholder="Add a new task"
                onChange={e => setValue(e.target.value)}
                required
            />
            <input 
                type="date" 
                className="input"
                id="date" 
                name="finish-date"
                value={dateValue}
                min="2000-01-01" 
                max="2099-12-31"
                onChange={e => setDate(e.target.value)}
                required
            />
            <input 
                type="time" 
                id="appt" 
                name="appt"
                value={timeValue}
                onChange={e => setTime(e.target.value)}
                required 
            />
            <input
                type="submit"
                value="Submit"
                style={{
                    background: "#649cf5",
                    color: 'white', 
                    fontSize: "20px",
                    fontWeight: "bold"
                }}
            />
        </form>
    );
}


function Task({ task, index, completeTask, removeTask }) {
    return (
        <div
            className="task"
            style={{ textDecoration: task.completed ? "line-through" : "" }}
        >
            <div style={{display:"flex", flexDirection:"row", width:"100%"}}>
                <div style={{display:"flex", flexDirection:"column", width:"100%"}}>
                    {task.title}
                    <div style={{fontSize:"8px"}}>deadline: {task.deadlineDate} {task.deadlineTime}</div>
                </div>
                <div style={{width:"100%"}}>
                    <button style={{ background: "red" }} onClick={() => removeTask(index)}>x</button>
                    <button onClick={() => completeTask(index)}>Complete</button>
                </div>
            </div>
            
            
        </div>
    );
}



function Todo() {
    
    const user = useSelector(e => e.user)

    const [tasks, setTasks] = useState( 
        () => {
                return  [
                    
                ]
            }
       );

    const getData = async() => {
        if (!user | !user.attributes | !user.attributes.email) return;
        var res = await api.get("/",
            {
                params: {
                    userId: user.attributes.email
                }
            }
        ).then(({data}) => data);
        setTasks(JSON.parse(res.body))
    }


    const addTask = objSubmit => {
        const newTasks = [...tasks, objSubmit];
        setTasks(newTasks);
    };

    const completeTask = index => {
        if (!user | !user.attributes | !user.attributes.email) return;
        const newTasks = [...tasks];
        newTasks[index].completed = !newTasks[index].completed;

        var objSubmit = {}
        objSubmit["userId"] = user.attributes.email
        objSubmit["status"] = "update"
        objSubmit["time"] = newTasks[index].time
        objSubmit["completed"] = newTasks[index].completed
        api.post("/", objSubmit).then(_res => {
            // console.log(_res)
            setTasks(newTasks);
        }).catch(error => {
            console.log(error)
        })
    };

    const removeTask = index => {
        if (!user | !user.attributes | !user.attributes.email) return;
        const newTasks = [...tasks];
        var objSubmit = {}
        objSubmit["userId"] = user.attributes.email
        objSubmit["status"] = "delete"
        objSubmit["time"] = newTasks[index].time
        api.post("/", objSubmit).then(_res => {
            // console.log(_res)
            newTasks.splice(index, 1);
        setTasks(newTasks);
        }).catch(error => {
            console.log(error)
        })
        
    };

    useEffect(getData, [user])

    return (
        <div className="todo-container">
            <div className="header">{title}</div>
            <RefreshIcon onClick={getData} />
            
            <div className="tasks">
                {tasks.map((task, index) => (
                    <Task
                        task={task}
                        index={index}
                        completeTask={completeTask}
                        removeTask={removeTask}
                        key={index}
                    />
                ))}
            </div>
            <div className="create-task" >
                <CreateTask addTask={addTask} user={user} />
            </div>
        </div>
    );
}

export default Todo;