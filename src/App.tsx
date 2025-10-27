// This file contains the main frontend functionality of the entire website

import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, ExternalLink, Code2, Brain, Globe, Sparkles, ArrowRight, FileText, GraduationCap, Briefcase, Target, ChevronLeft, ChevronRight, X } from 'lucide-react';
import websiteScreenshot from './website-screenshot.png';

function App() {
  // State to track if the user has scrolled
  const [isScrolled, setIsScrolled] = useState(false);
  // State to store the text being typed
  const [text, setText] = useState('');
  // State to check if typing animation is complete
  const [typingComplete, setTypingComplete] = useState(false);
  // State to track the currently active section
  const [activeSection, setActiveSection] = useState('home');
  // State to track current image index for each project carousel
  const [currentImageIndices, setCurrentImageIndices] = useState<{ [key: number]: number }>({});
  // State for image preview modal
  const [modalData, setModalData] = useState<{ images: string[]; alt: string; currentIndex: number } | null>(null);
  // State for letter displacement animation
  const [letterOffsets, setLetterOffsets] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    let currentIndex = 0;
    const fullText = 'Ammar Suleyman';
    // Typing effect interval
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTypingComplete(true);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      
      const sections = ['home', 'about', 'projects', 'resume'];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle ESC key to close modal and arrow keys to navigate
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalData) {
        setModalData(null);
      } else if (modalData) {
        if (e.key === 'ArrowRight') {
          setModalData(prev => prev ? {
            ...prev,
            currentIndex: (prev.currentIndex + 1) % prev.images.length
          } : null);
        } else if (e.key === 'ArrowLeft') {
          setModalData(prev => prev ? {
            ...prev,
            currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length
          } : null);
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [modalData]);

  // Function to scroll to a specific section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  // Function to handle image carousel navigation
  const nextImage = (projectIndex: number, totalImages: number) => {
    setCurrentImageIndices(prev => ({
      ...prev,
      [projectIndex]: ((prev[projectIndex] || 0) + 1) % totalImages
    }));
  };

  const previousImage = (projectIndex: number, totalImages: number) => {
    setCurrentImageIndices(prev => ({
      ...prev,
      [projectIndex]: ((prev[projectIndex] || 0) - 1 + totalImages) % totalImages
    }));
  };

  // Handle mouse move for letter animation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!typingComplete) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate offsets for each letter
    const fullText = 'Ammar Suleyman';
    const newOffsets = fullText.split('').map((_, index) => {
      const letterWidth = rect.width / fullText.length;
      const letterCenterX = (index + 0.5) * letterWidth;
      
      const dx = mouseX - letterCenterX;
      const dy = mouseY - rect.height / 2;
      
      // Use inverse distance with damping
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 100;
      
      if (distance < maxDistance && distance > 0) {
        const strength = (maxDistance - distance) / maxDistance;
        // Invert the direction for repulsion (away from mouse)
        return {
          x: (-dx / distance) * strength * 30,
          y: (-dy / distance) * strength * 30
        };
      }
      return { x: 0, y: 0 };
    });
    
    setLetterOffsets(newOffsets);
  };

  const handleMouseLeave = () => {
    setLetterOffsets([]);
  };

  // URL for the resume
  const resumeUrl = "/AmmarSuleyman.pdf";

  // List of projects
  const projects = [
  {
    title: "MindSync",
    description: "Full-stack AI productivity app that automates study planning and time management. Developed with React, Node.js, and PostgreSQL, and hosted on AWS EC2 to support 1,000+ users.",
    image: "/mindsync_sample.png",
    images: ["/mindsync_sample.png"],
    tags: ["React/TypeScript", "Node.js + Express", "PostgreSQL", "OpenAI", "AWS"],
    link: "https://github.com/ammarcodes29/MindSync",
    category: "Full-stack + AI"
  },
  {
    title: "CryptoAPI",
    description: "A lightweight, production-ready REST API built with FastAPI that provides real-time cryptocurrency data from LiveCoinWatch. Features intelligent caching, comprehensive error handling, and bonus search capabilities.",
    image: "/cryptoAPI_sample1.png",
    images: ["/cryptoAPI_sample1.png", "/cryptoAPI_sample2.png"],
    tags: ["Python", "FastAPI", "RestAPI", "LiveCoinWatch API"],
    link: "https://github.com/ammarcodes29/cryptoAPI",
    category: "Backend/API Programming"
  },
  {
    title: "SalesVision AI",
    description: "AI-powered sales forecasting web app using Gradient Boosting and Upgini to predict 3-month trends with 20% higher accuracy.",
    image: "/salesvision_sample1.png",
    images: ["/salesvision_sample1.png", "/salesvision_sample2.png"],
    tags: ["Python", "Pandas", "NumPy", "Upgini"],
    link: "https://github.com/ammarcodes29/SalesVision-AI",
    category: "Machine Learning + Data Analysis"
  },
  {
    title: "GPU Triage Copilot",
    description: "An AI-powered assistant designed to automate and streamline the debugging and analysis of Graphics Processing Unit (GPU) issues.",
    image: "/gpu_sample.png",
    images: ["/gpu_sample.png"],
    tags: ["TypeScript", "NVIDIA Nemotron Model", "Vercel v0"],
    link: "https://v0-gpu-log-analyzer.vercel.app/",
    category: "APIs + AI"
  }
];
  
  return (
    <div className="min-h-screen bg-slate-950">
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-950/70 backdrop-blur-md border-b border-slate-800/20' 
          : 'bg-transparent border-b border-slate-800/20'
      }`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center h-20">
            <div className="flex space-x-8">
              <button 
                onClick={() => scrollToSection('home')} 
                className={`text-slate-300 hover:text-sky-400 transition-colors font-medium text-lg relative group ${activeSection === 'home' ? 'text-sky-400' : ''}`}
              >
                Home
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-sky-400 transition-all duration-300 ${activeSection === 'home' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className={`text-slate-300 hover:text-sky-400 transition-colors font-medium text-lg relative group ${activeSection === 'about' ? 'text-sky-400' : ''}`}
              >
                About
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-sky-400 transition-all duration-300 ${activeSection === 'about' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </button>
              <button 
                onClick={() => scrollToSection('projects')} 
                className={`text-slate-300 hover:text-sky-400 transition-colors font-medium text-lg relative group ${activeSection === 'projects' ? 'text-sky-400' : ''}`}
              >
                Projects
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-sky-400 transition-all duration-300 ${activeSection === 'projects' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </button>
              <a 
                href={resumeUrl}
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-300 hover:text-sky-400 transition-colors font-medium text-lg relative group"
              >
                Resume
                <span className="absolute -bottom-1 left-0 h-0.5 bg-sky-400 transition-all duration-300 w-0 group-hover:w-full"></span>
              </a>
            </div>
          </div>
        </div>
      </nav>
      
      {/* home page */}
      <section id="home" className="relative min-h-screen flex items-center justify-center">
        {/* gradient for the home page*/}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-cyan-500/10 to-violet-500/10"></div>
          <div className="absolute inset-0 bg-noise opacity-[0.1] mix-blend-overlay"></div>
        </div>
        <div className="relative text-center px-4">
          <p className="text-2xl md:text-4xl text-slate-300 mb-4 font-medium">
            Hello! I'm
          </p>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 relative group">
            <div
              className="relative inline-flex cursor-pointer"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-sky-400/10 to-cyan-400/10 blur-xl transform group-hover:scale-110 transition-transform duration-500"></span>
              <div className="relative inline-flex">
                {text.split('').map((char, index) => {
                  const offset = letterOffsets[index] || { x: 0, y: 0 };
                  const isSpace = char === ' ';
                  return (
                    <span
                      key={index}
                      className="inline-block bg-gradient-to-r from-sky-400 to-cyan-400 text-transparent bg-clip-text"
                      style={{
                        transform: `translate(${offset.x}px, ${offset.y}px)`,
                        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      }}
                    >
                      {isSpace ? '\u00A0' : char}
                    </span>
                  );
                })}
                {!typingComplete && <span className="animate-blink inline-block bg-gradient-to-r from-sky-400 to-cyan-400 text-transparent bg-clip-text">|</span>}
              </div>
            </div>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-slate-300">Computer Science Student & Developer</p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button 
              onClick={() => scrollToSection('projects')}
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-lg hover:from-sky-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg shadow-cyan-500/50"
            >
              View Projects
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="px-6 py-3 bg-slate-800/50 text-slate-100 border border-sky-500/30 rounded-lg hover:bg-slate-800/70 transition-all shadow-md hover:shadow-lg"
            >
              About Me
            </button>
          </div>
          <div className="flex justify-center space-x-8">
            <a 
              href="https://github.com/ammarcodes29" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group relative hover:text-sky-400 transition-colors text-slate-300 transform hover:scale-110 duration-300"
            >
              <Github size={26} />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                GitHub Profile
              </span>
            </a>
            <a 
              href="https://www.linkedin.com/in/ammar-suleyman" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group relative hover:text-sky-400 transition-colors text-slate-300 transform hover:scale-110 duration-300"
            >
              <Linkedin size={26} />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                LinkedIn Profile
              </span>
            </a>
            <a 
              href="mailto:ammarsuleyman11@gmail.com" 
              className="group relative hover:text-sky-400 transition-colors text-slate-300 transform hover:scale-110 duration-300"
            >
              <Mail size={26} />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Send Email
              </span>
            </a>
            <a 
              href={resumeUrl}
              target="_blank" 
              rel="noopener noreferrer" 
              className="group relative hover:text-sky-400 transition-colors text-slate-300 transform hover:scale-110 duration-300"
            >
              <FileText size={26} />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                View Resume
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* About Me  */}
      <section id="about" className="relative min-h-screen py-20 bg-slate-950">
        <div className="max-w-5xl mx-auto px-4">
          <div className="space-y-16">
            <div className="text-center">
              <h2 className="text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent bg-[length:120%_auto] hover:bg-[length:200%_auto] transition-all duration-500">
                  About Me
                </span>
              </h2>
              <p className="text-2xl text-slate-300 max-w-5xl mx-auto">
              Hi! My name is Ammar Suleyman. I am a third-year Computer Science student at San Jose State University 
              with a passion for full-stack development, AI applications, and user-focused software solutions. My experiences 
              include developing and deploying AI-powered applications and personal 
              projects, and enhancing customer experiences as an Apple Specialist. To see a detailed description of what lies below, 
                 <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline"> click here!</a>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-slate-900/50 border border-sky-500/20 p-8 rounded-2xl shadow-sm hover:shadow-md hover:border-sky-500/40 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <GraduationCap className="w-8 h-8 text-sky-400" />
                  <h3 className="text-2xl font-semibold text-slate-100 ml-4">Education</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-medium text-slate-100">Bachelors in Computer Science</h4>
                    <p className="text-lg text-slate-300">San José State University</p>
                    <p className="text-base text-slate-400">Expected Graduation: December 2026</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-cyan-500/20 p-8 rounded-2xl shadow-sm hover:shadow-md hover:border-cyan-500/40 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <Briefcase className="w-8 h-8 text-cyan-400" />
                  <h3 className="text-2xl font-semibold text-slate-100 ml-4">Experience</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-medium text-slate-100">Product Specialist</h4>
                    <p className="text-lg text-slate-300">Apple - San Jose, CA</p>
                    <p className="text-base text-slate-400">October 2023 - Present</p>
                  </div>
                 <div>
                    <h4 className="text-xl font-medium text-slate-100">Software Engineer Fellow</h4>
                    <p className="text-lg text-slate-300">Headstarter AI - Remote US</p>
                    <p className="text-base text-slate-400">July - September 2024</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-violet-500/20 p-8 rounded-2xl shadow-sm hover:shadow-md hover:border-violet-500/40 transition-all duration-300">
              <div className="flex items-center mb-6">
                <Target className="w-8 h-8 text-violet-400" />
                <h3 className="text-2xl font-semibold text-slate-100 ml-4">Goals & Interests</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xl font-medium text-slate-100 mb-4">Technical Interests</h4>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-center">
                      <Code2 className="w-5 h-5 text-sky-400 mr-2" />
                      Full-Stack Development
                    </li>
                    <li className="flex items-center">
                      <Brain className="w-5 h-5 text-cyan-400 mr-2" />
                      Machine Learning & AI
                    </li>
                    <li className="flex items-center">
                      <Globe className="w-5 h-5 text-violet-400 mr-2" />
                      Cloud Computing
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-medium text-slate-100 mb-4">Professional Goals</h4>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-center">
                      <Sparkles className="w-5 h-5 text-sky-400 mr-2" />
                      Create Impactful Solutions
                    </li>
                    <li className="flex items-center">
                      <Github className="w-5 h-5 text-cyan-400 mr-2" />
                      Contribute to Open Source
                    </li>
                    <li className="flex items-center">
                      <Brain className="w-5 h-5 text-violet-400 mr-2" />
                      Advance AI Technology
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <a 
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-lg hover:from-sky-600 hover:to-cyan-600 transition-all duration-300 shadow-md hover:shadow-lg shadow-cyan-500/50 group"
              >
                View Full Resume
                <ArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* projects section */}
      <section id="projects" className="pt-28 pb-20 px-4 relative overflow-hidden">
        {/* Add matching gradient background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-cyan-500/10 to-violet-500/10"></div>
          </div>
          <div className="absolute inset-0 bg-noise opacity-[0.1] mix-blend-overlay"></div>
        </div>

        {/* Increase max-width from max-w-4xl to max-w-6xl */}
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <h2 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent bg-[length:120%_auto] hover:bg-[length:200%_auto] transition-all duration-500">
              Featured Projects
            </span>
          </h2>
          <p className="text-2xl text-slate-300 max-w-5xl mx-auto mb-12">
            Here are some of the coolest things I've built!
          </p>
          
          <div className="space-y-8">
            {projects.map((project, index) => (
              <div key={index} className="group bg-slate-900/60 backdrop-blur-md rounded-xl overflow-hidden shadow-lg border border-slate-800/50 transition-all duration-300 hover:shadow-xl hover:border-sky-500/30">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 relative overflow-hidden rounded-l-xl group">
                    <img 
                      src={project.images[currentImageIndices[index] || 0]}
                      alt={project.title}
                      onClick={() => setModalData({ 
                        images: project.images, 
                        alt: project.title, 
                        currentIndex: currentImageIndices[index] || 0 
                      })}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    />
                    {project.images.length > 1 && (
                      <>
                        {/* Left Arrow */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            previousImage(index, project.images.length);
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 shadow-md active:opacity-100 touch:opacity-100"
                          aria-label="Previous image"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        {/* Right Arrow */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            nextImage(index, project.images.length);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 shadow-md active:opacity-100 touch:opacity-100"
                          aria-label="Next image"
                        >
                          <ChevronRight size={24} />
                        </button>
                        {/* Dot Indicators */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                          {project.images.map((_, imgIndex) => (
                            <button
                              key={imgIndex}
                              onClick={() => setCurrentImageIndices(prev => ({ ...prev, [index]: imgIndex }))}
                              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                (currentImageIndices[index] || 0) === imgIndex 
                                  ? 'bg-white w-6' 
                                  : 'bg-white/50'
                              }`}
                              aria-label={`Go to image ${imgIndex + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="md:w-2/3 p-8">
                    <h3 className="text-2xl font-semibold mb-3 text-slate-100">{project.title}</h3>
                    <p className="text-lg text-slate-300 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="px-3 py-1 bg-sky-500/20 text-sky-300 rounded-full text-sm font-medium border border-sky-500/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                      <a 
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sky-400 hover:text-sky-300 transition-colors"
                      >
                        View Project <ExternalLink size={16} className="ml-1" />
                      </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative py-8 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center space-x-6 mb-4">
            <a href="https://github.com/ammarcodes29" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors text-slate-400">
              <Github size={20} />
            </a>
            <a href="https://www.linkedin.com/in/ammar-suleyman" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors text-slate-400">
              <Linkedin size={20} />
            </a>
            <a href="mailto:ammarsuleyman11@gmail.com" className="hover:text-sky-400 transition-colors text-slate-400">
              <Mail size={20} />
            </a>
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors text-slate-400">
              <FileText size={20} />
            </a>
          </div>
          <p className="text-slate-400">© {new Date().getFullYear()} Ammar Suleyman. All rights reserved.</p>
        </div>
      </footer>

      {/* Image Preview Modal */}
      {modalData && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setModalData(null)}
        >
          <button
            onClick={() => setModalData(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2"
            aria-label="Close modal"
          >
            <X size={32} />
          </button>
          
          {/* Left Arrow */}
          {modalData.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setModalData(prev => prev ? {
                  ...prev,
                  currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length
                } : null);
              }}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-3"
              aria-label="Previous image"
            >
              <ChevronLeft size={36} />
            </button>
          )}
          
          {/* Right Arrow */}
          {modalData.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setModalData(prev => prev ? {
                  ...prev,
                  currentIndex: (prev.currentIndex + 1) % prev.images.length
                } : null);
              }}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-3"
              aria-label="Next image"
            >
              <ChevronRight size={36} />
            </button>
          )}
          
          <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            <img
              src={modalData.images[modalData.currentIndex]}
              alt={modalData.alt}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          {/* Image Counter */}
          {modalData.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full text-sm">
              {modalData.currentIndex + 1} / {modalData.images.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
