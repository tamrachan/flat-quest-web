import "../css/FlatPage.css"
import ProgressBar from "../components/ProgressBar";

import { useEffect, useState, useRef } from "react";
import { data, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../components/AuthRoute";
import { FaChevronDown } from "react-icons/fa";

import { ConfirmPopup, confirmPopup  } from 'primereact/confirmpopup'; 
import { Toast } from 'primereact/toast';

// import Popup from 'reactjs-popup';

function FlatPage() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [showTaskConfigModal, setShowTaskConfigModal] = useState(false);
    const [newTaskValue, setNewTaskValue] = useState("");
    const [repeat, setRepeat] = useState("");
    const [assign, setAssign] = useState("");
    const isLeader = user?.role === "leader"; 
    const [flatmates, setFlatmates] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        // Fetch fresh user data instead of using JWT payload
        api.get('/reset/me')
            .then(res => {
                setUser(res.data.user); // Fresh data from database
            })
            .catch(err => {
                console.error("Failed to fetch user data:", err);
                localStorage.removeItem("token");
                navigate("/login");
            });        
    }, []);

    useEffect(() => {
        if (!user?.code) return;

        // console.log(user?.code, "codeee");

        axios.get('http://localhost:5050/record/flatmates', 
            { params: {code: user?.code}}
            )
            .then(result => {
                setFlatmates(result.data);
            })
            .catch(err => {
                console.error("Failed to fetch flatmates:", err);
            });
        }, [user]);
    // console.log(flatmates, "flatmates");

    const addMainTask = (e) => {
        e.preventDefault();
        // const taskValue = e.target.mainTask.value;
        // const assigned = e.target.mainTask.assigned;
        
        if ( newTaskValue !== "" ) {
            // do the thing- get window

            // console.log("Adding main task:", taskValue, "for user:", user?.user);

            axios.post('http://localhost:5050/task/new-task', 
                {task: newTaskValue, code: user?.code, publisher: user?.user, assigned: assign, date_created: new Date(), complete: false, repeat: repeat}) 
                .then(() => {
                    setShowTaskConfigModal(false);
                    setNewTaskValue("");
                    navigate(0); // Reloads the current route
                }) 
                .catch(err => {
                    console.error("Error adding personal task:", err);
                })
        }
    }

    const handleTaskAssignment = (e) => {
        e.preventDefault();
        const taskValue = e.target.mainTask.value;

        if ( taskValue !== "" ) {
            setShowTaskConfigModal(true);
            setNewTaskValue(taskValue);
            e.target.reset();
        }


        // if (newTaskValue !== "") {
        //     axios.post('http://localhost:5050/task/new-task', 
        //         {task: taskValue, code: user?.code, publisher: user?.user, assigned: assign, date_created: new Date(), complete: false, repeat: repeat})
        //         .then(() => {
        //             setShowAssignmentModal(false);
        //             setNewTaskValue("");
        //             navigate(0);
        //         })
        //         .catch(err => {
        //             console.error("Error adding main task:", err);
        //         });
        // }
    };

    const addPersonalTask = (e) => {
        e.preventDefault();
        const taskValue = e.target.personalTask.value;

        if (taskValue !== "") {

        // console.log("Adding personal task:", taskValue, "for user:", user?.user);


            axios.post('http://localhost:5050/task/new-personal-task', 
                {task: taskValue, user: user?.user, date_created: new Date(), complete: false, repeat: "none"}) // change repeat
                .then(navigate(0)) // Reloads the current route
                .catch(err => {
                    console.error("Error adding personal task:", err);
                })
        }
    }

    
    
    return (
    <div className="flatpage-container">

    
        <div className="title">
            <h1>{user?.user}'s FlatPage!</h1>
            <p>Group Code: {user?.code}</p>
        </div>

        <div className="gridContainer">

            <div className="taskBox">
                <h3 className="sticky">Tasks</h3>
                <div className="taskList">

                    <DisplayMainTasks user={user} /> 

                </div>
            </div>
            
            {isLeader && (
            <div className="addMainTask">
                <form onSubmit={handleTaskAssignment}>  
                    <input type="text" placeholder="Add main tasks here..." name="mainTask" className="inputText" />
                    <button type="submit">Add</button>
                </form> 
            </div>
            )}
            {!isLeader && (
            <div className="addMainTask">
                    So many tasks, so little time...
                    <br/>
                    Luckily, not all of them are for you!
            </div>
            )}

            <div className="taskLog">
                <h3>Task Log</h3>
                <DisplayTaskLog user={user} />
            </div>

            <div className="personalTasks">

                <h3 className="sticky">Personal Tasks</h3>
                <div className="taskList">
                    <DisplayPersonalTasks user={user} />
                </div>

            </div>
            <div className="addTask">
                <form onSubmit={addPersonalTask}> {/* it should be a method that adds it to the tasks data base in another personal database collection */}
                    <input type="text" placeholder="Add personal tasks here..." name="personalTask" className="inputText" />
                    {/* <Dropdown /> */}
                    <button type="submit">Add</button>
                </form> 
            </div>

            <div className="stats">

                <h3>Stats</h3>
                <div>Tasks to do: (number)</div>
                <div>Tasks completed: (number)</div>

            </div>

            <div className="graph">

                <h3>Progress</h3>
                <div>A visual of how many left to do / total for the week</div>
                <ProgressBar progress={50} label="Completed tasks / Total tasks" color="var(--primary-colour)"  /> {/* Pass in percentage of tasks calculated */}

            </div>

            <div className="flatmates-panel">
                <h3>Flatmates</h3>
                <div className="flatmate-icon-container">
                    {flatmates.map(flatmate => (
                        <Flatmate key={flatmate.user} name={flatmate.name} imageSrc={flatmate.icon} /> 
                    ))}
                </div>
            </div>

            
        </div>

        
        { showTaskConfigModal && (
        <TaskConfigModal
            taskValue={newTaskValue}
            flatmates={flatmates}
            // taskConfig={taskConfig}
            // setTaskConfig={setTaskConfig}
            setRepeat={setRepeat}
            setAssign={setAssign}
            onCreate={addMainTask}
            onCancel={() => {
                setShowTaskConfigModal(false);
                setNewTaskValue("");
                setAssign("");
                setRepeat("");
                // setTaskConfig({ assigned: "", repeat: "none" });
                }}
            />
        )}

    </div>)
}

// function tasksBox() {

//     return <div className="taskBox">
//         <h2>Tasks</h2>
//     </div>

// }

function TaskConfigModal({ taskValue, flatmates, setAssign, setRepeat, onCreate, onCancel }) {
    // if (!leader) return null;

    const repeatOptions = [
        { value: "none", label: "No Repeat" },
        { value: "daily", label: "Daily" },
        { value: "weekly", label: "Weekly" },
        { value: "monthly", label: "Monthly" }
    ];

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Configure Task</h3>
                <p><strong>Task:</strong> "{taskValue}"</p>
                
                {/* Assignment Section */}
                <div className="config-section">
                    <h4>Assign to:</h4>
                    <div className="assignment-options">
                        
                        {flatmates.map(flatmate => (
                            <label key={flatmate.user}>
                                <input type="radio" name="assigned" 
                                    value={flatmate.user}
                                    // checked={taskConfig.assigned === flatmate.user}
                                    onChange={(e) => setAssign(e.target.value)} />
                                {flatmate.user}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Repeat Section */}
                <div className="config-section">
                    <h4>Repeat:</h4>
                    <select 
                        onChange={(e) => setRepeat(e.target.value)}>
                        {repeatOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="modal-actions">
                    <button 
                        onClick={onCreate}
                        // disabled={!taskConfig.assigned}
                        className="create-btn">
                        Create Task
                    </button>
                    <button onClick={onCancel} className="cancel-btn">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

function DisplayMainTasks({ user }) {
    // const { user } = useContext(UserContext); // could put this as a prop instead
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();

    const toast = useRef(null);
    const [confirmTaskId, setConfirmTaskId] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5050/task/get-tasks')
        .then(response => {
            setTasks(response.data);
        })
        .catch(error => {
            console.error("Error fetching tasks:", error);
        });
    }, []);

    // const results = [];

    // console.log("user", user);

    const accept = (taskId) => {
        axios.post("http://localhost:5050/task/complete-task", {
            collectionName: "tasks", _id: taskId, date_completed: new Date() })
            .then(navigate(0))
            .catch(error => {
                console.error("Error: ", error);
        });

        // console.log("successss", taskId)
    };

    const cancel = () => {
        setConfirmTaskId(null);
        navigate(0);
    };

    return (
        <>
            <div>
            {// streams //  && (task.assigned === user?.user)
            tasks
                .filter(task => (! task.complete) && (task.code === user?.code) && (task.assigned === user?.user)) // only show tasks that are not complete and belong to the user's group code
                .map(task => 

                    <div key={task._id}>
                        <input type="checkbox" onChange={() => setConfirmTaskId(task._id)} /> {task.assigned}: {task.task} 

                    </div>
                )}
            </div>

            <div>
                <Toast ref={toast} /> 
                        <ConfirmPopup className="confirmPopup" 
                            visible={confirmTaskId} 
                            message="Are you sure you want to proceed?" accept={() => confirmTaskId && accept(confirmTaskId)} reject={cancel} />
            </div>
        </>
    );

    // for (const task of tasks) {
    //     if ( (! task.complete) && (task.code === user?.code) ) { // only show tasks that are not complete and belong to the user's group code

    //         // console.log("tasks", task);

    //         results.push(
    //             <div>{task.assigned}: {task.task}</div>
    //         )
    //     }
    // }

    // return <div>{results}</div>;
}

function DisplayPersonalTasks({ user }) {
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();
    
    // const [visible, setVisible] = useState(false);
    const toast = useRef(null);
    const [confirmTaskId, setConfirmTaskId] = useState(null);
    // const [complete, setComplete] = useState(false);
    // const checkBoxButton = useRef(null);

    useEffect(() => {
        axios.get('http://localhost:5050/task/get-personal-tasks')
        .then(response => {
            setTasks(response.data);
        })
        .catch(error => {
            console.error("Error fetching tasks:", error);
        });
    }, []);

    const accept = (taskId) => {
        axios.post("http://localhost:5050/task/complete-task", {
            collectionName: "personal", _id: taskId, date_completed: new Date() })
            .then(navigate(0))
            .catch(error => {
                console.error("Error: ", error);
        });

        // console.log("successss", taskId)
    };

    const cancel = () => {
        setConfirmTaskId(null);
        navigate(0);
    };

    return (
        <>
            <div>
            {// streams
            tasks
                .filter(task => (! task.complete) && (task.user === user?.user))
                .map(task => 

                    <div key={task._id}>
                        <input type="checkbox" onChange={() => setConfirmTaskId(task._id)} /> {task.task}

                    </div>
                )}
            </div>

            <div>
                <Toast ref={toast} /> 
                        <ConfirmPopup className="confirmPopup" 
                            visible={confirmTaskId} 
                            message="Are you sure you want to proceed?" accept={() => confirmTaskId && accept(confirmTaskId)} reject={cancel} />
            </div>
        </>
    );
}

function DisplayTaskLog({ user }) {
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        Promise.all([
            axios.get('http://localhost:5050/task/get-personal-tasks'),
            axios.get('http://localhost:5050/task/get-tasks')
        ])
        .then(([personalResponse, mainResponse]) => {
            const combined = [...personalResponse.data, ...mainResponse.data];
            combined.sort((a,b) => new Date(b.date_created) - new Date(a.date_created)); //sorts it so newest task on top of list
            setTasks(combined);
        })
        .catch(error => {
            console.error("Error fetching task logs:", error);
        });

    }, []);

    const results = [];

    for (const task of tasks) {
        if ( (task.complete) && ((task.user === user?.user) || (task.code === user?.code)) ) { // only show tasks that are complete and belong to the user's group code or personal tasks
            // console.log("task log", user?.user, task.user);

            //checked={task.complete}
            results.push(
                <div>
                    {/* {task.date_completed} */}
                    {task.date_completed?.substring(0,10).split('-').reverse().join('/')} {task.date_completed?.substring(11,19)}: {task.assigned || task.user} completed {task.task}
                    
                </div>
            )
        }
    }

    return <div>{results}</div>;
}

function popup(props) {
    return (props.winnerProp) ? ( 
        <div className="popup">

            <div className="popupInner">

                <h1>hello popup? {props.winnerProp} is me </h1>

                <button>x</button>
                { props.children }

            </div>

        </div>
    ) : null;
}

// TODO
function Dropdown() {
    const [ display, setDisplay ] = useState( 'none' )

    function handleClick() {
        if ( display == 'none' ) {
            setDisplay( 'block' )
        } else {
            setDisplay( 'none' )
        }
    }

    return (
        <>
        <div className="dropdown-btn">Repeat<span className="toggle-icon"><FaChevronDown /></span></div> {/* dropdown button */}
        <div className="dropdown-content">content</div> {/* dropdown content */}

        {/* <div className="dropdown">
            <button className="dropbtn">Repeat</button>
            <div className="dropdown-content">
                <a href="#">Daily</a>
                <a href="#">Weekly</a>
                <a href="#">Monthly</a>
                <a href="#">Yearly</a>
                <a href="#">Custom</a>
            </div>
        </div> */}
        </>
    );
}

// function AssignmentModal({ taskValue, flatmates, onAssign, onCancel }) {
//     return (
//         <div className="modal-overlay">
//             <div className="modal-content">
//                 <h3>Assign Task</h3>
//                 <p>Task: "{taskValue}"</p>
//                 <p>Assign to:</p>
                
//                 <div className="assignment-options">
//                     <button 
//                         className="assign-btn everyone" 
//                         onClick={() => onAssign("everyone")}
//                     >
//                         Everyone
//                     </button>
                    
//                     {flatmates.map(flatmate => (
//                         <button 
//                             key={flatmate._id || flatmate.user}
//                             className="assign-btn individual"
//                             onClick={() => onAssign(flatmate.user)}
//                         >
//                             {flatmate.user}
//                         </button>
//                     ))}
//                 </div>
                
//                 <div className="modal-actions">
//                     <button className="cancel-btn" onClick={onCancel}>
//                         Cancel
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

const getIconUrl = (name) =>
        new URL(`../assets/icons/${name}.png`, import.meta.url).href;

function Flatmate({ name, imageSrc }) {
    return <div className="flatmate-icon">
        
        <img src={getIconUrl(imageSrc)} alt="Avatar"></img>
        <figcaption> {name} </figcaption>
        {/* <label>name</label> */}

    </div>
}

export default FlatPage;