import React, { useEffect, useState } from 'react';

function CredibilityScore({ journalId, darkMode }) {
  const [credibility, setCredibility] = useState(0);

  const fetchCredibility = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/journal/credibility?id=${journalId}`);
      const data = await response.json();
      setCredibility(data.credibility);
    } catch (error) {
      console.error("Error fetching credibility score:", error);
    }
  };

  useEffect(() => {
    if (journalId) {
      fetchCredibility();
    }
  }, [journalId]);

  return (
    <div className="mt-4">
      <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-black'}`}>Credibility Score: <span className="text-blue-500">{credibility.toFixed(2)}</span></h3>
    </div>
  );
}

export default CredibilityScore;
