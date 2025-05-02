import React from 'react';

const AITools = () => {
  const aiTools = [
    {
      name: "perplexity.ai",
      description: "A research assistant that can answer questions, summarize text, and help with various research tasks.",
      url: "https://www.perplexity.ai/"
    },
    {
      name: "hissab.io",
      description: "A tool that can calculate anything, from simple arithmetic to complex mathematical equations.",
      url: "https://hissab.io/"
    },
    {
      name: "otter.ai",
      description: "Software that can automatically transcribe and generate notes from audio recordings, such as lectures or meetings.",
      url: "https://otter.ai/"
    },
    {
      name: "stepwisemath.ai",
      description: "A math tutor that can provide step-by-step solutions and explanations for a wide range of math problems.",
      url: "https://www.stepwisemath.ai/"
    },
    {
      name: "scholarcy.com",
      description: "An article summarizer that can quickly extract the key points and insights from research papers and academic articles.",
      url: "https://www.scholarcy.com/"
    },
    {
      name: "caktus.ai",
      description: "A comprehensive study tool that can help students with note-taking, task management, and other academic productivity features.",
      url: "https://caktus.ai/"
    },
    {
      name: "bookai.chat",
      description: "A chatbot that can discuss and provide information about books, allowing users to engage in conversations about literature.",
      url: "https://bookai.chat/"
    },
    {
      name: "chatdoc.com",
      description: "A tool that enables users to chat with and ask questions about various documents, such as research papers or technical manuals.",
      url: "https://chatdoc.com/"
    },
    {
      name: "textero.ai",
      description: "An essay generator that can assist with writing tasks by providing topic ideas, outlines, and even draft text.",
      url: "https://textero.ai/"
    },
    {
      name: "jenni.ai",
      description: "A writing assistant that can help students and researchers craft high-quality research papers and other academic documents.",
      url: "https://jenni.ai/"
    },
    {
      name: "tome.app",
      description: "A presentation generator that can create professional-looking slides and visuals to support lectures, talks, or project presentations.",
      url: "https://www.tome.app/"
    },
    {
      name: "plaito.ai",
      description: "A personalized tutor that can provide customized learning experiences and support for students in various subjects.",
      url: "https://www.plaito.ai/"
    },
    {
      name: "heyscience.ai",
      description: "A research assistant that can help with literature reviews, data analysis, and other tasks related to scientific research.",
      url: "https://heyscience.ai/"
    },
    {
      name: "wisdolia.com",
      description: "A flashcard generator that can create personalized study materials to help students memorize and retain information.",
      url: "https://wisdolia.com/"
    },
    {
      name: "duolingo.com",
      description: "A language learning platform that uses gamification and adaptive methods to help users learn new languages effectively.",
      url: "https://www.duolingo.com/"
    },
    {
      name: "knowlj.com",
      description: "A vocabulary learning tool that can help students expand their word knowledge and improve their language proficiency.",
      url: "https://knowlj.com/"
    },
    {
      name: "quillbot.com",
      description: "A grammar checker and writing assistant that can identify and correct grammatical errors, improve sentence structure, and enhance the overall quality of written work.",
      url: "https://www.quillbot.com/"
    },
    {
      name: "consensus.app",
      description: "A tool that can extract key information and answers from documents, helping users quickly find the most relevant data.",
      url: "https://www.consensus.app/"
    },
    {
      name: "knewton.com",
      description: "An adaptive learning platform that personalizes the learning experience based on a student's strengths, weaknesses, and progress.",
      url: "https://www.knewton.com/"
    },
    {
      name: "grammarly.com",
      description: "A comprehensive writing assistant that can detect and correct grammatical errors, improve sentence structure, and provide suggestions for enhancing the overall quality of written work.",
      url: "https://www.grammarly.com/"
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">AI Tools for Research</h1>
        <p className="text-lg text-center mb-10">
          Explore these powerful AI tools to enhance your research and academic work
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiTools.map((tool, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <a 
                href={tool.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-6 h-full"
              >
                <div className="flex items-start h-full flex-col">
                  <h2 className="text-xl font-semibold mb-2 text-blue-600">{tool.name}</h2>
                  <p className="text-gray-700 flex-grow">{tool.description}</p>
                  <div className="mt-4 text-blue-500 font-medium text-sm">
                    Visit Website →
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AITools;