import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

const DoughnutChart = ({ data }) => (
  <PieChart
    series={[
      {
        data: data,
        innerRadius: 80,
        outerRadius: 120,
        paddingAngle: 2,
        cornerRadius: 5,
        highlightScope: { faded: 'global', highlighted: 'item' },
        faded: { innerRadius: 30, additionalRadius: -30 },
      },
    ]}
    height={350}
    slotProps={{
      legend: {
        direction: 'row',
        position: { vertical: 'bottom', horizontal: 'middle' },
        padding: 0,
      },
    }}
  />
);

export default DoughnutChart;