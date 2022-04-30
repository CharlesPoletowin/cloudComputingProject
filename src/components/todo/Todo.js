import React, { useEffect, useState } from 'react';
import './Todo.css';
import { useSelector } from 'react-redux';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import MuiAlert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const api = axios.create({
    baseURL: "https://ugnn69x209.execute-api.us-east-1.amazonaws.com/dev"
})


const title = "Manage House Chores"

function CreateTask({ addTask, user }) {
    const [value, setValue] = useState("")
    const [dateValue, setDate] = useState(new Date().toLocaleDateString('en-ca'))
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
        objSubmit["notifiy"] = false

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
                min={new Date().toLocaleDateString('en-ca')}
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
                    fontWeight: "bold",
                    cursor: "pointer"
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
                    <button onClick={() => completeTask(index)}>{!task.completed ? "Complete" : "Redo"}</button>
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
    const [overDueNumber, setOverDueNumber] = useState(0)
    const [toDueNumber, setToDueNumber] = useState(0)
    const [finishValue, setFinishValue] = useState(0)
    const [showNotification, setNotification] = useState(false)

    Date.prototype.timeNow = function () {
        return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes();
    }

    const mySetTasksData = (data) => {
        const sumFinish = data.reduce((accumalte, cur) => {
            if (cur["completed"] === true) {
                return accumalte + 1;
            }
            else {
                return accumalte;
            }
        }, 0)
        const sumOverDue = data.reduce((accumalte, cur) => {
            if (cur["completed"] === false && cur["deadlineDate"] < new Date().toLocaleDateString('en-ca') ) {
                return accumalte + 1;
            }
            else if (cur["completed"] === false && cur["deadlineDate"] === new Date().toLocaleDateString('en-ca') && new Date().timeNow() > cur["deadlineTime"]) {
                return accumalte + 1;
            }
            else return accumalte;
        }, 0)
        setFinishValue(sumFinish)
        setOverDueNumber(sumOverDue)
        setToDueNumber(data.length - sumFinish)
        setTasks(data)
        setNotification(true)
    }

    const getData = async() => {
        if (!user | !user.attributes | !user.attributes.email) return;
        var res = await api.get("/",
            {
                params: {
                    userId: user.attributes.email
                }
            }
        ).then(({data}) => data);
        mySetTasksData(JSON.parse(res.body))
    }


    const addTask = objSubmit => {
        const newTasks = [...tasks, objSubmit];
        mySetTasksData(newTasks);
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
            mySetTasksData(newTasks);
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
            mySetTasksData(newTasks);
        }).catch(error => {
            console.log(error)
        })

    };

    useEffect(() => {
        getData()
    }, [user])

    return (
        <div>
            <div style={{position:"relative", height:"2px"}}>
                <div style={{position:"absolute",width:"300px", height:"8px", right:"0"}}>
                    {showNotification ? 
                    <Stack spacing={2} sx={{ width: '100%' }} >
                        {
                        overDueNumber > 0 ? 
                        <Alert severity="error" onClick = {() => {setOverDueNumber(-1)}}>
                            You have forgotten to finished {overDueNumber} house chores!
                        </Alert>
                        : ""
                        }
                        {
                            toDueNumber > 0 ?
                            <Alert severity="warning" onClick = {() => {setToDueNumber(-1)}}>
                                You need to finished {toDueNumber} house chores soon!
                            </Alert>
                            : ""
                        }
                        {
                            finishValue > 0 ?
                            <Alert severity="success" onClick = {() => {setFinishValue(-1)}}>
                                You have finished {finishValue} house chores! Congratulations!
                            </Alert>
                            : ""
                        }
                    </Stack>
                    : "" }
                </div>
            </div>
            
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
        </div>
        
    );
}

export default Todo;