import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  LinearProgress,
  Button,
  Card,
  Alert,
  Box,
  Skeleton,
  IconButton,
  Tooltip
} from '@mui/material';
import { Refresh as RefreshIcon, Info as InfoIcon } from '@mui/icons-material';
import api from '../services/api';
import StatCard from './StatCard';
import LineChart from './LineChart';
import BarChart from './BarChart';
import DoughnutChart from './DoughnutChart';

const DEFAULT_DATA = {
  followers: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [1000, 1200, 1300, 1400, 1500, 1700]
  },
  engagement: {
    likes: [120, 190, 130, 170, 150, 200],
    comments: [30, 40, 35, 45, 40, 50],
    shares: [10, 15, 12, 18, 15, 20]
  },
  demographics: {
    age: [25, 30, 35, 40, 45],
    count: [300, 500, 400, 200, 100]
  }
};

const Dashboard = () => {
  const [data, setData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/analytics');
      setData(response.data);
      setUsingFallback(false);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'Failed to fetch data');
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && !usingFallback) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Skeleton variant="text" width={300} height={60} sx={{ mb: 4 }} />
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Skeleton variant="rectangular" height={120} />
            </Grid>
          ))}
        </Grid>
        <Skeleton variant="rectangular" height={400} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={400} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box display="flex" alignItems="center">
          <Typography variant="h4" component="h1">
            Social Media Dashboard
          </Typography>
          {usingFallback && (
            <Tooltip title="Currently showing sample data">
              <IconButton size="small" sx={{ ml: 1 }}>
                <InfoIcon color="warning" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchData}
          disabled={loading}
        >
          Refresh Data
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error} - Showing {usingFallback ? 'sample' : 'live'} data
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Followers"
            value={data.followers.data?.slice(-1)[0] || 0}
            change={calculateChange(data.followers.data)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Likes"
            value={data.engagement.likes?.reduce((a, b) => a + b, 0) || 0}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Comments"
            value={data.engagement.comments?.reduce((a, b) => a + b, 0) || 0}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Shares"
            value={data.engagement.shares?.reduce((a, b) => a + b, 0) || 0}
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ p: 2, height: 400 }}>
            <LineChart
              data={{
                labels: data.followers.labels || [],
                values: data.followers.data || [],
                label: 'Followers Growth'
              }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 2, height: 400 }}>
            <DoughnutChart
              data={(data.demographics.age || []).map((age, i) => ({
                id: i,
                value: data.demographics.count?.[i] || 0,
                label: `${age}+ yrs`
              }))}
            />
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ p: 2, height: 400 }}>
            <BarChart
              data={{
                labels: data.followers.labels || [],
                series: [
                  {
                    data: data.engagement.likes || [],
                    label: 'Likes'
                  },
                  {
                    data: data.engagement.comments || [],
                    label: 'Comments'
                  },
                  {
                    data: data.engagement.shares || [],
                    label: 'Shares'
                  }
                ]
              }}
            />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

function calculateChange(data = []) {
  if (data.length < 2) return 0;
  const last = data[data.length - 1];
  const first = data[0];
  return Math.round(((last - first) / first) * 100);
}

export default Dashboard;
