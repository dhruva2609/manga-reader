import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  BookOpen, 
  Heart, 
  Sparkles, 
  ArrowUp, 
  Compass, 
  Zap, 
  Quote 
} from 'lucide-react';
import './Footer.css';

const MANGA_QUOTES = [
  {
    text: "If you don't like your destiny, don't accept it. Instead, have the courage to change it the way you want it to be.",
    character: "Naruto Uzumaki",
    manga: "Naruto"
  },
  {
    text: "Fear is not evil. It tells you what your weakness is. And once you know your weakness, you can become stronger.",
    character: "Gildarts Clive",
    manga: "Fairy Tail"
  },
  {
    text: "Whatever you lose, you'll find it again. But what you throw away you'll never get back.",
    character: "Kenshin Himura",
    manga: "Rurouni Kenshin"
  },
  {
    text: "You should enjoy the little detours to the utmost. Because that's where you'll find the things more important than what you want.",
    character: "Ging Freecss",
    manga: "Hunter x Hunter"
  },
  {
    text: "In this world, wherever there is light - there are also shadows.",
    character: "Madara Uchiha",
    manga: "Naruto"
  },
  {
    text: "A person can change, at the moment when the person wishes to change.",
    character: "Haruhi Fujioka",
    manga: "Ouran High School Host Club"
  },
  {
    text: "Power comes in response to a need, not a desire. You have to create that need.",
    character: "Goku",
    manga: "Dragon Ball Z"
  },
  {
    text: "The moment you think of giving up, think of the reason why you held on so long.",
    character: "Natsu Dragneel",
    manga: "Fairy Tail"
  },
  {
    text: "If you can't find a reason to fight, then you shouldn't be fighting.",
    character: "Akame",
    manga: "Akame ga Kill!"
  },
  {
    text: "Push through the pain. Giving up hurts more.",
    character: "Vegeta",
    manga: "Dragon Ball"
  }
];

const Footer = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteFade, setQuoteFade] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * MANGA_QUOTES.length);
    setQuoteIndex(randomIndex);

    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const handleNextQuote = () => {
    setQuoteFade(true);
    setTimeout(() => {
      setQuoteIndex((prevIndex) => {
        let nextIndex = Math.floor(Math.random() * MANGA_QUOTES.length);
        while (nextIndex === prevIndex && MANGA_QUOTES.length > 1) {
          nextIndex = Math.floor(Math.random() * MANGA_QUOTES.length);
        }
        return nextIndex;
      });
      setQuoteFade(false);
    }, 300);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };



  const currentQuote = MANGA_QUOTES[quoteIndex];

  return (
    <footer className="footer-main">
      <div className="footer-glow-left" />
      <div className="footer-glow-right" />
      <div className="footer-top-line" />

      <div className="footer-container simple-footer">
        
        {/* Brand Section */}
        <div className="footer-brand-section simple-brand">
          <Link to="/" className="footer-logo">
            <span className="logo-icon-wrapper">
              <BookOpen className="logo-icon animate-pulse" />
            </span>
            <span className="logo-text">Manga<span className="logo-accent">Reader</span></span>
          </Link>
          <p className="footer-tagline">
            Your premium gateway to the universe of manga. Read, discover, and organize your favorite titles with our advanced, ad-free reader engine.
          </p>
        </div>

        {/* Navigation Links Column */}
        <div className="footer-links-column explore-links-col">
          <h3>Explore</h3>
          <ul>
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? 'footer-link active' : 'footer-link'}>
                <Compass size={14} />
                <span>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/favorites" className={({ isActive }) => isActive ? 'footer-link active' : 'footer-link'}>
                <Heart size={14} />
                <span>Favorites</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/history" className={({ isActive }) => isActive ? 'footer-link active' : 'footer-link'}>
                <Zap size={14} />
                <span>Reading History</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Quote section */}
        <div className="footer-quote-section simple-quote">
          <div className="quote-box-wrapper glass-panel">
            <div className="quote-icon-container">
              <Quote size={18} className="quote-icon" />
            </div>
            
            <div className={`quote-content ${quoteFade ? 'fade-out' : 'fade-in'}`}>
              <p className="quote-text">"{currentQuote.text}"</p>
              <div className="quote-author-manga">
                <span className="quote-character">— {currentQuote.character}</span>
                <span className="quote-manga-title">{currentQuote.manga}</span>
              </div>
            </div>

            <button 
              className="quote-refresh-btn" 
              onClick={handleNextQuote}
              aria-label="Get new quote"
            >
              <Sparkles size={12} />
              <span>Inspire Me</span>
            </button>
          </div>
        </div>

      </div>

      <div className="footer-bottom-bar">
        <div className="footer-bottom-content">
          <div className="footer-copyright">
            <p>© {new Date().getFullYear()} MangaReader. Built with passion for readers worldwide.</p>
            <p className="disclaimer">All manga titles and graphics are copyright of their respective authors & publishers.</p>
          </div>

          <button 
            className={`back-to-top-btn ${isVisible ? 'visible' : ''}`}
            onClick={scrollToTop}
            aria-label="Scroll back to top"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
