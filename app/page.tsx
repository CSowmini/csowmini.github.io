import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import ChatBot from './components/ChatBot';
import LightSwitch from './components/LightSwitch';

export default function Home() {
  return (
    <main className="min-h-screen transition-colors duration-500">
      <Hero />
      
      {/* Cards section */}
      <div className="max-w-[1200px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left column - About and Work Experience stacked */}
          <div className="flex flex-col gap-1.5">
            <About />
            <Experience />
          </div>
          
          {/* Right side - Projects and Contact */}
          <Projects />
          <Contact />
        </div>
      </div>

      {/* More space before ChatBot */}
      <div className="pt-8">
        <ChatBot />
      </div>
      
      <LightSwitch />
    </main>
  );
}
