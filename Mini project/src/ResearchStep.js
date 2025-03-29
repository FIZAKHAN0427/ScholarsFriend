import React, { useState } from "react";

const ResearchStep = ({ isDarkMode }) => {
  const [selectedTopic, setSelectedTopic] = useState(
    "Introduction to Research Papers"
  );

  const handleClick = (topic) => {
    setSelectedTopic(topic);
  };

  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      backgroundColor: isDarkMode ? "#0C0C1E" : "#FFFFFF",
      color: isDarkMode ? "rgba(255,255,255,0.9)" : "#2C3E50",
      fontFamily:
        "'Poppins', 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
      transition: "background-color 0.3s ease",
    },
    sidebar: {
      width: "300px",
      backgroundColor: isDarkMode ? "#141432" : "#F4F6F9",
      padding: "30px",
      display: "flex",
      flexDirection: "column",
      borderRight: `1px solid ${
        isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
      }`,
      height: "100vh",
      overflowY: "auto",
      boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    },
    sidebarTitle: {
      color: isDarkMode ? "white" : "#2C3E50",
      fontSize: "1.7rem",
      marginBottom: "30px",
      textAlign: "center",
      fontWeight: "600",
      letterSpacing: "-0.5px",
      position: "relative",
      "&::after": {
        content: '""',
        position: "absolute",
        bottom: "-10px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "50px",
        height: "3px",
        backgroundColor: isDarkMode
          ? "rgba(255,255,255,0.2)"
          : "rgba(44,62,80,0.1)",
      },
    },
    sidebarItem: {
      marginBottom: "15px",
      fontSize: "1rem",
      cursor: "pointer",
      color: isDarkMode ? "rgba(255,255,255,0.7)" : "#2C3E50",
      padding: "12px 20px",
      borderRadius: "10px",
      transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
      position: "relative",
      fontWeight: "500",
      "&:hover": {
        backgroundColor: isDarkMode
          ? "rgba(255,255,255,0.05)"
          : "rgba(44,62,80,0.03)",
        transform: "translateX(5px) scale(1.02)",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      },
      "&::before": {
        content: '""',
        position: "absolute",
        left: "-10px",
        top: "50%",
        transform: "translateY(-50%)",
        width: "4px",
        height: "0",
        backgroundColor: isDarkMode ? "white" : "#2C3E50",
        transition: "height 0.3s ease",
      },
      "&:hover::before": {
        height: "60%",
      },
    },
    mainContent: {
      flex: 1,
      padding: "50px",
      backgroundColor: isDarkMode ? "#0F0F26" : "#FFFFFF",
      color: isDarkMode ? "rgba(255,255,255,0.85)" : "#2C3E50",
      fontFamily:
        "'Poppins', 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
      lineHeight: "1.8",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: "700",
      marginBottom: "35px",
      color: isDarkMode ? "white" : "#2C3E50",
      textAlign: "center",
      letterSpacing: "-1.5px",
      position: "relative",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      backgroundImage: isDarkMode
        ? "linear-gradient(45deg, white, rgba(255,255,255,0.7))"
        : "linear-gradient(45deg, #2C3E50, rgba(44,62,80,0.7))",
      WebkitTextFillColor: "transparent",
    },
    contentArea: {
      display: "flex",
      flexDirection: "column",
      gap: "40px",
      alignItems: "center",
      maxWidth: "1100px",
      margin: "0 auto",
      position: "relative",
      zIndex: 1,
    },
    imageTextContainer: {
      display: "flex",
      alignItems: "flex-start",
      gap: "35px",
      flexWrap: "wrap",
      backgroundColor: isDarkMode
        ? "rgba(20,20,50,0.3)"
        : "rgba(244,246,249,0.5)",
      borderRadius: "15px",
      padding: "30px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
      },
    },
    image: {
      maxWidth: "45%",
      height: "auto",
      borderRadius: "15px",
      flexShrink: 0,
      boxShadow: "0 12px 25px rgba(0,0,0,0.15)",
      transition: "transform 0.4s ease, box-shadow 0.4s ease",
      "&:hover": {
        transform: "scale(1.03) rotate(1deg)",
        boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
      },
    },
    paragraph: {
      fontSize: "1.05rem",
      lineHeight: "2",
      textAlign: "justify",
      flex: 1,
      color: isDarkMode ? "rgba(255,255,255,0.85)" : "#2C3E50",
      letterSpacing: "0.4px",
      fontWeight: "300",
    },
    listItem: {
      fontSize: "1rem",
      lineHeight: "2",
      marginBottom: "15px",
      position: "relative",
      paddingLeft: "30px",
      "&::before": {
        content: '"➤"',
        position: "absolute",
        left: "0",
        color: isDarkMode ? "rgba(255,255,255,0.7)" : "#2C3E50",
        fontWeight: "bold",
        marginRight: "15px",
      },
    },
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Research Steps</h2>
        <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
          {[
            "Introduction to Research Papers",
            "Scopus, UGC, and Web of Science : Understanding Their Role in Research",
            "Top 45 Terminologies Related to Research",
            "What exactly is Journal?",
            "A Beginner's Guide to Publishing Research",
            "Step1: Choosing a journal",
            "Step2: Writing your paper",
            "Step3: Making your submission",
            "Step4: Understanding the peer review process",
            "Step5: Moving through production",

          ].map((item, index) => (
            <li
              key={index}
              style={styles.sidebarItem}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#5cb85c";
                e.target.style.color = "white";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = isDarkMode ? "white" : "#333";
              }}
              onClick={() => handleClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <h1 style={styles.title}>
          {selectedTopic === "Introduction to Research Papers"
            ? "What is a Research Paper?"
            : selectedTopic ===
              "Scopus, UGC, and Web of Science : Understanding Their Role in Research"
            ? "Scopus, UGC, and Web of Science : Understanding Their Role in Research"
            : selectedTopic === "Top 45 Terminologies Related to Research"
            ? "Top 45 Terminologies Related to Research"
            : selectedTopic === "What exactly is Journal?"
            ? "What exactly is Journal?"
            : selectedTopic === "A Beginner's Guide to Publishing Research"
            ? "A Beginner's Guide to Publishing Research"
            : selectedTopic === "Step1: Choosing a journal"
            ? "Step1: Choosing a journal"
            : selectedTopic === "Step2: Writing your paper"
            ? "Step2: Writing your paper"
            : selectedTopic === "Step3: Making your submission"
            ? "Step3: Making your submission"
            : selectedTopic === "Step4: Understanding the peer review process"
            ? "Step4: Understanding the peer review process"
            : selectedTopic === "Step5: Moving through production"}
        </h1>
        <div style={styles.contentArea}>
          {selectedTopic === "Introduction to Research Papers" && (
            <>
              <div style={styles.imageTextContainer}>
                <img
                  src="./images/res1.webp"
                  alt="Research Paper"
                  style={styles.image}
                />
                <p style={styles.paragraph}>
                  A research paper is a type of academic writing that involves a
                  detailed examination, analysis, or explanation of a particular
                  topic. It is based on evidence gathered from various sources,
                  such as data, studies, and previous research. Unlike an essay,
                  which may focus more on the writer's thoughts, a research
                  paper emphasizes facts, evidence, and citations to support the
                  writer’s points. Research papers are fundamental to the world
                  of science and education, as they allow researchers to share
                  their findings with others in their field. They serve as a
                  means for advancing knowledge by providing new insights,
                  theories, or conclusions based on thorough investigation.
                </p>
              </div>
              <p style={styles.paragraph}>
                Although many people first encounter research papers in school,
                where they are used to test a student’s understanding of a
                subject or their ability to conduct research, they are also used
                by professionals and academics to communicate and collaborate in
                their areas of expertise. Because research papers are used to
                inform others, they are written in a formal, objective tone.
                This means the writer avoids any bias or personal opinions,
                instead focusing on presenting facts and findings in a clear,
                straightforward way. Researchers ensure that their conclusions
                are well-supported by evidence, so that others can rely on their
                work and use it in their own research. This formal style helps
                maintain the credibility of the paper and makes it useful for
                advancing knowledge in the field.
              </p>
            </>
          )}

          {selectedTopic ===
            "Scopus, UGC, and Web of Science : Understanding Their Role in Research" && (
            <>
              <div style={styles.imageTextContainer}>
                <img
                  src="./images/res3.jpeg"
                  alt="Scopus and UGC"
                  style={{
                    ...styles.image,
                    width: "70%", // Adjust width as needed
                    height: "380px", // Keep height proportional
                  }}
                />
                <p style={styles.paragraph}>
                  Scopus, UGC, and Web of Science are three important databases
                  that help researchers find relevant journals and academic
                  publications in their field. Scopus is a comprehensive
                  database that indexes a wide range of scientific articles,
                  conference papers, and patents, providing access to
                  high-quality research materials across various disciplines.
                  UGC (University Grants Commission) is an Indian regulatory
                  body that promotes higher education in India. It maintains a
                  list of approved journals for academic publication. The Web of
                  Science is another major database, offering access to
                  scholarly journals, books, conference proceedings, and
                  patents, with a focus on quality and high-impact research.
                </p>
              </div>
              <p style={styles.paragraph}>
                These databases and indexing platforms play a vital role in
                ensuring the credibility and quality of research publications.
                Researchers use these platforms to identify reputable journals
                and publishers for their work. Journals indexed in Scopus, UGC,
                or Web of Science are considered prestigious because they adhere
                to rigorous editorial standards, providing researchers with
                confidence in the quality of the research they publish. Indexing
                also increases the visibility of research and helps researchers
                reach a global audience. In addition to helping researchers find
                relevant journals, these platforms also facilitate the discovery
                of new research by indexing articles and papers that meet
                certain standards of quality and impact. This allows researchers
                to stay up to date with the latest developments in their field
                and ensures that they are publishing their work in journals that
                are widely recognized and respected within the academic
                community.
              </p>
            </>
          )}

          {selectedTopic === "Top 45 Terminologies Related to Research" && (
            <>
              <p style={styles.paragraph}>
                Below is a list of 45 important terms that are essential in the
                world of research and publishing, along with their meanings and
                relevant emojis:
              </p>
              <div>
                <ul>
                  {[
                    {
                      term: "Publishing Year",
                      definition:
                        "The publishing year refers to the year in which a research paper, journal article, or publication was officially made available to the public. This information is essential for assessing the timeliness and relevance of research in a rapidly evolving field. Researchers and academics often prioritize recent publications, as they reflect the latest advancements and findings. Publishing years also help in chronological analysis, such as tracking trends or technological progress over time.",
                    },
                    {
                      term: "Discontinued List",
                      definition:
                        "A discontinued list refers to journals that are no longer being actively published or indexed by platforms like Scopus, Web of Science, or UGC. Journals can be discontinued for several reasons, including a lack of submissions, failing to meet quality standards, or violations of ethical publishing practices. Being on a discontinued list often serves as a warning to researchers to avoid submitting work to such journals, as it might harm their academic credibility.",
                    },
                    {
                      term: "Delisted Journals",
                      definition:
                        "Delisted journals are those that have been removed from indexing services like Scopus or Web of Science. This often happens when a journal fails to maintain required standards of quality, transparency, or ethical practices. Delisting can also result from suspected predatory practices, insufficient peer review processes, or a high incidence of retractions. Researchers should avoid citing or submitting to delisted journals, as their reputation in the academic community is compromised.",
                    },
                    {
                      term: "ISSN Number (International Standard Serial Number)",
                      definition:
                        "An ISSN (International Standard Serial Number) is an eight-digit identifier assigned to serial publications, such as journals, magazines, and newspapers. It acts as a unique code for identifying a specific serial across databases and indexing platforms. ISSNs are critical for researchers to distinguish between publications with similar names and ensure proper citation.",
                    },
                    {
                      term: "Impact Factor (IF)",
                      definition:
                        "The Impact Factor (IF) is a metric used to measure the average number of citations received per paper published in a journal over a specific period, typically two years. It is calculated by dividing the total number of citations by the number of articles published in the same period. A high impact factor is often associated with prestigious journals, making it an essential consideration for researchers seeking to publish their work.",
                    },
                    {
                      term: "SJR (SCImago Journal Rank)",
                      definition:
                        "The SCImago Journal Rank (SJR) is a metric that evaluates the scientific influence of journals based on citation weighting. Unlike the Impact Factor, SJR accounts for the quality of the citing source, giving more weight to citations from reputable journals. It is widely used to rank journals within specific disciplines and assess their prestige in the academic community.",
                    },
                    {
                      term: "SNIP (Source Normalized Impact per Paper)",
                      definition:
                        "SNIP (Source Normalized Impact per Paper) is a metric that measures a journal's contextual citation impact, considering differences in citation practices between academic fields. It adjusts for variations in citation behavior, making it easier to compare journals across disciplines. SNIP is particularly useful for identifying journals in niche or emerging fields.",
                    },
                    {
                      term: "Citation Count",
                      definition:
                        "A citation count refers to the number of times a specific paper, journal, or article has been referenced in other works. High citation counts indicate the impact and influence of a research paper in its field. Citation counts are also used to measure the productivity and recognition of individual researchers or institutions.",
                    },
                    {
                      term: "H-Index",
                      definition:
                        "The H-Index is a metric that measures both the productivity and citation impact of an author's published work. A researcher has an H-index of n if they have n papers that have been cited at least n times each. It provides a balanced measure, favoring neither excessively cited papers nor a large number of less-cited works.",
                    },
                    {
                      term: "Peer Review",
                      definition:
                        "Peer review is a process by which research papers are evaluated by experts in the same field before publication. It ensures the quality, validity, and originality of the research. Peer-reviewed journals are highly regarded as they maintain stringent standards for accepting submissions.",
                    },
                    {
                      term: "Retraction",
                      definition:
                        "A retraction is the withdrawal of a published paper from a journal due to errors, misconduct, or ethical violations. Retractions are often accompanied by a statement explaining the reasons and are important for maintaining the integrity of academic publishing.",
                    },
                    {
                      term: "Open Access",
                      definition:
                        "Open Access (OA) refers to research papers and journals that are freely accessible to readers without subscription fees. Open Access journals often charge authors a publication fee to cover costs. They are instrumental in promoting the dissemination of knowledge but require scrutiny to avoid predatory publishers.",
                    },
                    {
                      term: "Predatory Journals",
                      definition:
                        "Predatory journals are unethical publishers that charge fees to authors without providing legitimate peer review or editorial services. They often exploit researchers by promising quick publication but lack academic credibility. It is crucial for researchers to verify a journal's reputation before submitting their work.",
                    },
                    {
                      term: "Journal Metrics",
                      definition:
                        "Journal metrics include various indicators like Impact Factor, SJR, SNIP, and citation counts used to evaluate a journal's influence, credibility, and reach. These metrics are essential tools for researchers when selecting a journal for publication or assessing its relevance in a field.",
                    },
                    {
                      term: "Manuscript ID",
                      definition:
                        "A manuscript ID is a unique identifier assigned to a research paper during the submission process. It is used by authors, editors, and reviewers to track the progress of a submission through peer review, revisions, and publication.",
                    },
                    {
                      term: "DOI (Digital Object Identifier)",
                      definition:
                        "A DOI (Digital Object Identifier) is a unique alphanumeric string assigned to research papers, datasets, or other scholarly works. It provides a permanent link to the digital content, ensuring long-term accessibility and accurate citation.",
                    },
                    {
                      term: "Abstract",
                      definition:
                        "An abstract is a concise summary of a research paper, typically 150-250 words long. It provides an overview of the study's objectives, methods, findings, and conclusions, enabling readers to quickly determine its relevance.",
                    },
                    {
                      term: "Literature Review",
                      definition:
                        "A literature review is a critical summary of existing research on a topic. It identifies gaps, establishes the context for the study, and demonstrates the author's understanding of the field.",
                    },
                    {
                      term: "Indexing Services",
                      definition:
                        "Indexing services like Scopus, Web of Science, and PubMed ensure that journals and papers meet quality standards. Indexed journals are more visible, widely cited, and considered credible within the academic community.",
                    },
                    {
                      term: "Keywords",
                      definition:
                        "Keywords are specific terms or phrases included in a research paper to represent its core topics and themes. These help improve discoverability in search engines and indexing databases. Authors carefully select keywords to ensure their work reaches the right audience.",
                    },
                    {
                      term: "Plagiarism Check",
                      definition:
                        "A plagiarism check is the process of verifying that the content of a research paper is original and not copied from existing works. Tools like Turnitin, Grammarly, or iThenticate are often used by journals and researchers to detect plagiarism and maintain ethical standards.",
                    },
                    {
                      term: "Ethics Statement",
                      definition:
                        "An ethics statement is a declaration in research papers that outlines compliance with ethical guidelines, such as obtaining informed consent from participants or approval from institutional review boards. It demonstrates the integrity and accountability of the research process.",
                    },
                    {
                      term: "Author Contributions",
                      definition:
                        "Author contributions clarify the specific roles of each author in the research and publication process. For instance, roles might include data analysis, writing, supervision, or conceptualization. This section ensures transparency and proper credit distribution.",
                    },
                    {
                      term: "Co-Authorship",
                      definition:
                        "Co-authorship involves multiple individuals contributing to a single research paper. The order of authors often indicates their level of contribution, with the first author typically leading the work and the last author being the senior or corresponding author.",
                    },
                    {
                      term: "Corresponding Author",
                      definition:
                        "The corresponding author is the individual responsible for communicating with the journal during the submission, review, and publication process. They address reviewer comments and manage post-publication inquiries.",
                    },
                    {
                      term: "Preprint",
                      definition:
                        "A preprint is a version of a research paper shared publicly before peer review and official publication. Platforms like arXiv and bioRxiv allow researchers to disseminate findings quickly, fostering collaboration and feedback.",
                    },
                    {
                      term: "Postprint",
                      definition:
                        "A postprint refers to the final version of a paper after peer review but before being formatted for publication by the journal. Postprints often reflect the content that will be officially published.",
                    },
                    {
                      term: "Double-Blind Peer Review",
                      definition:
                        "In a double-blind peer review, both the reviewers and the authors remain anonymous to each other. This process ensures impartiality and reduces bias during the review process.",
                    },
                    {
                      term: "Rejection Rate",
                      definition:
                        "The rejection rate of a journal indicates the percentage of submitted manuscripts that are not accepted for publication. High rejection rates are often associated with prestigious journals, reflecting stringent quality standards.",
                    },
                    {
                      term: "Article Processing Charge (APC)",
                      definition:
                        "An Article Processing Charge (APC) is a fee that authors must pay to have their paper published in an open-access journal. These charges cover the costs of peer review, editing, and publication.",
                    },
                    {
                      term: "Altmetric",
                      definition:
                        "Altmetric is a measure of the online attention a research article receives, including social media mentions, news coverage, blog posts, and policy documents. It helps assess the broader impact of a paper beyond academic citations, offering insights into public engagement and interest.",
                    },
                    {
                      term: "Citation Index",
                      definition:
                        "A citation index is a database that tracks and records citations of academic publications. It allows researchers to measure the influence and reach of a paper or journal by counting how many times it has been cited by other academic works.",
                    },
                    {
                      term: "Editorial Board",
                      definition:
                        "The editorial board is a group of experts responsible for making decisions on the content, quality, and direction of a journal. They are also involved in peer review and setting ethical standards for submissions.",
                    },
                    {
                      term: "Conference Proceedings",
                      definition:
                        "Conference proceedings are collections of papers presented at academic conferences. These papers often reflect cutting-edge research in a particular field and are usually published as part of the event's official records.",
                    },
                    {
                      term: "Research Data",
                      definition:
                        "Research data refers to the raw, unprocessed information collected during the course of a study. It can include numerical data, observational notes, or even multimedia, and is essential for the transparency and reproducibility of scientific research.",
                    },
                    {
                      term: "Reproducibility",
                      definition:
                        "Reproducibility refers to the ability to replicate the results of a study using the same data and methodology. It is a critical component of scientific validity and ensures that findings are reliable and not based on chance or errors.",
                    },
                    {
                      term: "Research Impact",
                      definition:
                        "Research impact refers to the influence that research outcomes have on their field of study, society, or policy. It is often measured by citation counts, policy adoption, or public awareness, and helps demonstrate the value of academic work.",
                    },
                    {
                      term: "Research Grant",
                      definition:
                        "A research grant is a financial award provided to researchers to fund their academic projects. Grants can be provided by government agencies, universities, or private foundations, and they are often competitive and subject to stringent requirements.",
                    },
                    {
                      term: "Research Ethics",
                      definition:
                        "Research ethics refers to the moral principles that guide researchers in their work. These principles ensure that research is conducted responsibly, protecting participants' rights and ensuring the integrity and transparency of the research process.",
                    },
                    {
                      term: "Research Proposal",
                      definition:
                        "A research proposal is a document outlining the objectives, methods, and significance of a proposed research project. It is submitted to funding bodies or institutions to secure approval or financial support before the actual research begins.",
                    },
                    {
                      term: "Manuscript Revision",
                      definition:
                        "Manuscript revision is the process by which authors make changes to their submitted papers based on reviewer feedback. This can include rewriting sections, adding new data, or correcting errors before the paper is resubmitted for final review.",
                    },
                    {
                      term: "Quantitative Research",
                      definition:
                        "Quantitative research is a systematic investigation that focuses on numerical data and statistical analysis to identify patterns, relationships, or trends. It is often used to test hypotheses and validate theories in fields like social science, economics, and medicine.",
                    },
                    {
                      term: "Qualitative Research",
                      definition:
                        "Qualitative research is a method of inquiry that focuses on understanding human experiences, behaviors, and interactions through non-numerical data, such as interviews, observations, and case studies. It is often used in the social sciences to explore complex phenomena.",
                    },
                    {
                      term: "Research Collaboration",
                      definition:
                        "Research collaboration involves two or more researchers or institutions working together on a study or project. Collaborations often combine expertise and resources to tackle complex questions or produce more comprehensive findings.",
                    },
                    {
                      term: "Research Journal",
                      definition:
                        "A research journal is a periodical publication that features scholarly articles and papers on specific areas of academic research. These journals are often peer-reviewed and serve as a platform for researchers to share their findings with the academic community.",
                    },
                  ].map((item, index) => (
                    <li key={index} style={styles.listItem}>
                      <strong>{item.term}</strong> - {item.definition}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {selectedTopic === "What exactly is Journal?" && (
            <>
              <div style={styles.imageTextContainer}>
                <img
                  src="./images/res2.jpeg"
                  alt="Scopus and UGC"
                  style={{
                    ...styles.image,
                    width: "70%", // Adjust width as needed
                    height: "380px", // Keep height proportional
                  }}
                />
                <p style={styles.paragraph}>
                  A journal in the academic field is a publication that shares
                  research articles and studies on specific topics. These
                  journals are published regularly, such as every month or every
                  few months, and they focus on particular subjects like
                  science, medicine, or social studies. Journals are important
                  because they give researchers a place to share their
                  discoveries and ideas with others. Most journal articles are
                  reviewed by experts in the field before they are published,
                  ensuring that the research is accurate and trustworthy. This
                  process is called "peer review." Journals help maintain high
                  standards of quality in research and allow researchers to stay
                  updated on new findings in their area of interest.{" "}
                </p>
              </div>
              <p style={styles.paragraph}>
                Journals can cover broad topics or focus on very specific
                subjects. They are useful resources for students, teachers, and
                professionals who need reliable and detailed information.
                Besides original research, journals may also include reviews,
                expert opinions, and special issues on new trends in the field.{" "}
              </p>
            </>
          )}

          {selectedTopic === "A Beginner's Guide to Publishing Research" && (
            <>
              <div style={styles.imageTextContainer}>
                <img
                  src="./images/res4.webp"
                  alt="Scopus and UGC"
                  style={{
                    ...styles.image,
                    width: "70%", // Adjust width as needed
                    height: "380px", // Keep height proportional
                  }}
                />
                <p style={styles.paragraph}>
                  Publishing your research is an essential part of your academic
                  journey. It's the way you share your findings with the wider
                  community, gain recognition for your work, and contribute to
                  the advancement of knowledge in your field. While the exact
                  process may vary depending on the journal or research
                  discipline, the core steps remain largely the same. First, you
                  must choose the right journal that aligns with your research
                  topic and goals. Once you've selected a journal, the next step
                  is writing your paper, ensuring it is clear, well-organized,
                  and adheres to the journal’s guidelines. After preparing your
                  manuscript, you will submit it to the journal, where it will
                  undergo peer review—a process where experts in your field
                  evaluate the quality, significance, and originality of your
                  work. Following this, you’ll likely need to revise your paper
                  based on the feedback you receive. If your paper is accepted,
                  it will go through the production process, where it is edited,
                  formatted, and prepared for publication. Finally, once
                  published, your research is made available to the public and
                  can have a significant impact on your field of study.
                </p>
              </div>
            </>
          )}

          {selectedTopic === "Step1: Choosing a journal" && (
            <>
              <div style={styles.imageTextContainer}>
                <img
                  src="./images/res5.webp"
                  alt="Scopus and UGC"
                  style={{
                    ...styles.image,
                    width: "70%", // Adjust width as needed
                    height: "380px", // Keep height proportional
                  }}
                />
                <p style={styles.paragraph}>
                  Choosing the right journal for your research is a crucial step
                  in the publishing process, and while it may feel overwhelming
                  at first, it can be simplified with the right approach. Taking
                  time to carefully select a journal ensures that your work
                  reaches the appropriate audience and avoids the common mistake
                  of submitting to a journal that isn't aligned with your
                  research focus—one of the top reasons for article rejection by
                  editors. By asking a few key questions about your research and
                  the journals in your field, you can effectively narrow your
                  options and focus on the best choices for your work. Ideally,
                  you should begin thinking about where you want to publish your
                  research even before you start writing. Identifying a journal
                  early allows you to shape your article in a way that aligns
                  with the journal’s scope, readership, and format. This
                  strategic approach enables you to build on existing
                  conversations within the journal, making it easier for editors
                  to recognize how your research contributes to ongoing
                  discussions in your field.
                </p>
              </div>
              <p style={styles.paragraph}>
                To begin, start by building a shortlist of potential journals.
                Look for publications that align with your field of study, have
                a strong reputation, and publish work that resonates with the
                core themes of your research. Next, refine this list by
                reviewing each journal’s aims, scope, and recent issues to
                determine whether your research aligns with their focus areas.
                Take note of whether the journal values open data—publishing
                research that is accessible and transparent—or open access,
                which ensures your work is freely available to the global
                research community. Open access can significantly broaden the
                reach and impact of your research, making it a valuable
                consideration. In addition, citation metrics, such as the
                journal’s impact factor and h-index, can provide insight into
                its reputation and influence within the academic community.
                While high-impact journals often attract broader attention,
                remember that the best choice is not always the most prestigious
                journal, but the one that aligns most closely with your research
                goals and audience. Finally, consider open access options if
                your aim is to make your research widely available, as this can
                enhance visibility and foster greater collaboration within your
                field. By carefully considering these factors and investing time
                in selecting the right journal, you not only increase your
                chances of successful publication but also ensure that your
                research makes a meaningful contribution to your academic
                community. The effort spent in choosing the best journal will
                pay off by maximizing the impact and recognition of your hard
                work.
              </p>
            </>
          )}
          {selectedTopic === "Step2: Writing your paper" && (
            <>
              <div style={styles.imageTextContainer}>
                <img
                  src="./images/res6.webp"
                  alt="Scopus and UGC"
                  style={{
                    ...styles.image,
                    width: "70%", // Adjust width as needed
                    height: "380px", // Keep height proportional
                  }}
                />
                <p style={styles.paragraph}>
                  Writing your research paper is a crucial step in sharing your
                  findings with the academic community, and crafting an
                  effective manuscript can significantly enhance its chances of
                  acceptance. To begin, it’s essential to understand your
                  audience and tailor your writing to meet the needs of the
                  journal’s readership. Familiarize yourself with the journal’s
                  guidelines, including its scope, preferred formats, and
                  submission requirements, as this ensures your paper aligns
                  with their expectations. Structuring your article
                  logically—with a clear introduction, methodology, results, and
                  conclusion—makes it easier for readers to follow your research
                  journey.
                </p>
              </div>
              <p style={styles.paragraph}>
                When writing your manuscript, focus on clarity, precision, and
                conciseness. Avoid jargon unless necessary, and use simple
                language to explain complex ideas. Adhering to proper
                formatting, such as citation styles and figure placements, is
                equally important to maintain a professional presentation.
                Before submitting, thoroughly proofread your paper to eliminate
                errors, seek feedback from peers, and incorporate their
                suggestions. Enhancing your paper by adding visuals like charts
                and diagrams can make your findings more impactful and easier to
                comprehend. By paying attention to these details, you can create
                a well-written and compelling research paper that stands out to
                reviewers and editors
              </p>
            </>
          )}
          {selectedTopic === "Step3: Making your submission" && (
            <>
              <div style={styles.imageTextContainer}>
                <img
                  src="./images/res7.webp"
                  alt="Scopus and UGC"
                  style={{
                    ...styles.image,
                    width: "70%", // Adjust width as needed
                    height: "380px", // Keep height proportional
                  }}
                />
                <p style={styles.paragraph}>
                  Submitting your research paper is a critical milestone in the
                  journey to publication, as it represents your opportunity to
                  share your work with the academic world. Before submission,
                  take the time to ensure your manuscript meets the journal's
                  specific guidelines, including formatting, word count, and
                  referencing style. Every journal operates slightly
                  differently, often using an online submission system to manage
                  the process efficiently. Familiarizing yourself with this
                  system in advance can save you time and reduce errors during
                  submission.
                </p>
              </div>
              <p style={styles.paragraph}>
                In today’s academic landscape, data sharing is an essential part
                of publishing, as it encourages collaboration, transparency, and
                further exploration of your findings. Be prepared to include
                supporting datasets, supplementary materials, or ethical
                statements as required by the journal. A thorough submission
                checklist can help you verify that every detail is addressed,
                from the manuscript’s structure to the inclusion of key
                documents like a cover letter or disclosure forms. By carefully
                preparing your submission and addressing all requirements, you
                enhance the chances of a smooth review process, allowing your
                work to reach its audience without unnecessary delays.
              </p>
            </>
          )}
          {selectedTopic === "Step4: Understanding the peer review process" && (
            <>
              <div style={styles.imageTextContainer}>
                <img
                  src="./images/res8.webp"
                  alt="Scopus and UGC"
                  style={{
                    ...styles.image,
                    width: "70%", // Adjust width as needed
                    height: "380px", // Keep height proportional
                  }}
                />
                <p style={styles.paragraph}>
                  Peer review is a crucial step in the journey of publishing
                  your research. Once you submit your paper to a journal, it
                  undergoes a rigorous evaluation by independent experts in your
                  field. These reviewers assess the validity, originality, and
                  significance of your work, ensuring it meets the high
                  standards of academic publishing. This process helps maintain
                  the quality and credibility of published research, making peer
                  review a cornerstone of scholarly communication. There are
                  different types of peer review, such as single-blind,
                  double-blind, and open peer review, each with its own approach
                  to maintaining fairness and transparency. Some platforms, like
                  F1000 Research, offer innovative models like open and
                  post-publication peer review, where feedback is publicly
                  available, promoting greater accountability and collaboration.
                </p>
              </div>
              <p style={styles.paragraph}>
                Understanding the peer review process can make it less
                intimidating. Learning how to respond effectively to reviewer
                comments is essential, as it often involves addressing
                constructive feedback, revising your work, and sometimes
                engaging in detailed discussions with reviewers. Even if your
                paper is rejected, it can be an opportunity to improve your
                research and submit it elsewhere. Becoming a peer reviewer
                yourself is also a rewarding experience, offering insights into
                the publication process and helping you develop a critical eye
                for evaluating research. Whether you’re an author or reviewer,
                peer review fosters growth and learning, enhancing the integrity
                of academic work. For further insights, explore resources that
                delve into responding to reviewer comments, dealing with
                rejection, and even how to become a peer reviewer. These tools
                will equip you to navigate the peer review process with
                confidence and resilience.
              </p>
            </>
          )}
          {selectedTopic === "Step5: Moving through production" && (
            <>
              <div style={styles.imageTextContainer}>
                <img
                  src="./images/res9.webp"
                  alt="Scopus and UGC"
                  style={{
                    ...styles.image,
                    width: "70%", // Adjust width as needed
                    height: "380px", // Keep height proportional
                  }}
                />
                <p style={styles.paragraph}>
                  After your article has been accepted for publication, it
                  enters the production phase—a crucial step in preparing your
                  work for the world to see. This process begins with copy
                  editing, where editors polish your manuscript to ensure
                  clarity, accuracy, and adherence to journal guidelines. Once
                  this is complete, your proofs are created, marking a pivotal
                  moment where your research is nearly ready for publication. At
                  this stage, you will also sign a publishing agreement. If
                  you’ve submitted to an Open Select journal, you’ll have the
                  opportunity to decide whether to publish your article as open
                  access, making it freely available to a wider audience.
                </p>
              </div>
              <p style={styles.paragraph}>
                When your proofs are ready, you will receive an email
                notification, often with specific instructions on how to review
                them. Depending on the journal, you may use a Central Article
                Tracking System (CATS) or an Online Correction Tool (OCT) for
                this purpose. It’s important to carefully read the instructions
                to ensure a smooth review process. Checking your proofs is an
                essential task. This is your chance to carefully review your
                article for any errors in the text, figures, or formatting.
                Refer to guides provided by the journal, and if necessary, use
                tools like Adobe to make corrections efficiently. A
                well-reviewed proof ensures that your article will be error-free
                and professional when it reaches its audience. To avoid delays,
                follow all submission and correction guidelines closely. Taking
                the time to review your proofs thoroughly ensures your work is
                presented in the best possible light and avoids unnecessary
                complications during the production process. By the end of this
                phase, your research will be polished, published, and ready to
                contribute to the academic conversation, marking a proud
                milestone in your scholarly journey.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResearchStep;