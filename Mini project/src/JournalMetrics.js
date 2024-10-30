import React, { useState } from 'react';
import Chart from 'chart.js/auto';

const JournalMetrics = () => {
  const [issn, setIssn] = useState('');
  const [metricsData, setMetricsData] = useState(null);
  const [error, setError] = useState(null);
  const [qualityMessage, setQualityMessage] = useState('');

  const fetchMetrics = async () => {
    setError(null);
    setMetricsData(null);
    setQualityMessage('');

    if (!issn) {
      setError('Please enter an ISSN.');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/journal/metrics?issn=${issn}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred while fetching metrics.');
      }

      const entry = data['serial-metadata-response'].entry[0];
      setMetricsData(entry);

      // Prepare data for the chart
      const metrics = [
        parseFloat(entry.SJRList.SJR[0].$),
        parseFloat(entry.SNIPList.SNIP[0].$),
        parseFloat(entry.citeScoreYearInfoList.citeScoreCurrentMetric),
      ];
      const labels = ['SJR', 'SNIP', 'CiteScore'];

      // Create the chart
      const ctx = document.getElementById('metricsChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Metrics',
              data: metrics,
              backgroundColor: ['#4CAF50', '#2196F3', '#FFC107'],
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      // Quality Check based on Scopus constraints
      const citeScore = parseFloat(entry.citeScoreYearInfoList.citeScoreCurrentMetric);
      const sjr = parseFloat(entry.SJRList.SJR[0].$);
      const snip = parseFloat(entry.SNIPList.SNIP[0].$);
      let qualityMsg = "This journal's quality is: ";

      // Adjusted quality constraints
      if (citeScore > 2.0 && sjr > 0.5 && snip > 1.0) {
        qualityMsg += "<span style='color: green;'>Good Quality</span>";
      } else {
        qualityMsg += "<span style='color: red;'>Not Good Quality</span>";
      }
      setQualityMessage(qualityMsg);

    } catch (error) {
      setError(`Error: ${error.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Fetch Journal Metrics</h1>
      <input
        type="text"
        value={issn}
        onChange={(e) => setIssn(e.target.value)}
        placeholder="Enter ISSN"
        style={styles.input}
      />
      <button onClick={fetchMetrics} style={styles.button}>Get Metrics</button>
      {error && <p style={styles.error}>{error}</p>}
      {metricsData && (
        <div style={styles.metricsCard}>
          <h2>Journal Metrics</h2>
          <div style={styles.metricTitle}><strong>Title:</strong> {metricsData["dc:title"]}</div>
          <div style={styles.metricTitle}><strong>Publisher:</strong> {metricsData["dc:publisher"]}</div>
          <div style={styles.metricTitle}><strong>ISSN:</strong> {metricsData["dc:identifier"]}</div>
          <div style={styles.metricTitle}><strong>SJR:</strong> {metricsData.SJRList.SJR[0].$} (Year: {metricsData.SJRList.SJR[0]["@year"]})</div>
          <div style={styles.metricTitle}><strong>SNIP:</strong> {metricsData.SNIPList.SNIP[0].$} (Year: {metricsData.SNIPList.SNIP[0]["@year"]})</div>
          <div style={styles.metricTitle}><strong>CiteScore:</strong> {metricsData.citeScoreYearInfoList.citeScoreCurrentMetric} (Year: {metricsData.citeScoreYearInfoList.citeScoreCurrentMetricYear})</div>
          <div style={styles.metricTitle}><strong>Coverage End Year:</strong> {metricsData.coverageEndYear}</div>
        </div>
      )}
      <canvas id="metricsChart" width="400" height="200" style={styles.chart}></canvas>
      <div dangerouslySetInnerHTML={{ __html: qualityMessage }} style={styles.quality}></div>
    </div>
  );
};

const styles = {
  container: {
    padding: '5% 10%',
    background: 'linear-gradient(160deg, #060415 0%, #0f1f3a 33%, #0b1332 66%, #0b0b34 100%)',
    color: '#fff',
    fontFamily: 'Roboto, sans-serif',
    maxWidth: '600px',
    margin: 'auto',
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
    padding: '30px',
  },
  input: {
    padding: '15px',
    width: '100%',
    borderRadius: '8px',
    border: 'none',
    fontSize: '1.2rem',
    marginBottom: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: '#333',
  },
  button: {
    padding: '15px',
    backgroundColor: '#377dee',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    width: '100%',
  },
  error: {
    color: 'red',
    fontSize: '1.2rem',
    textAlign: 'center',
    marginTop: '10px',
  },
  metricsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    padding: '20px',
    marginTop: '20px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  },
  metricTitle: {
    fontWeight: 'bold',
    margin: '5px 0',
  },
  chart: {
    marginTop: '20px',
    maxWidth: '100%',
    borderRadius: '8px',
  },
  quality: {
    marginTop: '20px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
};

export default JournalMetrics;
