import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const StatsChart = ({ darkMode }) => {
  const [chartData, setChartData] = useState(null);  // Chart data state
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state

  // Fetch data from Scopus API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Replace the URL with your Scopus API endpoint and API key
        const response = await fetch('https://api.elsevier.com/content/search/scopus?query=YOUR_QUERY', {
          headers: {
            'X-ELS-APIKey': 'YOUR_API_KEY',  // Replace with your Scopus API key
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const data = await response.json();
        // Process the data from the API response (replace with relevant field extraction)
        const metricsData = extractMetricsFromResponse(data);

        // Update chart data
        setChartData({
          labels: ['IPP', 'SJR', 'SNIP', 'Credibility'],
          datasets: [
            {
              label: 'Metrics',
              data: metricsData,  // Fetched data goes here
              backgroundColor: darkMode
                ? ['rgba(54, 162, 235, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(153, 102, 255, 0.8)', 'rgba(255, 159, 64, 0.8)']
                : ['rgba(75, 192, 192, 0.8)', 'rgba(255, 99, 132, 0.8)', 'rgba(255, 206, 86, 0.8)', 'rgba(54, 162, 235, 0.8)'],
              borderColor: darkMode
                ? ['rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)']
                : ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)', 'rgba(54, 162, 235, 1)'],
              borderWidth: 1,
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [darkMode]);  // Refetch data if darkMode changes

  // Function to extract metrics from the API response (customize this based on your data structure)
  const extractMetricsFromResponse = (data) => {
    // Replace this logic with the actual field names from the Scopus response
    return [
      data['search-results']['entry'][0]['metric_ipp'],  // Example: IPP metric
      data['search-results']['entry'][0]['metric_sjr'],  // Example: SJR metric
      data['search-results']['entry'][0]['metric_snip'],  // Example: SNIP metric
      data['search-results']['entry'][0]['metric_credibility'],  // Example: Credibility metric
    ];
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Journal Metrics Overview',
      },
    },
  };

  // Render loading, error, or chart based on state
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <Bar data={chartData} options={options} />;
};

export default StatsChart;
