import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {  getTaskById, updateTask } from "../services/taskService";
import "../styles/updateTask.css";
const UpdateTask = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState({
        title: "",
        description: "",
        status: "",
        priority: "",
        dueDate: "",
        category: ""
    });

    useEffect(() => {
        loadTask();
    }, []);

    const loadTask = async () => {
  try {
    const response = await getTaskById(id);
    setTask(response.data);
  } catch (error) {
    console.log(error);
  }
};
    const handleChange = (e) => {
        setTask({
            ...task,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updateTask(id, task);
            alert("Task Updated Successfully");
            navigate("/tasks");
        } catch (error) {
            console.log(error);
            alert("Failed To Update Task");
        }
    };

   return (
  <div className="update-task-page">

    <div className="update-task-card">

      <h2>✏️ Update Task</h2>
      <p>Modify your task details below</p>

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            rows="4"
            value={task.description}
            onChange={handleChange}
          />
        </div>

        <div className="row">

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={task.status}
              onChange={handleChange}
            >
          <option value="PLANNED">Planned</option>
<option value="IN_PROGRESS">In Progress</option>
<option value="HOLD">Hold</option>
<option value="COMPLETED">Completed</option>
<option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select
              name="priority"
              value={task.priority}
              onChange={handleChange}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

        </div>

        <div className="row">

          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={task.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={task.category}
              onChange={handleChange}
            />
          </div>

        </div>

        <button
          type="submit"
          className="update-btn"
        >
          Update Task
        </button>

      </form>

    </div>

  </div>
);
};

export default UpdateTask;