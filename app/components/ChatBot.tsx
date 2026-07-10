'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Mic } from 'lucide-react';

/** Detects whether the page is currently dark by sampling actual rendered colors. */
function detectDark(): boolean {
  if (typeof window === 'undefined') return false;

  const parseRGB = (value: string): number[] | null => {
    const nums = value.match(/[\d.]+/g);
    if (!nums || nums.length < 3) return null;
    return nums.map(Number);
  };

  // 1. Try background color of body, then html
  for (const el of [document.body, document.documentElement]) {
    const bg = window.getComputedStyle(el).backgroundColor;
    const rgb = parseRGB(bg);
    if (rgb) {
      const alpha = rgb.length > 3 ? rgb[3] : 1;
      if (alpha > 0.1) {
        const luminance = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
        return luminance < 128; // dark background => dark theme
      }
    }
  }

  // 2. Fallback: text color of body (light text => dark theme)
  const color = parseRGB(window.getComputedStyle(document.body).color);
  if (color) {
    const luminance = 0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2];
    return luminance > 128; // light text => dark theme
  }

  return false;
}

export default function ChatBot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'bot', text: string }>>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Watch the page for theme changes (works with any toggle mechanism)
  useEffect(() => {
    const update = () => setIsDark(detectDark());
    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      subtree: true,
      attributeFilter: ['class', 'style', 'data-theme'],
    });

    return () => observer.disconnect();
  }, []);

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
      botResponse = "Chandrika is a Data Analyst with 4+ years of experience. She has an MS in Data Science from Indiana University and specializes in statistical modeling, data visualization, and turning complex data into actionable insights.";
    } else if (question.toLowerCase().includes('experience')) {
      botResponse = "She has 4+ years of experience working at Delineate. Previously, she worked with Pacers Sports & Entertainment, the Indiana Department of Health, MISO, and Deloitte.";
    } else if (question.toLowerCase().includes('tools') || question.toLowerCase().includes('skills')) {
      botResponse = "She works with Python, R, SQL, Tableau, Power BI, Azure, Databricks, and various ML libraries.";
    } else if (question.toLowerCase().includes('speciali')) {
      botResponse = "Her specialties include statistical modeling, predictive analytics, data visualization, ETL pipelines, and dashboard development.";
    } else if (question.toLowerCase().includes('contact')) {
      botResponse = "You can reach her via email, LinkedIn, or GitHub!";
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleQuickQuestion(input);
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
            className={`fixed inset-0 z-50 flex flex-col ${isDark ? 'bg-black' : 'bg-white'}`}
          >
            <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                <button
                  onClick={handleClose}
                  className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-100'}`}
                >
                  <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
                <h1 className={`text-lg font-serif ${isDark ? 'text-white' : 'text-gray-500'}`}>
                  Ask ChandrikaGPT
                </h1>
                <div className="w-9" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8">
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.type === 'user' ? (
                      <div className="max-w-xl px-4 py-2.5 bg-[#5c4a3a] text-white rounded-2xl rounded-br-sm text-sm">
                        {message.text}
                      </div>
                    ) : (
                      <div className={`max-w-3xl px-5 py-4 rounded-xl text-sm leading-relaxed border-l-4 border-amber-500 ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-amber-50 text-gray-900'}`}>
                        {message.text}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={`border-t px-6 py-4 ${isDark ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white'}`}>
              <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="What would you like to know?"
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none transition-all text-sm ${
                      isDark
                        ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-400'
                    }`}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className={`absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                      isDark ? 'bg-[#f5e6d3] hover:bg-[#ebd9c0]' : 'bg-[#fdfdfd] hover:bg-[#ece8e4] border border-gray-200'
                    }`}
                  >
                    <Send className="w-4 h-4" style={{ color: isDark ? '#3a2e22' : '#374151' }} />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Normal ChatBot Section - Franck style, compact */}
      <section className="w-full py-10">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Title */}
          <h2 className={`text-lg font-serif font-normal text-center mb-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Ask ChandrikaGPT
          </h2>

          {/* Quick Questions - compact pills, single row on desktop */}
          <div className="flex flex-wrap md:flex-nowrap gap-2 justify-center mb-4">
            {quickQuestions.map((question) => (
              <button
                key={question}
                onClick={() => handleQuickQuestion(question)}
                className={`px-3 py-1.5 whitespace-nowrap rounded-full text-xs transition-colors border ${
                  isDark
                    ? 'bg-[#161616] text-gray-100 border-gray-700 hover:bg-[#222222]'
                    : 'bg-transparent text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {question}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSubmit} className="relative">
            <div className={`border rounded-2xl p-4 shadow-sm ${
              isDark ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-200'
            }`}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What would you like to know?"
                className={`w-full px-2 py-1 bg-transparent focus:outline-none text-sm ${
                  isDark ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                }`}
              />

              {/* Bottom row with mic and send */}
              <div className="flex justify-between items-center mt-3">
                <button
                  type="button"
                  className={`text-gray-400 transition-colors ${isDark ? 'hover:text-gray-200' : 'hover:text-gray-600'}`}
                >
                  <Mic className="w-5 h-5" strokeWidth={1.5} />
                </button>

                <button
                  type="submit"
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    isDark ? 'bg-[#f5e6d3] hover:bg-[#ebd9c0]' : 'bg-[#fdfdfd] hover:bg-[#ece8e4] border border-gray-200'
                  }`}
                >
                  <Send className="w-4 h-4" style={{ color: isDark ? '#3a2e22' : '#374151' }} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}