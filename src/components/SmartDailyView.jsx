import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    CircularProgress
} from "@mui/material";

import { getDailySummary } from "../services/dailySummaryService";

const SmartDailyView = () => {

    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSummary();
    }, []);

    const loadSummary = async () => {
        try {
            const response = await getDailySummary();
            setSummary(response.data);
        } catch (error) {
            console.error("DAILY SUMMARY ERROR:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box className="smart-daily-loading">
                <CircularProgress />
            </Box>
        );
    }

    if (!summary) {
        return (
            <Typography className="smart-daily-error">
                Unable to load today's summary.
            </Typography>
        );
    }

    return (
        <Box className="smart-daily-view">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <Box className="smart-daily-header">

                <Typography
                    variant="h4"
                    fontWeight="bold"
                    className="smart-daily-title"
                >
                    Your Day at a Glance ✨
                </Typography>

                <Typography
                    variant="body1"
                    className="smart-daily-subtitle"
                >
                    Stay organized, focus on what matters, and keep moving forward.
                </Typography>

            </Box>


            {/* =================================================
                SUMMARY STATISTICS
            ================================================= */}

            <Grid
                container
                spacing={2}
                className="smart-daily-stats"
            >

                {/* OVERDUE */}

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card className="smart-stat-card overdue-stat">
                        <CardContent>

                            <Typography
                                variant="h6"
                                className="smart-stat-title"
                            >
                                🔴 Overdue
                            </Typography>

                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                className="smart-stat-number"
                            >
                                {summary.overdueTasks.length}
                            </Typography>

                        </CardContent>
                    </Card>
                </Grid>


                {/* TODAY */}

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card className="smart-stat-card today-stat">
                        <CardContent>

                            <Typography
                                variant="h6"
                                className="smart-stat-title"
                            >
                                📅 Today
                            </Typography>

                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                className="smart-stat-number"
                            >
                                {summary.todayTasks.length}
                            </Typography>

                        </CardContent>
                    </Card>
                </Grid>


                {/* HIGH PRIORITY */}

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card className="smart-stat-card priority-stat">
                        <CardContent>

                            <Typography
                                variant="h6"
                                className="smart-stat-title"
                            >
                                🔥 High Priority
                            </Typography>

                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                className="smart-stat-number"
                            >
                                {summary.highPriorityTasks.length}
                            </Typography>

                        </CardContent>
                    </Card>
                </Grid>


                {/* COMPLETED */}

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card className="smart-stat-card completed-stat">
                        <CardContent>

                            <Typography
                                variant="h6"
                                className="smart-stat-title"
                            >
                                ✅ Completed
                            </Typography>

                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                className="smart-stat-number"
                            >
                                {summary.completedTodayTasks.length}
                            </Typography>

                        </CardContent>
                    </Card>
                </Grid>

            </Grid>


            {/* =================================================
                TODAY'S TASKS
            ================================================= */}

            <Card className="smart-task-card today-tasks-card">

                <CardContent>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        className="smart-task-title"
                    >
                        📅 Today's Tasks
                    </Typography>

                    {summary.todayTasks.length === 0 ? (

                        <Typography className="smart-empty-message">
                            No tasks scheduled for today 🎉
                        </Typography>

                    ) : (

                        summary.todayTasks.map((task) => (

                            <Box
                                key={task.id}
                                className="smart-task-item"
                            >

                                <Typography
                                    fontWeight="bold"
                                    className="smart-task-name"
                                >
                                    {task.title}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    className="smart-task-priority"
                                >
                                    Priority: {task.priority}
                                </Typography>

                            </Box>

                        ))
                    )}

                </CardContent>

            </Card>


            {/* =================================================
                TOMORROW
            ================================================= */}

            <Card className="smart-task-card tomorrow-tasks-card">

                <CardContent>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        className="smart-task-title"
                    >
                        📆 Tomorrow
                    </Typography>

                    {summary.tomorrowTasks.length === 0 ? (

                        <Typography className="smart-empty-message">
                            No tasks scheduled for tomorrow.
                        </Typography>

                    ) : (

                        summary.tomorrowTasks.map((task) => (

                            <Box
                                key={task.id}
                                className="smart-task-item"
                            >

                                <Typography
                                    fontWeight="bold"
                                    className="smart-task-name"
                                >
                                    {task.title}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    className="smart-task-priority"
                                >
                                    Priority: {task.priority}
                                </Typography>

                            </Box>

                        ))
                    )}

                </CardContent>

            </Card>

        </Box>
    );
};

export default SmartDailyView;