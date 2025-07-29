import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  Box
} from '@mui/material';
import {
  People as PeopleIcon,
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  Timeline as TimelineIcon,
  Visibility as VisibilityIcon,
  LocationOn as LocationOnIcon,
  Wc as WcIcon
} from '@mui/icons-material';
import axios from 'axios';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/analytics`
        );
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>No data available</Typography>
      </Container>
    );
  }

  const statCards = [
    {
      icon: <PeopleIcon fontSize="large" />,
      title: "Total Followers",
      value: data.followers?.data?.slice(-1)[0] || 0,
      color: "primary",
      trend: data.followers?.trend || 'neutral'
    },
    {
      icon: <ThumbUpIcon fontSize="large" />,
      title: "Total Likes",
      value: data.engagement?.likes?.reduce((a, b) => a + b, 0) || 0,
      color: "secondary",
      trend: data.engagement?.likesTrend || 'neutral'
    },
    {
      icon: <CommentIcon fontSize="large" />,
      title: "Total Comments",
      value: data.engagement?.comments?.reduce((a, b) => a + b, 0) || 0,
      color: "success",
      trend: data.engagement?.commentsTrend || 'neutral'
    },
    {
      icon: <ShareIcon fontSize="large" />,
      title: "Total Shares",
      value: data.engagement?.shares?.reduce((a, b) => a + b, 0) || 0,
      color: "warning",
      trend: data.engagement?.sharesTrend || 'neutral'
    },
    {
      icon: <TimelineIcon fontSize="large" />,
      title: "Total Reach",
      value: data.reach?.data?.reduce((a, b) => a + b, 0) || 0,
      color: "info",
      trend: data.reach?.trend || 'neutral'
    },
    {
      icon: <VisibilityIcon fontSize="large" />,
      title: "Total Impressions",
      value: data.impressions?.data?.reduce((a, b) => a + b, 0) || 0,
      color: "error",
      trend: data.impressions?.trend || 'neutral'
    },
    {
      icon: <VisibilityIcon fontSize="large" />,
      title: "Profile Views",
      value: data.profileViews?.data?.reduce((a, b) => a + b, 0) || 0,
      color: "success",
      trend: data.profileViews?.trend || 'neutral'
    }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      default: return '→';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        <TimelineIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        {process.env.REACT_APP_DASHBOARD_TITLE}
      </Typography>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: `${card.color}.light`,
                      color: `${card.color}.main`
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      {card.title}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h4">
                        {card.value.toLocaleString()}
                      </Typography>
                      <Typography 
                        color={
                          card.trend === 'up' ? 'success.main' : 
                          card.trend === 'down' ? 'error.main' : 'text.secondary'
                        }
                      >
                        {getTrendIcon(card.trend)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        {/* Follower Growth */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Follower Growth (Last 30 Days)
              </Typography>
              <Box sx={{ height: 400 }}>
                <LineChart
                  labels={data.followers?.labels || []}
                  values={data.followers?.data || []}
                  color="#3498db"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Reach Over Time */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Reach Over Time (Last 30 Days)
              </Typography>
              <Box sx={{ height: 400 }}>
                <LineChart
                  labels={data.reach?.labels || []}
                  values={data.reach?.data || []}
                  color="#e67e22"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Gender Distribution */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Audience Gender Distribution
              </Typography>
              <Box sx={{ height: 400 }}>
                <PieChart
                  data={(data.genderDistribution?.genders || []).map((gender, i) => ({
                    id: i,
                    value: data.genderDistribution?.counts?.[i] || 0,
                    label: gender
                  }))}
                  colors={['#36A2EB', '#FF6384', '#4BC0C0']}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Location Stats */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top User Locations
              </Typography>
              <Box sx={{ height: 400 }}>
                <PieChart
                  data={(data.locationStats?.locations || [])
                    .map((loc, i) => ({
                      id: i,
                      value: data.locationStats?.users?.[i] || 0,
                      label: loc
                    }))
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 5)}
                  colors={['#FF9F40', '#FFCD56', '#4BC0C0', '#9966FF', '#C9CBCF']}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Engagement Breakdown */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Engagement Breakdown (Last 30 Days)
              </Typography>
              <Box sx={{ height: 400 }}>
                <BarChart
                  labels={data.followers?.labels || []}
                  datasets={[
                    {
                      label: 'Likes',
                      data: data.engagement?.likes || [],
                      color: '#2ecc71'
                    },
                    {
                      label: 'Comments',
                      data: data.engagement?.comments || [],
                      color: '#3498db'
                    },
                    {
                      label: 'Shares',
                      data: data.engagement?.shares || [],
                      color: '#9b59b6'
                    }
                  ]}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;