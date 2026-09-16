import React, { useState } from "react";
import { createTask } from "../services/taskService";
import { useNavigate } from "react-router-dom";
import "../styles/CreateTask.css";
const CreateTask = () => {

    const navigate = useNavigate();

    const [task, setTask] = useState({
    title: "",
    description: "",
    status: "PLANNED",
    priority: "LOW",
    dueDate: "",
    category: "",
    recurring: false,
    recurrenceType: "NONE",
    recurrenceEndDate: ""
});
const TASK_STATUS = [
    "PLANNED",
    "IN_PROGRESS",
    "HOLD",
    "COMPLETED",
    "CANCELLED"
];

    const handleChange = (e) => {
        setTask({
            ...task,
            [e.target.name]: e.target.value
        });
    };

const handleSubmit = async (e) => {
    e.preventDefault();

    if (
        task.recurring &&
        task.recurrenceEndDate &&
        task.dueDate &&
        task.recurrenceEndDate < task.dueDate
    ) {
        alert("Repeat Until date cannot be before the Due Date.");
        return;
    }

    console.log(task);

    try {
        await createTask(task);

        alert("Task Created Successfully");

        navigate("/tasks");
    } catch (error) {
        console.log(error);
        console.log("Response:", error.response);
        console.log("Data:", error.response?.data);

        alert("Failed To Create Task");
    }
};

    const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "15px",
  borderRadius: "12px",
  border: "none",
  outline: "none",
  fontSize: "15px",
  boxSizing: "border-box"
};
        return (
  <div
  className="create-task-page"
  style={{
    minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background:
        "linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)",
      padding: "30px"
    }}
  >
    <div
  className="create-task-card"
  style={{
    width: "100%",
    maxWidth: "700px",
        background: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(18px)",
        borderRadius: "24px",
        padding: "40px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        color: "#fff"
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "10px"
        }}
      >
        ✨ Create New Task
      </h1>

      <p
        style={{
          textAlign: "center",
          opacity: 0.8,
          marginBottom: "30px"
        }}
      >
        Organize your work and stay productive
      </p>

     <form className="create-task-form" onSubmit={handleSubmit}>

        <input
          type="text"
          name="title"
          placeholder="Task Title"
          onChange={handleChange}
          style={inputStyle}
        />

        <textarea
          name="description"
          placeholder="Task Description"
          onChange={handleChange}
          rows="4"
          style={{
            ...inputStyle,
            resize: "none"
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(200px,1fr))",
            gap: "15px"
          }}
        >

          <div style={{ marginBottom: "10px" }}>
  <label style={{ display: "block", marginBottom: "5px" }}>
    Task Status
  </label>

  <select
    name="status"
    onChange={handleChange}
    style={inputStyle}
    value={task.status}
  >
    <option value="PLANNED">Planned</option>
<option value="IN_PROGRESS">In Progress</option>
<option value="HOLD">Hold</option>
<option value="COMPLETED">Completed</option>
<option value="CANCELLED">Cancelled</option>
  </select>
</div>

        <div style={{ marginBottom: "10px" }}>
  <label style={{ display: "block", marginBottom: "5px" }}>
    Priority Level
  </label>

  <select
    name="priority"
    onChange={handleChange}
    style={inputStyle}
    value={task.priority}
  >
    <option value="LOW">Low</option>
    <option value="MEDIUM">Medium</option>
    <option value="HIGH">High</option>
  </select>
</div>
        </div>

        <br />

        <div style={{ marginBottom: "10px" }}>
  <label style={{ display: "block", marginBottom: "5px" }}>
    Due Date
  </label>

  <input
    type="date"
    name="dueDate"
    onChange={handleChange}
    style={inputStyle}
  />
</div>

        <div style={{ marginBottom: "10px" }}>
  <label style={{ display: "block", marginBottom: "5px" }}>
    Category
  </label>

  <select
    name="category"
    value={task.category}
    onChange={handleChange}
    style={inputStyle}
  >
    <option value="">Select Category</option>
    <option value="WORK">Work</option>
    <option value="PERSONAL">Personal</option>
    <option value="STUDY">Study</option>
  </select>
</div>
<div
    style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
        gap: "15px"
    }}
>
    <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
            Repeat Task
        </label>

        <select
            name="recurrenceType"
            value={task.recurrenceType}
            onChange={(e) => {
                const value = e.target.value;

                setTask({
                    ...task,
                    recurrenceType: value,
                    recurring: value !== "NONE",
                    recurrenceEndDate:
                        value === "NONE"
                            ? ""
                            : task.recurrenceEndDate
                });
            }}
            style={inputStyle}
        >
            <option value="NONE">No Repeat</option>
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
        </select>
    </div>

    {task.recurring && (
        <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
                Repeat Until
            </label>

            <input
                type="date"
                name="recurrenceEndDate"
                value={task.recurrenceEndDate}
                min={task.dueDate || undefined}
                onChange={handleChange}
                style={inputStyle}
            />
        </div>
    )}
</div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "15px",
            border: "none",
            borderRadius: "12px",
            background: "#ff6b6b",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "15px"
          }}
        >
          🚀 Create Task
        </button>

      </form>
    </div>
  </div>
);
};

export default CreateTask;