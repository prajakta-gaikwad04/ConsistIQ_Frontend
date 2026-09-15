import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AddTaskIcon from "@mui/icons-material/AddTask";
import ChecklistIcon from "@mui/icons-material/Checklist";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BoltIcon from "@mui/icons-material/Bolt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { getDailyWords } from "../services/dailyWordsService";

import { getDashboardData } from "../services/dashboardService";
import { getUnreadCount } from "../services/NotificationService";
import Navbar from "../components/Navbar";
import {
    getOverdueTasks,
} from "../services/taskService";

import SmartDailyView from "../components/SmartDailyView";
import PomodoroTimer from "../components/PomodoroTimer";

import "../styles/dashboard.css";


const QUOTES = [
    {
        text: "The future depends on what you do today.",
        author: "Mahatma Gandhi",
    },
    {
        text: "Success is the sum of small efforts repeated day in and day out.",
        author: "Robert Collier",
    },
    {
        text: "Great things are done by a series of small things brought together.",
        author: "Vincent van Gogh",
    },
    {
        text: "The secret of getting ahead is getting started.",
        author: "Mark Twain",
    },
    {
        text: "It always seems impossible until it's done.",
        author: "Nelson Mandela",
    },
];


const DAILY_TIPS = [
    "Choose your most important task and complete it before smaller tasks.",
    "Break large tasks into smaller steps to make progress easier.",
    "Take short breaks to maintain your focus and energy.",
    "Start with one task instead of trying to do everything at once.",
    "Review your priorities before starting your work.",
    "Small progress every day creates meaningful results.",
    "Set a realistic target and focus on completing it.",
];


const EMPTY_DASHBOARD = {
    totalTasks: 0,
    planned: 0,
    inProgressTasks: 0,
    completedTask: 0,
    completionPercentage: 0,
    todayCompletedTasks: 0,
    dailyGoal: 0,
    productivityScore: 0,
};


function StatCard({
    icon,
    title,
    value,
    className = "",
}) {
    return (
        <div className={`metric-card ${className}`}>
            <div className="metric-icon">
                {icon}
            </div>

            <div className="metric-content">
                <span>{title}</span>
                <strong>{value}</strong>
            </div>

            <span className="metric-arrow">›</span>
        </div>
    );
}


function QuickAction({
    to,
    icon,
    title,
    description,
    className,
}) {
    return (
        <Link
            to={to}
            className={`quick-action ${className || ""}`}
        >
            <div className="quick-action-icon">
                {icon}
            </div>

            <div>
                <strong>{title}</strong>
                <span>{description}</span>
            </div>

            <span className="quick-action-arrow">›</span>
        </Link>
    );
}


const Dashboard = () => {

    const navigate = useNavigate();

    const [dashboard, setDashboard] =
        useState(EMPTY_DASHBOARD);

    const [isLoading, setIsLoading] =
        useState(true);

    const [loadError, setLoadError] =
        useState(null);

    const [unreadCount, setUnreadCount] =
        useState(0);

    const [dailyQuote, setDailyQuote] =
        useState({});

    const [dailyTip, setDailyTip] =
        useState("");

    const [overdueTasks, setOverdueTasks] =
        useState([]);

const [dailyWords, setDailyWords] = useState([]);
const [dailyWordsLoading, setDailyWordsLoading] = useState(true);
const [dailyWordsAvailable, setDailyWordsAvailable] = useState(true);
    useEffect(() => {

        const day =
            new Date().getDate();

        setDailyQuote(
            QUOTES[day % QUOTES.length]
        );

        setDailyTip(
            DAILY_TIPS[day % DAILY_TIPS.length]
        );

        loadDashboard();
        loadUnreadCount();
        loadOverdueTasks();

    }, []);
useEffect(() => {
    const loadDailyWords = async () => {
        try {
            setDailyWordsLoading(true);

            const response = await getDailyWords();

            const words = Array.isArray(response.data)
                ? response.data
                : [];

            setDailyWords(words.slice(0, 5));
            setDailyWordsAvailable(true);

        } catch (error) {
            console.error("Daily English Words unavailable:", error);

            // Important:
            // Daily Words must NEVER break the dashboard.
            setDailyWords([]);
            setDailyWordsAvailable(false);

        } finally {
            setDailyWordsLoading(false);
        }
    };

    loadDailyWords();
}, []);

    const loadDashboard = async () => {

        setIsLoading(true);

        try {

            const response =
                await getDashboardData();

            setDashboard(response.data);

            setLoadError(null);

        } catch (error) {

            console.error(
                "Failed to load dashboard:",
                error
            );

            setLoadError(
                "Unable to load your productivity data."
            );

        } finally {

            setIsLoading(false);

        }
    };


    const loadUnreadCount = async () => {

        try {

            const response =
                await getUnreadCount();

            setUnreadCount(response.data);

        } catch (error) {

            console.error(
                "Failed to load notifications:",
                error
            );

        }
    };


    const loadOverdueTasks = async () => {

        try {

            const response =
                await getOverdueTasks();

            setOverdueTasks(
                response.data || []
            );

        } catch (error) {

            console.error(
                "Failed to load overdue tasks:",
                error
            );

        }
    };


    const goalRemaining =
        Math.max(
            dashboard.dailyGoal -
            dashboard.todayCompletedTasks,
            0
        );


    const goalProgress =
        dashboard.dailyGoal > 0
            ? Math.min(
                (
                    dashboard.todayCompletedTasks /
                    dashboard.dailyGoal
                ) * 100,
                100
            )
            : 0;


    return (

        <div className="dashboard-page">

            {/* =================================
                TOP NAVIGATION
            ================================= */}

           
<Navbar />

            {/* =================================
                MAIN LAYOUT
            ================================= */}

            <div className="dashboard-layout">

                {/* =================================
                    SIDEBAR
                ================================= */}

                <aside className="dashboard-sidebar">

                    <div className="sidebar-brand-mobile">
                        <TrackChangesIcon />
                        <span>ConsistIQ</span>
                    </div>


                    <nav className="sidebar-navigation">

                        <Link
                            to="/dashboard"
                            className="sidebar-link active"
                        >
                            <DashboardIcon />
                            <span>Dashboard</span>
                        </Link>


                        <Link
                            to="/tasks"
                            className="sidebar-link"
                        >
                            <ChecklistIcon />
                            <span>Tasks</span>
                        </Link>


                        <Link
                            to="/create-task"
                            className="sidebar-link"
                        >
                            <AddTaskIcon />
                            <span>Create Task</span>
                        </Link>


                        <Link
                            to="/analytics"
                            className="sidebar-link"
                        >
                            <AnalyticsIcon />
                            <span>Analytics</span>
                        </Link>


                        <Link
                            to="/notifications"
                            className="sidebar-link"
                        >
                            <NotificationsNoneIcon />
                            <span>Notifications</span>

                            {unreadCount > 0 && (
                                <b className="sidebar-notification-count">
                                    {unreadCount}
                                </b>
                            )}

                        </Link>

                    </nav>


                    <div className="sidebar-bottom-card">

                        <BoltIcon />

                        <p>
                            Small steps every day
                            create big results.
                        </p>

                        <div className="sidebar-line" />

                    </div>

                </aside>


                {/* =================================
                    CONTENT
                ================================= */}

                <main className="dashboard-content">


                    {/* =================================
                        HERO
                    ================================= */}

                    <section className="dashboard-hero">

                        <div className="hero-icon">
                            <TrackChangesIcon />
                        </div>

                        <div className="hero-content">

                            <h1>
                                Your productivity snapshot ✨
                            </h1>

                            <p>
                                Organize your work, stay focused,
                                and make meaningful progress every day.
                            </p>

                        </div>

                        <div className="hero-decoration">
                            ✨
                        </div>

                    </section>


                    {/* ERROR */}

                    {loadError && (
                        <div className="dashboard-error">
                            {loadError}
                        </div>
                    )}


                    {/* =================================
                        DESKTOP GRID
                    ================================= */}

                    <div className="dashboard-main-grid">


                        {/* LEFT / CENTER */}

                        <div className="dashboard-primary">


                            {/* =================================
                                METRICS
                            ================================= */}

                            {isLoading ? (

                                <div className="metrics-grid">

                                    {Array.from({
                                        length: 5
                                    }).map((_, index) => (

                                        <div
                                            key={index}
                                            className="metric-skeleton"
                                        />

                                    ))}

                                </div>

                            ) : (

                                <div className="metrics-grid">

                                    {/* TODAY TARGET */}

                                    <div className="metric-card target-card">

                                        <div className="metric-icon">
                                            <TrackChangesIcon />
                                        </div>

                                        <div className="metric-content">

                                            <span>
                                                Today's target
                                            </span>

                                            <strong>
                                                {
                                                    dashboard.todayCompletedTasks
                                                }
                                                {" / "}
                                                {
                                                    dashboard.dailyGoal
                                                }
                                            </strong>

                                            <div className="mini-progress">

                                                <div
                                                    style={{
                                                        width:
                                                            `${goalProgress}%`
                                                    }}
                                                />

                                            </div>

                                            <small>
                                                {goalRemaining > 0
                                                    ? `${goalRemaining} tasks remaining`
                                                    : "Target achieved 🎉"
                                                }
                                            </small>

                                        </div>

                                    </div>


                                    {/* PRODUCTIVITY */}

                                    <div className="metric-card score-card">

                                        <div className="metric-icon">
                                            <BoltIcon />
                                        </div>

                                        <div className="metric-content">

                                            <span>
                                                Productivity score
                                            </span>

                                            <strong>
                                                {
                                                    dashboard.productivityScore
                                                }
                                                /100
                                            </strong>

                                            <div className="mini-progress">

                                                <div
                                                    style={{
                                                        width:
                                                            `${dashboard.productivityScore}%`
                                                    }}
                                                />

                                            </div>

                                            <small>
                                                Keep going! 💪
                                            </small>

                                        </div>

                                    </div>


                                    {/* NEEDS ATTENTION */}

                                    <div className="metric-card attention-card">

                                        <div className="metric-icon">
                                            <WarningAmberIcon />
                                        </div>

                                        <div className="metric-content">

                                            <span>
                                                Needs attention
                                            </span>

                                            <strong>
                                                {overdueTasks.length}
                                            </strong>

                                            <small>
                                                {overdueTasks.length === 1
                                                    ? "Overdue task"
                                                    : "Overdue tasks"
                                                }
                                            </small>

                                        </div>

                                    </div>


                                    {/* COMPLETED */}

                                    <div className="metric-card completed-card">

                                        <div className="metric-icon">
                                            <CheckCircleIcon />
                                        </div>

                                        <div className="metric-content">

                                            <span>
                                                Completed
                                            </span>

                                            <strong>
                                                {
                                                    dashboard.completedTask
                                                }
                                            </strong>

                                            <small>
                                                Overall completed
                                            </small>

                                        </div>

                                    </div>


                                    {/* COMPLETION */}

                                    <div className="metric-card completion-card">

                                        <div className="metric-icon">
                                            <BoltIcon />
                                        </div>

                                        <div className="metric-content">

                                            <span>
                                                Completion rate
                                            </span>

                                            <strong>
                                                {
                                                    dashboard.completionPercentage
                                                }%
                                            </strong>

                                            <div className="mini-progress">

                                                <div
                                                    style={{
                                                        width:
                                                            `${dashboard.completionPercentage}%`
                                                    }}
                                                />

                                            </div>

                                            <small>
                                                Overall task completion
                                            </small>

                                        </div>

                                    </div>

                                </div>

                            )}


                            {/* =================================
                                MOTIVATION + TIP
                            ================================= */}

                            <div className="info-grid">


                                <section className="info-card motivation-card">

                                    <div className="info-card-header">

                                        <span className="info-icon">
                                            “
                                        </span>

                                        <h2>
                                            Daily motivation
                                        </h2>

                                    </div>

                                    <blockquote>
                                        "{dailyQuote.text}"
                                    </blockquote>

                                    <p>
                                        — {dailyQuote.author}
                                    </p>

                                    <div className="quote-dots">
                                        <i className="active" />
                                        <i />
                                        <i />
                                    </div>

                                </section>


                                <section className="info-card tip-card">

                                    <div className="info-card-header">

                                        <span className="info-icon">
                                            💡
                                        </span>

                                        <h2>
                                            Daily focus tip
                                        </h2>

                                    </div>

                                    <p className="tip-text">
                                        {dailyTip}
                                    </p>

                                    <span className="tip-badge">
                                        Make it simple. Make it happen.
                                    </span>

                                </section>

                            </div>


                            {/* =================================
                                STATISTICS
                            ================================= */}

                            <div className="statistics-grid">

                                <StatCard
                                    icon={<ChecklistIcon />}
                                    title="Total tasks"
                                    value={dashboard.totalTasks}
                                    className="total-stat"
                                />

                                <StatCard
                                    icon={<CalendarMonthIcon />}
                                    title="Planned"
                                    value={dashboard.planned}
                                    className="planned-stat"
                                />

                                <StatCard
                                    icon={<AccessTimeIcon />}
                                    title="In progress"
                                    value={dashboard.inProgressTasks}
                                    className="progress-stat"
                                />

                                <StatCard
                                    icon={<CheckCircleIcon />}
                                    title="Completed"
                                    value={dashboard.completedTask}
                                    className="complete-stat"
                                />

                            </div>


                            {/* =================================
                                QUICK ACTIONS
                            ================================= */}

                            <section className="quick-actions-section">

                                <div className="section-heading">

                                    <BoltIcon />

                                    <div>
                                        <h2>
                                            Quick actions
                                        </h2>

                                        <p>
                                            Get things done faster.
                                        </p>
                                    </div>

                                </div>


                                <div className="quick-actions-grid">

                                    <QuickAction
                                        to="/create-task"
                                        icon={<AddTaskIcon />}
                                        title="Create Task"
                                        description="Add a new task"
                                        className="create-action"
                                    />


                                    <QuickAction
                                        to="/tasks"
                                        icon={<ChecklistIcon />}
                                        title="View Tasks"
                                        description="See all your tasks"
                                        className="tasks-action"
                                    />


                                    <QuickAction
                                        to="/analytics"
                                        icon={<AnalyticsIcon />}
                                        title="Analytics"
                                        description="Check your progress"
                                        className="analytics-action"
                                    />

                                </div>

                            </section>


                            {/* =================================
                                SMART DAILY VIEW
                            ================================= */}

                            <section className="smart-daily-section">
                                <SmartDailyView />
                            </section>


                            {/* =================================
                                FOCUS TIMER MOBILE
                            ================================= */}

                            <div className="mobile-focus-timer">

                                <div className="focus-header">

                                    <AccessTimeIcon />

                                    <div>
                                        <h2>
                                            Focus Timer
                                        </h2>

                                        <p>
                                            Work with focus.
                                            Take breaks.
                                        </p>
                                    </div>

                                </div>

                                <PomodoroTimer />

                            </div>


                        </div>


                        {/* =================================
                            RIGHT SIDEBAR
                        ================================= */}

<aside className="dashboard-right-column">


    {/* =================================
        FOCUS TIMER
    ================================= */}

    <section className="focus-timer-card">


        {/* Actual Pomodoro Timer */}
        <div className="real-timer">

            <PomodoroTimer />

        </div>

    </section>

{/* =================================
    QUICK OVERVIEW
================================= */}

                            {/* =================================
                                QUICK OVERVIEW
                            ================================= */}

                            <section className="overview-card">

                                <div className="right-section-title">

                                    <BoltIcon />

                                    <h2>
                                        Quick overview
                                    </h2>

                                </div>


                                <div className="overview-item">

                                    <span>
                                        🎯 Today's tasks
                                    </span>

                                    <strong>
                                        {
                                            dashboard.todayCompletedTasks
                                        }
                                        {" / "}
                                        {
                                            dashboard.dailyGoal
                                        }
                                    </strong>

                                </div>


                                <div className="overview-progress">

                                    <div
                                        style={{
                                            width:
                                                `${goalProgress}%`
                                        }}
                                    />

                                </div>


                                <div className="overview-item">
                                    <span>📅 Planned</span>
                                    <strong>
                                        {dashboard.planned}
                                    </strong>
                                </div>


                                <div className="overview-item">
                                    <span>🕐 In progress</span>
                                    <strong>
                                        {dashboard.inProgressTasks}
                                    </strong>
                                </div>


                                <div className="overview-item">
                                    <span>✅ Completed</span>
                                    <strong>
                                        {dashboard.completedTask}
                                    </strong>
                                </div>

                            </section>


                            {/* =================================
                                UPCOMING / ATTENTION
                            ================================= */}

                            <section className="upcoming-card">

                                <div className="right-section-title">

                                    <CalendarMonthIcon />

                                    <h2>
                                        Upcoming
                                    </h2>

                                    <Link to="/tasks">
                                        View all →
                                    </Link>

                                </div>


                                {overdueTasks.length > 0 ? (

                                    overdueTasks
                                        .slice(0, 3)
                                        .map((task) => (

                                            <div
                                                className="upcoming-item"
                                                key={task.id}
                                            >

                                                <span className="task-circle" />

                                                <div>

                                                    <strong>
                                                        {task.title}
                                                    </strong>

                                                    <small>
                                                        Due: {task.dueDate}
                                                    </small>

                                                </div>

                                            </div>

                                        ))

                                ) : (

                                    <div className="empty-upcoming">

                                        <CheckCircleIcon />

                                        <p>
                                            You're all caught up!
                                        </p>

                                    </div>

                                )}

                            </section>

{/* =================================
    DAILY ENGLISH WORDS
================================= */}

<section className="daily-words-card">

    <div className="daily-words-header">

        <div className="daily-words-icon">
            📚
        </div>

        <div>
            <h2>Daily English Words</h2>
            <p>5 useful words for today</p>
        </div>

    </div>


    {dailyWordsLoading ? (

        <div className="daily-words-loading">
            Loading today's words...
        </div>

    ) : !dailyWordsAvailable ? (

        <div className="daily-words-unavailable">
            <span>📖</span>

            <p>
                Daily words are temporarily unavailable.
            </p>

            <small>
                Your dashboard is still working normally.
            </small>
        </div>

    ) : dailyWords.length === 0 ? (

        <div className="daily-words-empty">
            <span>📚</span>

            <p>
                No words available yet.
            </p>
        </div>

    ) : (

        <div className="daily-words-list">

            {dailyWords.map((word, index) => (

                <div
                    className="daily-word-item"
                    key={word.id || `${word.word}-${index}`}
                >

                    <div className="daily-word-number">
                        {index + 1}
                    </div>

                    <div className="daily-word-content">

                        <strong>
                            {word.word}
                        </strong>

                        <span>
                            {word.meaning}
                        </span>

                        <small>
                            “{word.example}”
                        </small>

                    </div>

                </div>

            ))}

        </div>

    )}

</section>
                           

                        </aside>

                    </div>

                </main>

            </div>

        </div>
    );
};


export default Dashboard;