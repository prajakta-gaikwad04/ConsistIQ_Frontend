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
    getCompletionDates
} from "../services/analyticsService";
import { getAchievements }
from "../services/analyticsService";
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
    const loadAchievements = async () => {

    try {

        const response =
            await getAchievements();

        setAchievements(response.data);

    } catch (error) {

        console.log(error);
    }
};


    useEffect(() => {
        loadAnalytics();

    loadAchievements();
    }, []);
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

const calendarStart = startOfWeek(startOfMonth(currentMonth));
const calendarEnd = endOfWeek(endOfMonth(currentMonth));

const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
});

const isCompleted = (date) => {
    return completionDates.includes(
        format(date, "yyyy-MM-dd")
    );
};
    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 5
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    const glassCard = {
  background: "rgba(255,255,255,0.12)",
  backdropFilter: "blur(16px)",
  borderRadius: "20px",
  color: "#fff",
  boxShadow: "0 8px 25px rgba(0,0,0,0.25)"
};


    return (
<Container
  maxWidth="xl"
  sx={{
    minHeight: "100vh",
    py: 4,
    background:
      "linear-gradient(135deg,#1f1c2c 0%, #928dab 100%)"
  }}
>
      <Typography
  variant="h3"
  fontWeight="bold"
  sx={{
    color: "#fff",
    mb: 4,
    textAlign: "center"
  }}
>
  📊 ConsistIQ Analytics
</Typography>

            {/* STATS CARDS */}

            <Grid container spacing={2} sx={{ mb: 4 }}>

                <Grid size={{ xs: 12, md: 3 }}>
                  <Card sx={glassCard}>
                        <CardContent>
                            <Typography variant="h6">
                                Total Tasks
                            </Typography>

                           <Typography
  variant="h4"
  fontWeight="bold"
  sx={{ color: "#ffd166" }}
>
  {stats.totalTasks}
</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                     <Card sx={glassCard}>
                        <CardContent>
                            <Typography variant="h6">
                                Completed
                            </Typography>

                                                       <Typography
  variant="h4"
  fontWeight="bold"
  sx={{ color: "#06d6a0" }}
>
  {stats.completedTasks}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <Card sx={glassCard}>
                        <CardContent>
                            <Typography variant="h6">
                                Planned
                            </Typography>

                                                       <Typography
  variant="h4"
  fontWeight="bold"
  sx={{ color: "#f4a261" }}
>
  {stats.pendingTasks}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <Card sx={glassCard}>
                        <CardContent>
                            <Typography variant="h6">
                                Overdue
                            </Typography>

                                                       <Typography
  variant="h4"
  fontWeight="bold"
  sx={{ color: "#ef476f" }}
>
  {stats.overdueTasks}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>

            {/* COMPLETION RATE */}

           <Card
  sx={{
    ...glassCard,
    textAlign: "center",
    mb: 4
  }}
>
                <CardContent>

                    <Typography variant="h6">
                        Completion Rate
                    </Typography>

                  <Typography
  variant="h2"
  fontWeight="bold"
  sx={{ color: "#06d6a0" }}
>
  {stats.completionRate}%
</Typography>

                </CardContent>
            </Card>
<Box
    sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
        mb: 3
    }}
>
    <Button
        variant="outlined"
        onClick={previousMonth}
        sx={{ color: "#fff", borderColor: "#fff" }}
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
            padding: "10px",
            borderRadius: "8px",
            fontSize: "16px"
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
            <option key={index} value={index}>
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
            padding: "10px",
            borderRadius: "8px",
            fontSize: "16px"
        }}
    >
        {Array.from({ length: 11 }, (_, i) => {
            const year = new Date().getFullYear() - 5 + i;

            return (
                <option key={year} value={year}>
                    {year}
                </option>
            );
        })}
    </select>

    <Button
        variant="outlined"
        onClick={nextMonth}
        sx={{ color: "#fff", borderColor: "#fff" }}
    >
        →
    </Button>
</Box>
<Card
    sx={{
        ...glassCard,
        mb: 4
    }}
>
    <CardContent>

        <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
                textAlign: "center",
                mb: 3
            }}
        >
            📅 Calendar
        </Typography>

        {/* WEEKDAYS */}
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 1,
                mb: 1
            }}
        >
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day) => (
                    <Box
                        key={day}
                        sx={{
                            textAlign: "center",
                            fontWeight: "bold",
                            color: "#fff",
                            p: 1
                        }}
                    >
                        {day}
                    </Box>
                )
            )}
        </Box>

        {/* CALENDAR DAYS */}
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 1
            }}
        >
            {calendarDays.map((date) => {

                const completed = isCompleted(date);
                const today = isToday(date);
                const sameMonth = isSameMonth(
                    date,
                    currentMonth
                );

                return (
                    <Box
                        key={date.toISOString()}
                        sx={{
                            minHeight: { xs: 45, sm: 60 },
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "10px",

                            backgroundColor: completed
                                ? "#06d6a0"
                                : sameMonth
                                ? "rgba(255,255,255,0.10)"
                                : "rgba(255,255,255,0.03)",

                            border: today
                                ? "2px solid #ffd166"
                                : "1px solid rgba(255,255,255,0.08)",

                            color: sameMonth
                                ? "#fff"
                                : "rgba(255,255,255,0.3)",

                            fontWeight: completed || today
                                ? "bold"
                                : "normal",

                            transition: "0.2s",

                            "&:hover": {
                                backgroundColor: completed
                                    ? "#06d6a0"
                                    : "rgba(255,255,255,0.2)"
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                    sx={{
                        width: 14,
                        height: 14,
                        borderRadius: "4px",
                        backgroundColor: "#06d6a0"
                    }}
                />
                <Typography variant="body2">
                    Completed
                </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                    sx={{
                        width: 14,
                        height: 14,
                        borderRadius: "4px",
                        border: "2px solid #ffd166"
                    }}
                />
                <Typography variant="body2">
                    Today
                </Typography>
            </Box>
        </Box>

    </CardContent>
</Card>
            {/* STREAK */}

            <Card sx={{ mb: 4 }}>
                <CardContent>

                    <Typography variant="h6">
                       🔥 Productivity Streak
                    </Typography>

                   <Typography
  variant="h3"
  fontWeight="bold"
  sx={{ color: "#ff6b6b" }}
>
  🔥 {streak.currentStreak}
</Typography>

                    <Typography>
                        Best Streak: {streak.bestStreak} Days
                    </Typography>

                </CardContent>
            </Card>

            {/* WEEKLY CHART */}

          <Card
  sx={{
    ...glassCard,
    mb: 4
  }}
>
                <CardContent>

                    <Typography
                        variant="h6"
                        gutterBottom
                    >
                        Weekly Productivity
                    </Typography>

                    <ResponsiveContainer
                        width="100%"
                        height={300}
                    >
                        <BarChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" />
                            <YAxis />
                            <Tooltip />
                            <Bar
  dataKey="value"
  fill="#ff6b6b"
/>
                        </BarChart>
                    </ResponsiveContainer>

                </CardContent>
            </Card>

            {/* MONTHLY CHART */}

            <Card sx={{ mb: 4 }}>
                <CardContent>

                    <Typography
                        variant="h6"
                        gutterBottom
                    >
                        Monthly Productivity
                    </Typography>

                    <ResponsiveContainer
                        width="100%"
                        height={300}
                    >
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" />
                            <YAxis />
                            <Tooltip />
<Bar
  dataKey="value"
  fill="#ffd166"
/>                        </BarChart>
                    </ResponsiveContainer>

                </CardContent>
            </Card>


<Card
  sx={{
    ...glassCard,
    mb: 4
  }}
>
  <CardContent>

    <Typography
      variant="h5"
      gutterBottom
      fontWeight="bold"
    >
      🏆 Achievements
    </Typography>

    <Grid container spacing={2}>

      {achievements.map((a) => (

        <Grid
          key={a.title}
          size={{ xs: 6, md: 3 }}
        >
          <Card
            sx={{
              textAlign: "center",
              p: 2,
              background: a.unlocked
                ? "rgba(255,255,255,0.15)"
                : "rgba(255,255,255,0.05)",
              border: a.unlocked
                ? "2px solid #FFD166"
                : "1px solid rgba(255,255,255,0.1)"
            }}
          >

            <Typography variant="h3">
              {a.icon}
            </Typography>

            <Typography
              variant="body1"
              fontWeight="bold"
              sx={{ color: "#fff" }}
            >
              {a.title}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: a.unlocked
                  ? "#06d6a0"
                  : "#ccc"
              }}
            >
              {a.unlocked
                ? "Unlocked"
                : "Locked"}
            </Typography>

          </Card>
        </Grid>

      ))}

    </Grid>

  </CardContent>
</Card>


        </Container>
    );
};

export default Analytics;