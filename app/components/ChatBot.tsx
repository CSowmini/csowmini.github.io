'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X } from 'lucide-react';

export default function ChatBot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'bot', text: string }>>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const quickQuestions = [
    "Who is Chandrika?",
    "What is her experience?",
    "Which tools does she use?",
    "What are her specialties?",
    "How can I contact her?"
  ];

  const handleQuickQuestion = (question: string) => {
    setIsFullScreen(true);
    
    const userMessage = { type: 'user' as const, text: question };
    setMessages(prev => [...prev, userMessage]);

    let botResponse = "Thanks for your question!";

    if (question.toLowerCase().includes('who') || question.toLowerCase().includes('chandrika')) {
      botResponse = "Chandrika is a Data Analyst with 4+ years of experience. She has an MS in Data Science from Indiana University and specializes in statistical modeling, data visualization, and turning complex data into actionable insights across public health, sports analytics, energy, and consulting sectors.";
    } else if (question.toLowerCase().includes('experience')) {
      botResponse = "She has 4+ years of experience working at Delineate. Previously, she worked with Pacers Sports & Entertainment on sports analytics, the Indiana Department of Health on public health data, MISO on energy analytics, and Deloitte on consulting projects.";
    } else if (question.toLowerCase().includes('tools') || question.toLowerCase().includes('skills')) {
      botResponse = "She works with Python, R, SQL for programming and analysis. For visualization, she uses Tableau and Power BI. She's experienced with Azure cloud platform, Databricks, and various machine learning libraries. She holds certifications in Databricks Data Engineer Associate and Data Visualization with Tableau.";
    } else if (question.toLowerCase().includes('speciali')) {
      botResponse = "Her specialties include statistical modeling and hypothesis testing, predictive analytics and time series forecasting, data visualization and storytelling, ETL pipeline development, creating interactive dashboards, and working with Azure cloud solutions. She focuses on healthcare and mission-driven organizations.";
    } else if (question.toLowerCase().includes('contact')) {
      botResponse = "You can reach her via email, LinkedIn, or GitHub. All contact links are available in the Contact card!";
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsFullScreen(true);

    const userMessage = { type: 'user' as const, text: input };
    setMessages(prev => [...prev, userMessage]);

    let botResponse = "Thanks for your question!";

    if (input.toLowerCase().includes('who') || input.toLowerCase().includes('chandrika')) {
      botResponse = "Chandrika is a Data Analyst with 4+ years of experience. She has an MS in Data Science from Indiana University and specializes in statistical modeling, data visualization, and turning complex data into actionable insights across public health, sports analytics, energy, and consulting sectors.";
    } else if (input.toLowerCase().includes('experience')) {
      botResponse = "She has 4+ years of experience working at Delineate. Previously, she worked with Pacers Sports & Entertainment on sports analytics, the Indiana Department of Health on public health data, MISO on energy analytics, and Deloitte on consulting projects.";
    } else if (input.toLowerCase().includes('tools') || input.toLowerCase().includes('skills')) {
      botResponse = "She works with Python, R, SQL for programming and analysis. For visualization, she uses Tableau and Power BI. She's experienced with Azure cloud platform, Databricks, and various machine learning libraries. She holds certifications in Databricks Data Engineer Associate and Data Visualization with Tableau.";
    } else if (input.toLowerCase().includes('speciali')) {
      botResponse = "Her specialties include statistical modeling and hypothesis testing, predictive analytics and time series forecasting, data visualization and storytelling, ETL pipeline development, creating interactive dashboards, and working with Azure cloud solutions.";
    } else if (input.toLowerCase().includes('contact')) {
      botResponse = "You can reach her via email, LinkedIn, or GitHub!";
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
    }, 500);

    setInput('');
  };

  const handleClose = () => {
    setIsFullScreen(false);
  };

  return (
    <>
      {/* Full Screen Chat Overlay */}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white light-mode:bg-white dark:bg-black z-50 flex flex-col"
          >
            {/* Header with close button */}
            <div className="px-6 py-4 border-b border-gray-200 light-mode:border-gray-200 dark:border-gray-800">
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 light-mode:hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 light-mode:text-gray-600 dark:text-gray-400" />
                </button>
                <h1 className="text-lg font-serif text-gray-900 light-mode:text-gray-900 dark:text-white">
                  Ask ChandrikaGPT
                </h1>
                <div className="w-9" />
              </div>
            </div>

            {/* Messages area - scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-8">
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.type === 'user' ? (
                      <div className="max-w-xl px-4 py-2.5 bg-gray-700 light-mode:bg-gray-700 dark:bg-gray-700 text-white rounded-2xl rounded-br-sm text-sm">
                        {message.text}
                      </div>
                    ) : (
                      <div className="max-w-3xl px-5 py-4 bg-amber-50 light-mode:bg-amber-50 dark:bg-gray-800 text-gray-900 light-mode:text-gray-900 dark:text-gray-100 rounded-xl text-sm leading-relaxed border-l-4 border-amber-500 dark:border-amber-500">
                        {message.text}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Input at bottom - sticky */}
            <div className="border-t border-gray-200 light-mode:border-gray-200 dark:border-gray-800 bg-white light-mode:bg-white dark:bg-black px-6 py-4">
              <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="What would you like to know?"
                    className="w-full px-4 py-3 pr-12 bg-white light-mode:bg-white dark:bg-gray-900 border border-gray-300 light-mode:border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-gray-400 transition-all text-gray-900 light-mode:text-gray-900 dark:text-white placeholder-gray-500 light-mode:placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg flex items-center justify-center hover:from-amber-700 hover:to-amber-800 transition-all"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Normal ChatBot Section */}
      <section className="w-full py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-base font-normal text-center text-white light-mode:text-gray-600 mb-6">
            Ask ChandrikaGPT
          </h2>

          {/* Quick Questions */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {quickQuestions.map((question) => (
              <button
                key={question}
                onClick={() => handleQuickQuestion(question)}
                className="px-4 py-2 bg-gray-700/50 light-mode:bg-white rounded-full text-xs text-gray-300 light-mode:text-gray-700 transition-colors border border-gray-600/30 light-mode:border-gray-300 hover:bg-gray-600/50 light-mode:hover:bg-gray-100"
              >
                {question}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What would you like to know?"
              className="w-full px-4 py-3 pr-12 bg-gray-700/30 light-mode:bg-white border border-gray-600/30 light-mode:border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 light-mode:focus:border-gray-400 transition-all text-white light-mode:text-gray-900 placeholder-gray-400 light-mode:placeholder-gray-500 text-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg flex items-center justify-center hover:from-amber-700 hover:to-amber-800 transition-all"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
