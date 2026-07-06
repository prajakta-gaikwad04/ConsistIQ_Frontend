import React, { useEffect, useState } from "react";

import {
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    Box
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
    getStats,
    getWeeklyChart,
    getMonthlyChart,
    getStreak
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