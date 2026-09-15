import React, { useEffect, useState } from "react";

import {
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    Box,
    Button
} from "@mui/material";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts";

import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isToday
} from "date-fns";

import {
    getStats,
    getWeeklyChart,
    getMonthlyChart,
    getStreak,
    getCompletionDates,
    getAchievements
} from "../services/analyticsService";


const Analytics = () => {

    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        overdueTasks: 0,
        completionRate: 0
    });

    const [achievements, setAchievements] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);

    const [streak, setStreak] = useState({
        currentStreak: 0,
        bestStreak: 0
    });

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [completionDates, setCompletionDates] = useState([]);


    /* =========================
       LOAD ACHIEVEMENTS
    ========================= */

    const loadAchievements = async () => {
        try {
            const response = await getAchievements();
            setAchievements(response.data);
        } catch (error) {
            console.log(error);
        }
    };


    /* =========================
       INITIAL LOAD
    ========================= */

    useEffect(() => {
        loadAnalytics();
        loadAchievements();
    }, []);


    /* =========================
       CALENDAR LOAD
    ========================= */

    useEffect(() => {
        loadCalendar(currentMonth);
    }, [currentMonth]);


    const loadCalendar = async (month) => {
        try {

            const start = startOfMonth(month);
            const end = endOfMonth(month);

            const response = await getCompletionDates(
                format(start, "yyyy-MM-dd"),
                format(end, "yyyy-MM-dd")
            );

            setCompletionDates(response.data);

        } catch (error) {
            console.log("CALENDAR ERROR:", error);
        }
    };


    /* =========================
       ANALYTICS DATA
    ========================= */

    const loadAnalytics = async () => {

        try {

            setLoading(true);

            const [
                statsRes,
                weeklyRes,
                monthlyRes,
                streakRes
            ] = await Promise.all([
                getStats(),
                getWeeklyChart(),
                getMonthlyChart(),
                getStreak()
            ]);

            setStats(statsRes.data);
            setWeeklyData(weeklyRes.data);
            setMonthlyData(monthlyRes.data);
            setStreak(streakRes.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }
    };


    /* =========================
       MONTH NAVIGATION
    ========================= */

    const previousMonth = () => {

        setCurrentMonth(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() - 1,
                1
            )
        );

    };


    const nextMonth = () => {

        setCurrentMonth(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1,
                1
            )
        );

    };


    /* =========================
       CALENDAR
    ========================= */

    const calendarStart =
        startOfWeek(startOfMonth(currentMonth));

    const calendarEnd =
        endOfWeek(endOfMonth(currentMonth));

    const calendarDays =
        eachDayOfInterval({
            start: calendarStart,
            end: calendarEnd
        });


    const isCompleted = (date) => {

        return completionDates.includes(
            format(date, "yyyy-MM-dd")
        );

    };


    /* =========================
       LOADING
    ========================= */

    if (loading) {

        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#f5f7fb"
                }}
            >
                <CircularProgress />
            </Box>
        );

    }


    /* =========================
       COMMON STYLES
    ========================= */

    const sectionTitle = {
        fontWeight: 800,
        color: "#172033"
    };


    const chartTooltip = {
        borderRadius: "12px",
        border: "none",
        boxShadow: "0 8px 25px rgba(0,0,0,0.12)"
    };


    return (

        <Box
            sx={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg, #f7f9fc 0%, #eef4ff 100%)",
                py: { xs: 2, sm: 3, md: 4 }
            }}
        >

            <Container maxWidth="xl">


                {/* =====================================
                    HEADER
                ====================================== */}

                <Box
                    sx={{
                        mb: { xs: 3, md: 4 },
                        textAlign: { xs: "center", md: "left" }
                    }}
                >

                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 900,
                            color: "#172033",
                            fontSize: {
                                xs: "2rem",
                                sm: "2.5rem",
                                md: "3rem"
                            },
                            letterSpacing: "-1px"
                        }}
                    >
                        📊 ConsistIQ Analytics
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1,
                            color: "#64748b",
                            fontSize: {
                                xs: "0.9rem",
                                sm: "1rem"
                            }
                        }}
                    >
                        Understand your productivity, track your progress,
                        and stay consistent.
                    </Typography>

                </Box>


                {/* =====================================
                    STAT CARDS
                ====================================== */}

                <Grid
                    container
                    spacing={{ xs: 2, md: 2.5 }}
                    sx={{ mb: 3 }}
                >

                    {/* TOTAL */}

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>

                        <Card
                            sx={{
                                height: "100%",
                                borderRadius: "20px",
                                background:
                                    "linear-gradient(135deg,#2563eb,#4f8cff)",
                                color: "#fff",
                                border: "none",
                                boxShadow:
                                    "0 12px 30px rgba(37,99,235,0.20)"
                            }}
                        >

                            <CardContent sx={{ p: 3 }}>

                                <Box
                                    sx={{
                                        width: 45,
                                        height: 45,
                                        borderRadius: "14px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background:
                                            "rgba(255,255,255,0.18)",
                                        fontSize: "22px",
                                        mb: 2
                                    }}
                                >
                                    📋
                                </Box>

                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        opacity: 0.9
                                    }}
                                >
                                    Total Tasks
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: "2.1rem",
                                        fontWeight: 900,
                                        mt: 0.5
                                    }}
                                >
                                    {stats.totalTasks}
                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>


                    {/* COMPLETED */}

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>

                        <Card
                            sx={{
                                height: "100%",
                                borderRadius: "20px",
                                background:
                                    "linear-gradient(135deg,#059669,#22c55e)",
                                color: "#fff",
                                border: "none",
                                boxShadow:
                                    "0 12px 30px rgba(16,185,129,0.20)"
                            }}
                        >

                            <CardContent sx={{ p: 3 }}>

                                <Box
                                    sx={{
                                        width: 45,
                                        height: 45,
                                        borderRadius: "14px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background:
                                            "rgba(255,255,255,0.18)",
                                        fontSize: "22px",
                                        mb: 2
                                    }}
                                >
                                    ✅
                                </Box>

                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        opacity: 0.9
                                    }}
                                >
                                    Completed
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: "2.1rem",
                                        fontWeight: 900,
                                        mt: 0.5
                                    }}
                                >
                                    {stats.completedTasks}
                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>


                    {/* PLANNED */}

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>

                        <Card
                            sx={{
                                height: "100%",
                                borderRadius: "20px",
                                background:
                                    "linear-gradient(135deg,#f59e0b,#f97316)",
                                color: "#fff",
                                border: "none",
                                boxShadow:
                                    "0 12px 30px rgba(245,158,11,0.20)"
                            }}
                        >

                            <CardContent sx={{ p: 3 }}>

                                <Box
                                    sx={{
                                        width: 45,
                                        height: 45,
                                        borderRadius: "14px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background:
                                            "rgba(255,255,255,0.18)",
                                        fontSize: "22px",
                                        mb: 2
                                    }}
                                >
                                    📝
                                </Box>

                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        opacity: 0.9
                                    }}
                                >
                                    Planned
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: "2.1rem",
                                        fontWeight: 900,
                                        mt: 0.5
                                    }}
                                >
                                    {stats.pendingTasks}
                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>


                    {/* OVERDUE */}

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>

                        <Card
                            sx={{
                                height: "100%",
                                borderRadius: "20px",
                                background:
                                    "linear-gradient(135deg,#dc2626,#f43f5e)",
                                color: "#fff",
                                border: "none",
                                boxShadow:
                                    "0 12px 30px rgba(239,68,68,0.20)"
                            }}
                        >

                            <CardContent sx={{ p: 3 }}>

                                <Box
                                    sx={{
                                        width: 45,
                                        height: 45,
                                        borderRadius: "14px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background:
                                            "rgba(255,255,255,0.18)",
                                        fontSize: "22px",
                                        mb: 2
                                    }}
                                >
                                    ⚠️
                                </Box>

                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        opacity: 0.9
                                    }}
                                >
                                    Overdue
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: "2.1rem",
                                        fontWeight: 900,
                                        mt: 0.5
                                    }}
                                >
                                    {stats.overdueTasks}
                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>

                </Grid>


                {/* =====================================
                    COMPLETION RATE
                ====================================== */}

                <Card
                    sx={{
                        mb: 3,
                        borderRadius: "22px",
                        background:
                            "linear-gradient(135deg,#7c3aed,#a855f7)",
                        color: "#fff",
                        border: "none",
                        overflow: "hidden",
                        position: "relative",
                        boxShadow:
                            "0 14px 35px rgba(124,58,237,0.20)"
                    }}
                >

                    <CardContent
                        sx={{
                            p: { xs: 3, md: 4 },
                            textAlign: "center"
                        }}
                    >

                        <Typography
                            sx={{
                                fontWeight: 700,
                                opacity: 0.9
                            }}
                        >
                            🎯 Overall Completion Rate
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: {
                                    xs: "3rem",
                                    md: "4rem"
                                },
                                fontWeight: 900,
                                lineHeight: 1.1,
                                mt: 1
                            }}
                        >
                            {stats.completionRate}%
                        </Typography>

                        <Typography
                            sx={{
                                mt: 1,
                                opacity: 0.8,
                                fontSize: "0.9rem"
                            }}
                        >
                            Keep going — consistency creates progress.
                        </Typography>

                    </CardContent>

                </Card>


                {/* =====================================
                    CALENDAR HEADER
                ====================================== */}

                <Card
                    sx={{
                        mb: 3,
                        borderRadius: "22px",
                        background: "#ffffff",
                        border: "1px solid #e5eaf2",
                        boxShadow:
                            "0 8px 30px rgba(15,23,42,0.07)"
                    }}
                >

                    <CardContent
                        sx={{
                            p: { xs: 2, sm: 3 }
                        }}
                    >

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 2,
                                flexWrap: "wrap",
                                mb: 3
                            }}
                        >

                            <Box>

                                <Typography
                                    variant="h5"
                                    sx={sectionTitle}
                                >
                                    📅 Productivity Calendar
                                </Typography>

                                <Typography
                                    sx={{
                                        color: "#64748b",
                                        fontSize: "0.85rem",
                                        mt: 0.5
                                    }}
                                >
                                    Your completed days at a glance
                                </Typography>

                            </Box>


                            {/* MONTH CONTROLS */}

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    flexWrap: "wrap"
                                }}
                            >

                                <Button
                                    onClick={previousMonth}
                                    sx={{
                                        minWidth: 40,
                                        height: 40,
                                        borderRadius: "10px",
                                        background: "#eef2ff",
                                        color: "#4f46e5",
                                        fontWeight: 800,
                                        "&:hover": {
                                            background: "#e0e7ff"
                                        }
                                    }}
                                >
                                    ←
                                </Button>


                                <select
                                    value={currentMonth.getMonth()}
                                    onChange={(e) => {

                                        setCurrentMonth(
                                            new Date(
                                                currentMonth.getFullYear(),
                                                Number(e.target.value),
                                                1
                                            )
                                        );

                                    }}
                                    style={{
                                        padding: "9px 12px",
                                        borderRadius: "10px",
                                        border: "1px solid #dbe2ea",
                                        background: "#fff",
                                        color: "#334155",
                                        fontWeight: "600",
                                        outline: "none"
                                    }}
                                >

                                    {[
                                        "January",
                                        "February",
                                        "March",
                                        "April",
                                        "May",
                                        "June",
                                        "July",
                                        "August",
                                        "September",
                                        "October",
                                        "November",
                                        "December"
                                    ].map((month, index) => (

                                        <option
                                            key={index}
                                            value={index}
                                        >
                                            {month}
                                        </option>

                                    ))}

                                </select>


                                <select
                                    value={currentMonth.getFullYear()}
                                    onChange={(e) => {

                                        setCurrentMonth(
                                            new Date(
                                                Number(e.target.value),
                                                currentMonth.getMonth(),
                                                1
                                            )
                                        );

                                    }}
                                    style={{
                                        padding: "9px 12px",
                                        borderRadius: "10px",
                                        border: "1px solid #dbe2ea",
                                        background: "#fff",
                                        color: "#334155",
                                        fontWeight: "600",
                                        outline: "none"
                                    }}
                                >

                                    {Array.from(
                                        { length: 11 },
                                        (_, i) => {

                                            const year =
                                                new Date().getFullYear() -
                                                5 +
                                                i;

                                            return (
                                                <option
                                                    key={year}
                                                    value={year}
                                                >
                                                    {year}
                                                </option>
                                            );

                                        }
                                    )}

                                </select>


                                <Button
                                    onClick={nextMonth}
                                    sx={{
                                        minWidth: 40,
                                        height: 40,
                                        borderRadius: "10px",
                                        background: "#eef2ff",
                                        color: "#4f46e5",
                                        fontWeight: 800,
                                        "&:hover": {
                                            background: "#e0e7ff"
                                        }
                                    }}
                                >
                                    →
                                </Button>

                            </Box>

                        </Box>


                        {/* WEEKDAYS */}

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(7, minmax(0, 1fr))",
                                gap: { xs: 0.5, sm: 1 },
                                mb: 1
                            }}
                        >

                            {[
                                "Sun",
                                "Mon",
                                "Tue",
                                "Wed",
                                "Thu",
                                "Fri",
                                "Sat"
                            ].map((day) => (

                                <Box
                                    key={day}
                                    sx={{
                                        textAlign: "center",
                                        fontWeight: 800,
                                        color: "#64748b",
                                        fontSize: {
                                            xs: "0.65rem",
                                            sm: "0.8rem"
                                        },
                                        py: 1
                                    }}
                                >
                                    {day}
                                </Box>

                            ))}

                        </Box>


                        {/* DAYS */}

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(7, minmax(0, 1fr))",
                                gap: { xs: 0.5, sm: 1 }
                            }}
                        >

                            {calendarDays.map((date) => {

                                const completed =
                                    isCompleted(date);

                                const today =
                                    isToday(date);

                                const sameMonth =
                                    isSameMonth(
                                        date,
                                        currentMonth
                                    );

                                return (

                                    <Box
                                        key={date.toISOString()}
                                        sx={{
                                            minHeight: {
                                                xs: 38,
                                                sm: 55,
                                                md: 62
                                            },

                                            display: "flex",
                                            justifyContent:
                                                "center",
                                            alignItems:
                                                "center",

                                            borderRadius: {
                                                xs: "8px",
                                                sm: "12px"
                                            },

                                            background:
                                                completed
                                                    ? "linear-gradient(135deg,#10b981,#34d399)"
                                                    : sameMonth
                                                    ? "#f8fafc"
                                                    : "#f1f5f9",

                                            color:
                                                completed
                                                    ? "#ffffff"
                                                    : sameMonth
                                                    ? "#334155"
                                                    : "#cbd5e1",

                                            border:
                                                today
                                                    ? "2px solid #f59e0b"
                                                    : "1px solid #e5eaf2",

                                            fontWeight:
                                                completed ||
                                                today
                                                    ? 800
                                                    : 500,

                                            fontSize: {
                                                xs: "0.7rem",
                                                sm: "0.85rem"
                                            },

                                            transition:
                                                "all 0.2s ease",

                                            "&:hover": {
                                                transform:
                                                    "translateY(-2px)",
                                                boxShadow:
                                                    "0 5px 12px rgba(15,23,42,0.10)"
                                            }
                                        }}
                                    >
                                        {format(date, "d")}
                                    </Box>

                                );

                            })}

                        </Box>


                        {/* LEGEND */}

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 3,
                                mt: 3,
                                flexWrap: "wrap"
                            }}
                        >

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1
                                }}
                            >

                                <Box
                                    sx={{
                                        width: 13,
                                        height: 13,
                                        borderRadius: "4px",
                                        background:
                                            "#10b981"
                                    }}
                                />

                                <Typography
                                    sx={{
                                        color: "#64748b",
                                        fontSize: "0.8rem"
                                    }}
                                >
                                    Completed
                                </Typography>

                            </Box>


                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1
                                }}
                            >

                                <Box
                                    sx={{
                                        width: 13,
                                        height: 13,
                                        borderRadius: "4px",
                                        border:
                                            "2px solid #f59e0b"
                                    }}
                                />

                                <Typography
                                    sx={{
                                        color: "#64748b",
                                        fontSize: "0.8rem"
                                    }}
                                >
                                    Today
                                </Typography>

                            </Box>

                        </Box>

                    </CardContent>

                </Card>


                {/* =====================================
                    PRODUCTIVITY STREAK
                ====================================== */}

                <Card
                    sx={{
                        mb: 3,
                        borderRadius: "22px",
                        background:
                            "linear-gradient(135deg,#fff7ed,#ffedd5)",
                        border:
                            "1px solid #fed7aa",
                        boxShadow:
                            "0 8px 25px rgba(249,115,22,0.10)"
                    }}
                >

                    <CardContent
                        sx={{
                            p: { xs: 2.5, sm: 3 }
                        }}
                    >

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                flexWrap: "wrap"
                            }}
                        >

                            <Box
                                sx={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: "18px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background:
                                        "linear-gradient(135deg,#f97316,#fb923c)",
                                    fontSize: "28px",
                                    boxShadow:
                                        "0 8px 18px rgba(249,115,22,0.25)"
                                }}
                            >
                                🔥
                            </Box>


                            <Box sx={{ flex: 1 }}>

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 800,
                                        color: "#9a3412"
                                    }}
                                >
                                    Productivity Streak
                                </Typography>

                                <Typography
                                    sx={{
                                        color: "#c2410c",
                                        fontSize: "0.85rem"
                                    }}
                                >
                                    Keep your momentum going!
                                </Typography>

                            </Box>


                            <Box
                                sx={{
                                    textAlign: {
                                        xs: "left",
                                        sm: "right"
                                    }
                                }}
                            >

                                <Typography
                                    sx={{
                                        fontSize: "2rem",
                                        fontWeight: 900,
                                        color: "#ea580c"
                                    }}
                                >
                                    {streak.currentStreak} 🔥
                                </Typography>

                                <Typography
                                    sx={{
                                        color: "#9a3412",
                                        fontSize: "0.8rem",
                                        fontWeight: 600
                                    }}
                                >
                                    Best: {streak.bestStreak} days
                                </Typography>

                            </Box>

                        </Box>

                    </CardContent>

                </Card>


                {/* =====================================
                    WEEKLY PRODUCTIVITY
                ====================================== */}

                <Card
                    sx={{
                        mb: 3,
                        borderRadius: "22px",
                        background: "#ffffff",
                        border: "1px solid #dbeafe",
                        boxShadow:
                            "0 8px 30px rgba(37,99,235,0.08)"
                    }}
                >

                    <CardContent
                        sx={{
                            p: { xs: 2, sm: 3 }
                        }}
                    >

                        <Box sx={{ mb: 2 }}>

                            <Typography
                                variant="h6"
                                sx={{
                                    ...sectionTitle,
                                    color: "#1d4ed8"
                                }}
                            >
                                📈 Weekly Productivity
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#64748b",
                                    fontSize: "0.82rem"
                                }}
                            >
                                Your productivity across the week
                            </Typography>

                        </Box>


                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >

                            <BarChart
                                data={weeklyData}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: -15,
                                    bottom: 5
                                }}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e5e7eb"
                                />

                                <XAxis
                                    dataKey="label"
                                    tick={{
                                        fill: "#64748b",
                                        fontSize: 12
                                    }}
                                />

                                <YAxis
                                    tick={{
                                        fill: "#64748b",
                                        fontSize: 12
                                    }}
                                />

                                <Tooltip
                                    contentStyle={
                                        chartTooltip
                                    }
                                />

                                <Bar
                                    dataKey="value"
                                    fill="#3b82f6"
                                    radius={[
                                        8,
                                        8,
                                        0,
                                        0
                                    ]}
                                    barSize={30}
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </CardContent>

                </Card>


                {/* =====================================
                    MONTHLY PRODUCTIVITY
                ====================================== */}

                <Card
                    sx={{
                        mb: 3,
                        borderRadius: "22px",
                        background: "#ffffff",
                        border: "1px solid #ccfbf1",
                        boxShadow:
                            "0 8px 30px rgba(20,184,166,0.08)"
                    }}
                >

                    <CardContent
                        sx={{
                            p: { xs: 2, sm: 3 }
                        }}
                    >

                        <Box sx={{ mb: 2 }}>

                            <Typography
                                variant="h6"
                                sx={{
                                    ...sectionTitle,
                                    color: "#0f766e"
                                }}
                            >
                                📊 Monthly Productivity
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#64748b",
                                    fontSize: "0.82rem"
                                }}
                            >
                                Track your progress throughout the month
                            </Typography>

                        </Box>


                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >

                            <BarChart
                                data={monthlyData}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: -15,
                                    bottom: 5
                                }}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e5e7eb"
                                />

                                <XAxis
                                    dataKey="label"
                                    tick={{
                                        fill: "#64748b",
                                        fontSize: 11
                                    }}
                                />

                                <YAxis
                                    tick={{
                                        fill: "#64748b",
                                        fontSize: 12
                                    }}
                                />

                                <Tooltip
                                    contentStyle={
                                        chartTooltip
                                    }
                                />

                                <Bar
                                    dataKey="value"
                                    fill="#14b8a6"
                                    radius={[
                                        8,
                                        8,
                                        0,
                                        0
                                    ]}
                                    barSize={30}
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </CardContent>

                </Card>


                {/* =====================================
                    ACHIEVEMENTS
                ====================================== */}

                <Card
                    sx={{
                        mb: 3,
                        borderRadius: "22px",
                        background:
                            "linear-gradient(135deg,#fffbeb,#fff7ed)",
                        border:
                            "1px solid #fde68a",
                        boxShadow:
                            "0 8px 30px rgba(245,158,11,0.10)"
                    }}
                >

                    <CardContent
                        sx={{
                            p: { xs: 2, sm: 3 }
                        }}
                    >

                        <Box sx={{ mb: 3 }}>

                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 900,
                                    color: "#92400e"
                                }}
                            >
                                🏆 Achievements
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#a16207",
                                    fontSize: "0.85rem",
                                    mt: 0.5
                                }}
                            >
                                Celebrate the milestones you have unlocked.
                            </Typography>

                        </Box>


                        <Grid
                            container
                            spacing={2}
                        >

                            {achievements.map((a) => (

                                <Grid
                                    key={a.title}
                                    size={{
                                        xs: 6,
                                        sm: 4,
                                        md: 3
                                    }}
                                >

                                    <Card
                                        sx={{
                                            height: "100%",
                                            textAlign: "center",
                                            p: { xs: 1.5, sm: 2 },
                                            borderRadius: "18px",

                                            background:
                                                a.unlocked
                                                    ? "#ffffff"
                                                    : "#f8fafc",

                                            border:
                                                a.unlocked
                                                    ? "2px solid #fbbf24"
                                                    : "1px solid #e2e8f0",

                                            opacity:
                                                a.unlocked
                                                    ? 1
                                                    : 0.6,

                                            boxShadow:
                                                a.unlocked
                                                    ? "0 8px 20px rgba(245,158,11,0.12)"
                                                    : "none",

                                            transition:
                                                "all 0.25s ease",

                                            "&:hover": {
                                                transform:
                                                    "translateY(-4px)"
                                            }
                                        }}
                                    >

                                        <Typography
                                            sx={{
                                                fontSize: {
                                                    xs: "2rem",
                                                    sm: "2.5rem"
                                                },
                                                mb: 1
                                            }}
                                        >
                                            {a.icon}
                                        </Typography>


                                        <Typography
                                            sx={{
                                                fontWeight: 800,
                                                color: "#334155",
                                                fontSize: {
                                                    xs: "0.75rem",
                                                    sm: "0.9rem"
                                                }
                                            }}
                                        >
                                            {a.title}
                                        </Typography>


                                        <Typography
                                            sx={{
                                                mt: 0.5,
                                                fontSize: "0.72rem",
                                                fontWeight: 700,
                                                color:
                                                    a.unlocked
                                                        ? "#16a34a"
                                                        : "#94a3b8"
                                            }}
                                        >
                                            {a.unlocked
                                                ? "✓ Unlocked"
                                                : "🔒 Locked"}
                                        </Typography>

                                    </Card>

                                </Grid>

                            ))}

                        </Grid>

                    </CardContent>

                </Card>

            </Container>

        </Box>
    );
};

export default Analytics;