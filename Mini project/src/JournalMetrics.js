import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const JournalMetrics = () => {
  const [journals, setJournals] = useState([
    { issn: '', metrics: null, error: null, loading: false },
    { issn: '', metrics: null, error: null, loading: false }
  ]);
  const [isComparing, setIsComparing] = useState(false);
  const chartInstances = useRef([]);

  const fetchAllMetrics = async () => {
    // Validate that at least one ISSN is provided
    const hasAtLeastOneISSN = journals.some(journal => journal.issn.trim() !== '');
    if (!hasAtLeastOneISSN) {
      alert('Please enter at least one journal ISSN.');
      return;
    }

    setIsComparing(true);
    
    // Reset any previous metrics and errors
    const resetJournals = journals.map(journal => ({
      ...journal,
      metrics: null,
      error: null,
      loading: journal.issn.trim() !== '' // Only set loading true for journals with ISSNs
    }));
    setJournals(resetJournals);
    
    // Destroy any existing charts
    chartInstances.current.forEach(chart => chart && chart.destroy());
    chartInstances.current = [];
    
    // Fetch metrics for each journal with an ISSN
    const fetchPromises = resetJournals.map(async (journal, index) => {
      if (!journal.issn.trim()) {
        return { index, update: { error: null, metrics: null, loading: false } };
      }
      
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/journal/metrics?issn=${journal.issn}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'An error occurred while fetching metrics.');
        }
        
        const entry = data['serial-metadata-response']?.entry[0];
        if (!entry) {
          throw new Error('No journal data found for this ISSN.');
        }
        
        return { index, update: { metrics: entry, error: null, loading: false } };
      } catch (error) {
        return { index, update: { error: `Error: ${error.message}`, metrics: null, loading: false } };
      }
    });
    
    // Update journals with fetched data
    const results = await Promise.all(fetchPromises);
    
    const updatedJournals = [...resetJournals];
    results.forEach(({ index, update }) => {
      updatedJournals[index] = { ...updatedJournals[index], ...update };
    });
    
    setJournals(updatedJournals);
    setIsComparing(false);
    
    // Create charts after data is loaded and DOM has updated
    setTimeout(() => {
      updatedJournals.forEach((journal, index) => {
        if (journal.metrics) {
          createChart(index, journal.metrics);
        }
      });
    }, 100);
  };

  const updateJournal = (index, updates) => {
    setJournals(prevJournals => {
      const updatedJournals = [...prevJournals];
      updatedJournals[index] = { ...updatedJournals[index], ...updates };
      return updatedJournals;
    });
  };

  const createChart = (index, entry) => {
    if (!entry) return;

    // Get the canvas element
    const canvas = document.getElementById(`chart-${index}`);
    if (!canvas) return;

    // Ensure previous chart is destroyed
    if (chartInstances.current[index]) {
      chartInstances.current[index].destroy();
    }

    // Get metrics for chart
    const sjr = parseFloat(entry.SJRList?.SJR[0]?.$) || 0;
    const snip = parseFloat(entry.SNIPList?.SNIP[0]?.$) || 0;
    const citeScore = parseFloat(entry.citeScoreYearInfoList?.citeScoreCurrentMetric) || 0;
    
    const metrics = [sjr, snip, citeScore];
    const labels = ['SJR', 'SNIP', 'CiteScore'];
    
    // Create new chart
    const ctx = canvas.getContext('2d');
    chartInstances.current[index] = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Journal Metrics',
            data: metrics,
            backgroundColor: 'rgba(65, 105, 225, 0.2)',
            borderColor: 'rgba(65, 105, 225, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(65, 105, 225, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(65, 105, 225, 1)'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            ticks: {
              backdropColor: 'rgba(255, 255, 255, 0.8)',
              color: '#555'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.07)'
            },
            angleLines: {
              color: 'rgba(0, 0, 0, 0.07)'
            },
            pointLabels: {
              color: '#333',
              font: {
                weight: 'bold'
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  };

  const checkQuality = (metrics) => {
    if (!metrics) return '';
    
    const citeScore = parseFloat(metrics.citeScoreYearInfoList?.citeScoreCurrentMetric) || 0;
    const sjr = parseFloat(metrics.SJRList?.SJR[0]?.$) || 0;
    const snip = parseFloat(metrics.SNIPList?.SNIP[0]?.$) || 0;
    
    let score = 0;
    if (citeScore > 2.0) score++;
    if (sjr > 0.5) score++;
    if (snip > 1.0) score++;
    
    if (score >= 3) {
      return "Highly Recommended";
    } else if (score === 2) {
      return "Recommended";
    } else {
      return "Consider Alternatives";
    }
  };

  const getQualityColor = (quality) => {
    switch(quality) {
      case "Highly Recommended": return "#2c974b";
      case "Recommended": return "#0969da";
      case "Consider Alternatives": return "#bf8700";
      default: return "#57606a";
    }
  };

  const getQualityBgColor = (quality) => {
    switch(quality) {
      case "Highly Recommended": return "rgba(44, 151, 75, 0.1)";
      case "Recommended": return "rgba(9, 105, 218, 0.1)";
      case "Consider Alternatives": return "rgba(191, 135, 0, 0.1)";
      default: return "rgba(87, 96, 106, 0.1)";
    }
  };

  const addJournal = () => {
    setJournals(prev => [...prev, { issn: '', metrics: null, error: null, loading: false }]);
    // Clear charts since indices will change
    chartInstances.current.forEach((chart, idx) => {
      if (chart) {
        chart.destroy();
        chartInstances.current[idx] = null;
      }
    });
  };

  const removeJournal = (index) => {
    if (journals.length <= 2) return; // Keep at least two journals for comparison
    
    // Destroy the chart for the journal being removed
    if (chartInstances.current[index]) {
      chartInstances.current[index].destroy();
    }
    
    // Update journal list
    setJournals(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
    
    // Update chart instances array
    chartInstances.current.splice(index, 1);
  };

  const handleReset = () => {
    // Destroy existing charts
    chartInstances.current.forEach(chart => chart && chart.destroy());
    chartInstances.current = [];
    
    // Reset state
    setJournals([
      { issn: '', metrics: null, error: null, loading: false },
      { issn: '', metrics: null, error: null, loading: false }
    ]);
  };

  // Effect to clean up charts on unmount
  useEffect(() => {
    return () => {
      chartInstances.current.forEach(chart => chart && chart.destroy());
    };
  }, []);

  // Determine which journal is best
  const determineBestJournal = () => {
    const journalsWithMetrics = journals.filter(j => j.metrics);
    if (journalsWithMetrics.length < 2) return null;
    
    let best = null;
    let bestScore = -1;
    
    journalsWithMetrics.forEach((journal, idx) => {
      if (!journal.metrics) return;
      
      // FIXED: Use the same scoring system as checkQuality
      const citeScore = parseFloat(journal.metrics.citeScoreYearInfoList?.citeScoreCurrentMetric) || 0;
      const sjr = parseFloat(journal.metrics.SJRList?.SJR[0]?.$) || 0;
      const snip = parseFloat(journal.metrics.SNIPList?.SNIP[0]?.$) || 0;
      
      let score = 0;
      if (citeScore > 2.0) score++;
      if (sjr > 0.5) score++;
      if (snip > 1.0) score++;
      
      // Only consider journals that are at least "Recommended" (score >= 2)
      if (score >= 2 && score > bestScore) {
        best = idx;
        bestScore = score;
      }
    });
    
    return best;
  };

  const bestJournalIndex = determineBestJournal();

  return (
    <div className="journal-compare-container">
      <div className="journal-compare-header">
        <div className="brand-container">
          <div className="brand-logo">JC</div>
          <h1 className="brand-title">Journal<span>Compare</span></h1>
        </div>
        <p className="journal-compare-subtitle">
          Compare academic journals side-by-side using key impact metrics
        </p>
      </div>
      
      <div className="action-buttons">
        <button onClick={addJournal} className="add-journal-button">
          <span className="button-icon">+</span> Add Journal
        </button>
        <button onClick={handleReset} className="reset-button">
          <span className="button-icon">↻</span> Reset
        </button>
      </div>
      
      <div className="journal-cards-container">
        {journals.map((journal, index) => (
          <div key={index} className="journal-card-input">
            <div className="journal-card-header">
              <span className="journal-number">Journal #{index + 1}</span>
              {journals.length > 2 && (
                <button 
                  onClick={() => removeJournal(index)} 
                  className="remove-journal-button"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="input-group">
              <div className="issn-input-container">
                <label htmlFor={`issn-${index}`} className="input-label">ISSN</label>
                <input
                  id={`issn-${index}`}
                  type="text"
                  value={journal.issn}
                  onChange={(e) => updateJournal(index, { issn: e.target.value })}
                  placeholder="e.g., 2078-2489"
                  className="issn-input"
                />
              </div>
            </div>
            
            {journal.error && (
              <div className="error-message">
                {journal.error}
              </div>
            )}

            {journal.metrics && (
              <div className={`journal-result-card ${bestJournalIndex === index ? 'best-journal' : ''}`}>
                {bestJournalIndex === index && (
                  <div className="best-badge">
                    TOP CHOICE
                  </div>
                )}
                
                <div className="journal-info">
                  <h3 className="journal-title">
                    {journal.metrics.preferredName || journal.metrics['dc:title'] || 'Journal'}
                  </h3>
                  <div className="journal-details">
                    <span className="publisher">
                      {journal.metrics.publisherName || 'Unknown Publisher'}
                    </span>
                    <span className="issn-display">
                      ISSN: {journal.metrics['prism:issn'] || journal.issn}
                    </span>
                  </div>
                </div>
                
                <div className="metrics-container">
                  <div className="metrics-grid">
                    <div className="metric-item">
                      <div className="metric-value">
                        {journal.metrics?.citeScoreYearInfoList?.citeScoreCurrentMetric || "N/A"}
                      </div>
                      <div className="metric-label">
                        CiteScore 
                        <span className="metric-year">
                          ({journal.metrics?.citeScoreYearInfoList?.citeScoreCurrentMetricYear || "N/A"})
                        </span>
                      </div>
                    </div>
                    
                    <div className="metric-item">
                      <div className="metric-value">
                        {journal.metrics?.SJRList?.SJR[0]?.$ || "N/A"}
                      </div>
                      <div className="metric-label">
                        SJR 
                        <span className="metric-year">
                          ({journal.metrics?.SJRList?.SJR[0]?.["@year"] || "N/A"})
                        </span>
                      </div>
                    </div>
                    
                    <div className="metric-item">
                      <div className="metric-value">
                        {journal.metrics?.SNIPList?.SNIP[0]?.$ || "N/A"}
                      </div>
                      <div className="metric-label">
                        SNIP 
                        <span className="metric-year">
                          ({journal.metrics?.SNIPList?.SNIP[0]?.["@year"] || "N/A"})
                        </span>
                      </div>
                    </div>
                    
                  </div>
                  
                  <div 
                    className="journal-recommendation"
                    style={{
                      color: getQualityColor(checkQuality(journal.metrics)),
                      backgroundColor: getQualityBgColor(checkQuality(journal.metrics))
                    }}
                  >
                    {checkQuality(journal.metrics)}
                  </div>
                </div>
                
                <div className="chart-container">
                  <canvas id={`chart-${index}`} className="journal-chart"></canvas>
                </div>
              </div>
            )}
            
            {journal.loading && (
              <div className="loading-message">
                <div className="loading-spinner-small"></div>
                <span>Loading journal data...</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="compare-button-container">
        <button 
          onClick={fetchAllMetrics} 
          className="compare-all-button"
          disabled={isComparing}
        >
          {isComparing ? (
            <>
              <div className="loading-spinner"></div>
              <span>Comparing...</span>
            </>
          ) : (
            <>
              <span className="button-icon">🔍</span>
              <span>Compare All Journals</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default JournalMetrics;