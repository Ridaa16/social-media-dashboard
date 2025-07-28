const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/analytics', (req, res) => {
  const mockData = {
    followers: {
      labels: ["Jan", "Feb", "Mar"],
      data: [1000, 1200, 1300]
    },
    engagement: {
      likes: [100, 150, 200],
      comments: [30, 40, 50],
      shares: [10, 15, 20]
    },
    demographics: {
      age: [25, 35, 45],
      count: [300, 400, 200]
    },
    impressions: {
      labels: ["Jan", "Feb", "Mar"],
      data: [5000, 7000, 8500]
    },
    reach: {
      labels: ["Jan", "Feb", "Mar"],
      data: [3000, 4500, 6000]
    },
    profileViews: {
      labels: ["Jan", "Feb", "Mar"],
      data: [120, 180, 210]
    },
    clickThroughRate: {
      labels: ["Jan", "Feb", "Mar"],
      data: [2.5, 3.0, 3.5] // in percentage
    },
    topPosts: [
      { id: 1, likes: 300, comments: 50, shares: 20 },
      { id: 2, likes: 250, comments: 40, shares: 15 },
      { id: 3, likes: 270, comments: 45, shares: 18 }
    ],
    hashtagPerformance: {
      hashtags: ["#tech", "#coding", "#javascript"],
      counts: [1000, 850, 1200]
    },
    deviceUsage: {
      devices: ["Mobile", "Desktop", "Tablet"],
      percentage: [70, 25, 5]
    },
    locationStats: {
      locations: ["USA", "India", "UK"],
      users: [500, 700, 300]
    },
    genderDistribution: {
      genders: ["Male", "Female", "Other"],
      counts: [600, 750, 50]
    }
  };
  res.json(mockData);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
