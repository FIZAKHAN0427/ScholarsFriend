import React, { useState } from 'react';

const ResearchStep = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const styles = {
        body: {
            margin: 0,
            fontFamily: 'Arial, sans-serif',
            background: 'linear-gradient(135deg, #0a192f, #1c1c3f)', // Dark blue gradient
            color: '#ffffff',
            display: 'flex',
            minHeight: '100vh',
        },
        sidebar: {
            background: '#001f3f', // Dark navy for sidebar
            padding: '20px',
            width: isSidebarOpen ? '250px' : '60px',
            borderRadius: '0 12px 12px 0',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            transition: 'width 0.3s',
            overflow: 'hidden',
        },
        sidebarItem: {
            padding: '10px 15px',
            borderRadius: '6px',
            cursor: 'pointer',
            margin: '5px 0',
            transition: 'background 0.3s',
            color: '#ffffff',
        },
        sidebarItemActive: {
            background: '#004f7c', // A deep teal for active items
        },
        container: {
            padding: '20px',
            flex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            marginLeft: '20px',
        },
        toggleButton: {
            background: '#007acc', // Bright blue for toggle button
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '10px',
            cursor: 'pointer',
            marginBottom: '20px',
            transition: 'background 0.3s',
        },
        slogan: {
            textAlign: 'center',
            padding: '30px 0',
        },
        sloganText: {
            fontSize: '2.5em',
            margin: 0,
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        },
        bold: {
            fontWeight: 'bold',
            fontSize: '2em',
            color: '#00aaff', // Bright blue for emphasis
        },
        guide: {
            textAlign: 'center',
            marginBottom: '30px',
            fontSize: '1.2em',
        },
        step: {
            margin: '20px 0',
            border: '1px solid #007acc', // Use bright blue for borders
            padding: '20px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            transition: 'transform 0.3s, box-shadow 0.3s',
        },
        flowDiagram: {
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            padding: '10px',
            marginTop: '10px',
        },
        list: {
            listStyleType: 'none',
            padding: 0,
        },
        listItem: {
            padding: '8px 0',
            borderBottom: '1px solid #007acc', // Bright blue for list items
        },
    };

    const steps = [
        {
            title: "Step 1: Choosing Your Journal",
            description: "Choosing the right journal is crucial for maximizing the impact of your research.",
            flow: [
                "Build a shortlist",
                "Refine your shortlist",
                "Choose open data",
                "Citation metrics",
                "Choose open access books"
            ]
        },
        {
            title: "Step 2: Writing Your Journal",
            description: "Writing an effective, compelling research paper is vital to getting your research published.",
            flow: [
                "Know who you're writing for",
                "Read the guidelines",
                "Structuring your article",
                "Writing your manuscript",
                "Formatting your paper",
                "Before you submit",
                "Enhance your paper"
            ]
        },
        {
            title: "Step 3: Make Your Submission",
            description: "Once you’ve chosen the right journal and written your manuscript, it's time to submit.",
            flow: [
                "Preparing your submission",
                "Using submission systems",
                "Data sharing",
                "Submission checklist"
            ]
        },
        {
            title: "Step 4: Navigating the Peer Review",
            description: "After submission, understanding the peer review process is crucial. This independent assessment evaluates your paper’s quality and provides valuable feedback for improvement.",
            flow: [
                "Understand the peer review process",
                "Respond constructively to reviewer comments",
                "Make necessary revisions",
                "Resubmit your paper for further review"
            ]
        },
        {
            title: "Step 5: The Production Process",
            description: "If accepted, your paper enters production. Follow the journal’s guidelines for proofing and learn how to access your published article. Celebrate your achievement and strategize on maximizing your work's impact.",
            flow: [
                "Follow instructions for proofing your article",
                "Access and share your published work",
                "Engage with your audience to promote your research"
            ]
        }
    ];

    return (
        <div style={styles.body}>
            <div style={styles.sidebar}>
                <button style={styles.toggleButton} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {isSidebarOpen ? '<' : '>'}
                </button>
                {steps.map((step, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.sidebarItem,
                            ...(activeStep === index ? styles.sidebarItemActive : {}),
                        }}
                        onClick={() => setActiveStep(index)}
                    >
                        {isSidebarOpen ? step.title : step.title.charAt(0)} {/* Show first letter if sidebar is collapsed */}
                    </div>
                ))}
            </div>

            <div style={styles.container}>
                <section style={styles.slogan}>
                    <h1 style={styles.sloganText}>Want to know how to publish a paper?</h1>
                    <h2 style={styles.bold}>Let’s get started!</h2>
                </section>

                <section style={styles.guide}>
                    <h3>A step-by-step guide to getting published</h3>
                    <p>
                        Publishing your research is a vital step in your academic career. This guide is designed to take you through the typical steps in publishing a research paper.
                    </p>
                </section>

                <section style={styles.step}>
                    <h4>{steps[activeStep].title}</h4>
                    <p>{steps[activeStep].description}</p>
                    {steps[activeStep].flow.length > 0 && (
                        <div style={styles.flowDiagram}>
                            <ul style={styles.list}>
                                {steps[activeStep].flow.map((item, i) => (
                                    <li key={i} style={styles.listItem}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default ResearchStep;
