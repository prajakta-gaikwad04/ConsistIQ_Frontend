import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { getDashboardData } from "../services/dashboardService";
import { getUnreadCount } from "../services/NotificationService";

import "../styles/dashboard.css";
import {
    getUpcomingTasks,
    getOverdueTasks
} from "../services/taskService";
import {
    getAchievements
} from "../services/taskService";
import PomodoroTimer from "../components/PomodoroTimer";
const Dashboard = () => {

    const navigate = useNavigate();


const [dashboard, setDashboard] = useState({
    totalTasks: 0,
    planned: 0,
    inProgressTasks: 0,
    completedTask: 0,
    completionPercentage: 0,
    todayCompletedTasks: 0,
    dailyGoal: 0,
    productivityScore: 0
});
const [unreadCount, setUnreadCount] = useState(0);
const [dailyQuote, setDailyQuote] = useState({});
const [studyTip, setStudyTip] = useState({});
const [overdueTasks, setOverdueTasks] = useState([]);
const [calendarData, setCalendarData] =
    useState([]);


        const quotes = [
  {
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi"
  },
  {
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier"
  },
  {
    text: "Learning never exhausts the mind.",
    author: "Leonardo da Vinci"
  },
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela"
  },
  {
    text: "Dream, dream, dream. Dreams transform into thoughts and thoughts result in action.",
    author: "A.P.J. Abdul Kalam"
  }
];

const studyTips = [
{
    tip: "Use the Pomodoro Technique: 25 min focus + 5 min break."
},
{
    tip: "Revise within 24 hours to improve retention."
},
{
    tip: "Study difficult topics when your energy is highest."
},
{
    tip: "Practice active recall instead of rereading notes."
},
{
    tip: "Solve previous questions before exams."
},
{
    tip: "Keep your phone away during study sessions."
},
{
    tip: "Teach a concept to someone else to test understanding."
}
];

  useEffect(() => {

    loadDashboard();
    loadUnreadCount();
   
    loadOverdueTasks();
    loadCalendar();
  

    const day = new Date().getDate();

    setDailyQuote(
        quotes[day % quotes.length]
    );

    setStudyTip(
        studyTips[day % studyTips.length]
    );

}, []);


const loadDashboard = async () => {
    try {
        const response = await getDashboardData();
        setDashboard(response.data);
    } catch (error) {
        console.log(error);
    }
};
    const loadUnreadCount = async () => {
        try {
            const res = await getUnreadCount();
            setUnreadCount(res.data);
        } catch (error) {
            console.error(error);
        }
    };





const loadOverdueTasks = async () => {

    try {

        const response =
            await getOverdueTasks();

        setOverdueTasks(response.data);

    } catch (error) {

        console.log(error);
    }
};


const loadCalendar = async () => {

    try {

        const response =
            await getCalendarData();

        setCalendarData(
            response.data
        );

    } catch (error) {

        console.log(error);
    }
};


    return (
        <div
  style={{
    minHeight: "100vh",
    padding: "30px",
    background: "#F8F5FF"
  }}
>

           <div className="dashboard-header">

    <div>
        <h1
            style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                color: "#7C3AED"
            }}
        >
            ✨ ConsistIQ Dashboard
        </h1>

        <p className="dashboard-subtitle">
            Track your tasks, build consistency,
            and achieve your study goals.
        </p>
    </div>

<div className="welcome-card">
    <h2>
        Welcome Back 👋
    </h2>

    <p>
        Stay consistent today and
        complete your goals.
    </p>
</div>
    <Link to="/notifications">
        <Badge
            badgeContent={unreadCount}
            color="error"
        >
            <NotificationsIcon fontSize="large" />
        </Badge>
    </Link>

</div>
<div className="quote-card">

    <h3>💡 Daily Motivation</h3>

    <p>
        "{dailyQuote.text}"
    </p>

    <span>
        — {dailyQuote.author}
    </span>

</div>
<div className="study-tip-card">

    <h3>💡 Study Tip Of The Day</h3>

    <p>
        {studyTip.tip}
    </p>

</div>

            <div className="dashboard-grid">
              
              <div className="dashboard-card daily-goal-card">

    <h3>🎯 Daily Goal</h3>

    <h2>
        {dashboard.todayCompletedTasks} / {dashboard.dailyGoal}
    </h2>

    <div className="goal-progress">

        <div
            className="goal-progress-fill"
            style={{
                width: `${
                    dashboard.dailyGoal > 0
                        ? (dashboard.todayCompletedTasks /
                           dashboard.dailyGoal) * 100
                        : 0
                }%`
            }}
        />

    </div>

    <p>
        {dashboard.dailyGoal -
            dashboard.todayCompletedTasks > 0
            ? `${dashboard.dailyGoal -
                dashboard.todayCompletedTasks}
                tasks remaining today`
            : "Goal Achieved 🎉"}
    </p>

</div>
<div className="score-card">

    <h3>
        ⚡ Productivity Score
    </h3>

    <h1>
        {dashboard.productivityScore}/100
    </h1>

    <div className="score-bar">

        <div
            className="score-fill"
            style={{
                width:
                `${dashboard.productivityScore}%`
            }}
        />

    </div>

</div>
{overdueTasks.length > 0 && (

<div className="overdue-card">

    <h3>
        🚨 Overdue Tasks
    </h3>

    <p>
        You have {overdueTasks.length}
        overdue task(s)
    </p>

    {overdueTasks.slice(0,3).map(task => (

        <div
            key={task.id}
            className="overdue-item"
        >
            <strong>
                ⚠️ {task.title}
            </strong>

            <p>
                Due: {task.dueDate}
            </p>

        </div>

    ))}

</div>

)}


<div className="calendar-card">

    <h3>
        🔥 Study Consistency
    </h3>

    <div className="calendar-grid">

        {calendarData.map(day => (

            <div
                key={day.date}
                className={
                    day.completed
                    ? "calendar-day active"
                    : "calendar-day"
                }
            />

        ))}

    </div>

</div>
<div
  className="dashboard-card"
  style={{
    background: "white",
    borderRadius: "20px",
    padding: "25px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
  }}
>                    <h3>📋 Total Tasks</h3>
<h2
  style={{
    color: "#7C3AED",
    fontSize: "2.5rem",
    marginTop: "10px"
  }}
>
{dashboard.totalTasks}
</h2>                </div>

<div
  className="dashboard-card"
  style={{
    background: "white",
    borderRadius: "20px",
    padding: "25px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
  }}
>                    <h3>📅 Planned</h3>
                   <h2
  style={{
    color: "#7C3AED",
    fontSize: "2.5rem",
    marginTop: "10px"
  }}
>
 {dashboard.planned}</h2>
                </div>

<div
  className="dashboard-card"
  style={{
    background: "white",
    borderRadius: "20px",
    padding: "25px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
  }}
>                   <h3>🚀 In Progress</h3>
                    <h2
  style={{
    color: "#7C3AED",
    fontSize: "2.5rem",
    marginTop: "10px"
  }}
>{dashboard.inProgressTasks}</h2>
                </div>

<div
  className="dashboard-card"
  style={{
    background: "white",
    borderRadius: "20px",
    padding: "25px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
  }}
>                   <h3>✅ Completed</h3>
                   <h2
  style={{
    color: "#7C3AED",
    fontSize: "2.5rem",
    marginTop: "10px"
  }}
>
 {dashboard.completedTask}</h2>
                </div>

<div className="dashboard-card completion-card">
    <h3>📈 Completion %</h3>
    <h2>{dashboard.completionPercentage}%</h2>
</div>

            </div>

            <div className="dashboard-actions">

                <Link to="/create-task">
<button
  style={{
    background: "#7C3AED",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600"
  }}
>                        Create Task
                    </button>
                </Link>

                <Link to="/tasks">
<button
  style={{
    background: "#EC4899",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600"
  }}
>                        View Tasks
                    </button>
                </Link>

               <Button
  variant="contained"
  sx={{
    background: "#111827",
    borderRadius: "12px"
  }}
  onClick={() => navigate("/analytics")}
>
  Analytics
</Button>

            </div>
            <PomodoroTimer />

        </div>
    );
};

export default Dashboard;