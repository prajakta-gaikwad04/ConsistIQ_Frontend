import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Card,
    CardContent,
    Stack,
    Chip,
    CircularProgress,
    Select,
    MenuItem
} from "@mui/material";
import "../styles/tasks.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import {
  completeTask,
  cancelTask,
  deleteTask,
  getAllTasks,
  searchTasks,
  uploadFile,
  getUpcomingTasks,
  getTasksByStatus,
  getAttachment,
  deleteAttachment
} from "../services/taskService";

const Tasks = () => {

    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
const [fileError, setFileError] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();

 const [status, setStatus] = useState(
    searchParams.get("status") || ""
);

const [priority, setPriority] = useState(
    searchParams.get("priority") || ""
);

const [category, setCategory] = useState(
    searchParams.get("category") || ""
);

const [sortBy, setSortBy] = useState(
    searchParams.get("sortBy") || "id"
);
const [sortOrder, setSortOrder] = useState(
    searchParams.get("sortOrder") || "asc"
);
const [upcomingTasks, setUpcomingTasks] = useState([]);

    // LOAD TASKS
const loadTasks = async () => {
    try {
        setLoading(true);

       const response = await getAllTasks({
    page,
    size,
    search,
    status,
    priority,
    category,
    sortBy,
    sortOrder
});

        setTasks(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);

    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
};
const loadUpcomingTasks = async () => {
    try {
        const response = await getUpcomingTasks();
        setUpcomingTasks(response.data);
    } catch (error) {
        console.log(error);
    }
};

useEffect(() => {
    loadUpcomingTasks();
}, []);

useEffect(() => {
      
    setSearchParams({
        status,
        priority,
        sortBy,
        sortOrder,
        page
    });
}, [status, priority, sortBy, sortOrder, page]);


    // DEBOUNCE SEARCH
  useEffect(() => {

  const delay = setTimeout(async () => {

    try {

      if (search.trim() !== "") {

        const response = await searchTasks(search);

        setTasks(response.data);
        return;
      }

      loadTasks();

    } catch (error) {

      console.log(error);
    }

  }, 500);
  return () => clearTimeout(delay);

}, [
  search,
  status,
  priority,
  category,
  sortBy,
  sortOrder,
  page
]);


    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure?");
        if (!confirmDelete) return;

        try {
            await deleteTask(id);
            loadTasks();
        } catch (error) {
            console.log(error);
        }
    };

    const handleComplete = async (id) => {
        try {
            await completeTask(id);
            loadTasks();
        } catch (error) {
            console.log(error);
        }
    };

    const loadByStatus = async (status) => {
        try {
            setLoading(true);
            const response = await getTasksByStatus(status);
            setTasks(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const validateFile = (file) => {

    if (!file) {
        return "Please select a file.";
    }

    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
        "text/plain",
        "text/csv"
    ];

    if (!allowedTypes.includes(file.type)) {
        return "Only PDF, DOC, DOCX, JPG, PNG, TXT and CSV files are allowed.";
    }

    if (file.size > 10 * 1024 * 1024) {
        return "File size must be less than 10 MB.";
    }

    return "";
};
const handleFileUpload = async (taskId, file) => {

    const error = validateFile(file);

    if (error) {
        alert(error);
        return;
    }

    setFileError("");

    try {

        await uploadFile(taskId, file);

        alert("File uploaded successfully");

        await loadTasks();

    } catch (error) {

        console.log(error);

        alert("Upload failed");
    }
};
const handleViewFile = async (taskId, attachmentId) => {
  try {
    const response = await getAttachment(taskId, attachmentId);

    const fileURL = window.URL.createObjectURL(
      new Blob([response.data], {
        type: response.headers["content-type"]
      })
    );

    window.open(fileURL, "_blank");

    setTimeout(() => {
      window.URL.revokeObjectURL(fileURL);
    }, 10000);

  } catch (error) {
    console.log(error);
    alert("Unable to open file");
  }
};
const handleDeleteAttachment = async (taskId, attachmentId) => {
  if (!window.confirm("Delete this attachment?")) {
    return;
  }

  try {
    await deleteAttachment(taskId, attachmentId);

    await loadTasks();

  } catch (error) {
    console.log(error);
    alert("Unable to delete attachment");
  }
};
const handleCancel = async (id) => {
    try {
        await cancelTask(id);
        loadTasks();
    } catch (error) {
        console.log(error);
    }
};
    return (
  <div className="tasks-page">

   <div className="tasks-header">
  <Typography variant="h3" fontWeight="bold">
    🚀 Task Management
  </Typography>

  <Typography color="text.secondary">
    Manage, filter and track your productivity
  </Typography>
</div>
  <Card sx={{ p: 3, mb: 3, borderRadius: 3 }}>
  <Stack
    direction="row"
    spacing={2}
sx={{ flexWrap: "wrap" }}
    useFlexGap
  >

      <TextField
        label="Search Tasks"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(0);
        }}
        size="small"
      />

      <Select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
          setPage(0);
        }}
        displayEmpty
        size="small"
      >
       <MenuItem value="PLANNED">Planned</MenuItem>
<MenuItem value="IN_PROGRESS">In Progress</MenuItem>
<MenuItem value="HOLD">Hold</MenuItem>
<MenuItem value="COMPLETED">Completed</MenuItem>
<MenuItem value="CANCELLED">Cancelled</MenuItem>
      </Select>

      <Select
        value={priority}
        onChange={(e) => {
          setPriority(e.target.value);
          setPage(0);
        }}
        displayEmpty
        size="small"
      >
        <MenuItem value="">All Priority</MenuItem>
        <MenuItem value="LOW">Low</MenuItem>
        <MenuItem value="MEDIUM">Medium</MenuItem>
        <MenuItem value="HIGH">High</MenuItem>
      </Select>

      <Select
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          setPage(0);
        }}
        displayEmpty
        size="small"
      >
        <MenuItem value="">All Category</MenuItem>
        <MenuItem value="WORK">Work</MenuItem>
        <MenuItem value="PERSONAL">Personal</MenuItem>
        <MenuItem value="STUDY">Study</MenuItem>
      </Select>

      <Select
        value={sortBy}
        onChange={(e) => {
          setSortBy(e.target.value);
          setPage(0);
        }}
        displayEmpty
        size="small"
      >
        <MenuItem value="id">Default</MenuItem>        <MenuItem value="title">Title</MenuItem>
        <MenuItem value="dueDate">Due Date</MenuItem>
        <MenuItem value="priority">Priority</MenuItem>
      </Select>

      <Button
        variant="outlined"
        onClick={() =>
          setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        }
      >
        {sortOrder === "asc" ? "ASC ↑" : "DESC ↓"}
      </Button>

      <Button
        variant="contained"
        onClick={() => {
          setSearch("");
          setStatus("");
          setPriority("");
          setCategory("");
          setSortBy("id");
          setSortOrder("asc");
          setPage(0);
        }}
      >
        Reset
      </Button>

  </Stack>
</Card>
<div className="upcoming-card">

    <h3>📅 Upcoming Deadlines</h3>

    {upcomingTasks.length === 0 ? (

        <p>No upcoming deadlines 🎉</p>

    ) : (

        upcomingTasks.map(task => (

             <div
        key={task.id}
        className="deadline-item"
    >
        <strong>
            📚 {task.title}
        </strong>

        <p>
            Due: {task.dueDate}
        </p>
            </div>

        ))
    )}

</div>
<Box sx={{ mb: 5 }} />
    {loading && (
      <div className="loader">
        <CircularProgress />
      </div>
    )}

    {!loading && tasks.length === 0 && (
      <div className="empty-state">
  <Typography variant="h5">
    No Tasks Found
  </Typography>

  <Typography color="text.secondary">
    Try changing filters or create a task.
  </Typography>
</div>
    )}

    {!loading &&
      tasks.map((task) => (
<Card
  key={task.id}
  sx={{
    mb: 2,
    borderRadius: 3,
    boxShadow: 3,
    transition: "0.3s",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: 6
    }
  }}
>         
 <CardContent>

            <Typography variant="h6">
              {task.title}
            </Typography>

            <Typography color="text.secondary">
              {task.description}
            </Typography>

     

  <Stack
  direction="row"
  spacing={2}
  sx={{
    flexWrap: "wrap"
  }}
>

  <Chip
  label={task.status}
  color={
    task.status === "COMPLETED"
      ? "success"
      : task.status === "HOLD"
      ? "warning"
      : task.status === "CANCELLED"
      ? "error"
      : "primary"
  }
/>

  <Chip
    label={task.priority}
    color={
      task.priority === "HIGH"
        ? "error"
        : task.priority === "MEDIUM"
        ? "warning"
        : "success"
    }
  />

  <Chip label={task.category} />

  <Chip
    label={`📅 ${task.dueDate}`}
    variant="outlined"
  />

</Stack>
            <div className="task-actions">

              <Button
                color="error"
                variant="outlined"
                onClick={() => handleDelete(task.id)}
              >
                Delete
              </Button>

              {task.status !== "COMPLETED" && (
                <Button
                  variant="contained"
                  onClick={() => handleComplete(task.id)}
                >
                  Complete
                </Button>
              )}
{task.status !== "COMPLETED" &&
 task.status !== "CANCELLED" && (
    <Button
        color="warning"
        variant="contained"
        onClick={() => handleCancel(task.id)}
    >
        Cancel
    </Button>
)}
              <Button
  variant="outlined"
  onClick={() =>
    navigate(`/update-task/${task.id}`)
  }
>
  Edit
</Button>

<Button variant="outlined" component="label">
  Upload File
  <input
    hidden
    type="file"
    onChange={(e) =>
      handleFileUpload(task.id, e.target.files[0])
    }
  />
</Button>

{task.attachments && task.attachments.length > 0 && (
  <Box sx={{ mt: 2 }}>
    <Typography fontWeight="bold">
      📎 Attachments
    </Typography>

    {task.attachments.map((attachment) => (
      <Stack
        key={attachment.id}
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ mt: 1 }}
      >
        <Typography>
          📄 {attachment.fileName}
        </Typography>

        <Button
          size="small"
          variant="outlined"
          onClick={() =>
            handleViewFile(task.id, attachment.id)
          }
        >
          View
        </Button>

        <Button
          size="small"
          color="error"
          onClick={() =>
            handleDeleteAttachment(
              task.id,
              attachment.id
            )
          }
        >
          Delete
        </Button>
      </Stack>
    ))}
  </Box>
)}
            </div>

          </CardContent>
        </Card>
      ))}

    <div className="pagination">

      <Button
        variant="outlined"
        disabled={page === 0}
        onClick={() => setPage(page - 1)}
      >
        Prev
      </Button>

      <span>
        Page {page + 1}
        {totalPages > 0 && ` of ${totalPages}`}
      </span>

      <Button
        variant="outlined"
        disabled={
          totalPages > 0 &&
          page + 1 >= totalPages
        }
        onClick={() => setPage(page + 1)}
      >
        Next
      </Button>

    </div>

  </div>
);
};

export default Tasks;