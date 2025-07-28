import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { alpha } from '@mui/material/styles'; // Changed from fade to alpha

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const BarChart = ({ labels, datasets, title }) => {
  const data = {
    labels,
    datasets: datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: (ctx) => {
        const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, alpha(dataset.color, 0.8)); // Changed to alpha
        gradient.addColorStop(1, alpha(dataset.color, 0.2)); // Changed to alpha
        return gradient;
      },
      hoverBackgroundColor: (ctx) => {
        const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, alpha(dataset.color, 1)); // Changed to alpha
        gradient.addColorStop(1, alpha(dataset.color, 0.4)); // Changed to alpha
        return gradient;
      },
      borderRadius: 6,
      borderSkipped: false,
      borderWidth: 0,
      barPercentage: 0.8,
      categoryPercentage: 0.9
    }))
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: 'Roboto, sans-serif'
          }
        }
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 12
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: ${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          padding: 10,
          callback: (value) => value.toLocaleString()
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          padding: 10
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <Bar 
        data={data} 
        options={options}
        plugins={[{
          id: 'customCenterText',
          beforeDraw: (chart) => {
            if (data.datasets[0].data.length === 0) {
              const ctx = chart.ctx;
              const width = chart.width;
              const height = chart.height;
              
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.font = '16px Roboto, sans-serif';
              ctx.fillStyle = '#999';
              ctx.fillText('No data available', width / 2, height / 2);
            }
          }
        }]}
      />
    </div>
  );
};

export default BarChart;