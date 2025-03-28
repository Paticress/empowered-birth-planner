
import { useState, useEffect } from 'react';
import { GuideTabs } from './GuideTabs';
import { GuideHeader } from './GuideHeader';
import { useLocation } from 'react-router-dom';
import '../../../src/styles/embed.css';

interface OnlineGuideProps {
  embedded?: boolean;
}

export function OnlineGuide({ embedded = false }: OnlineGuideProps) {
  const [activeTab, setActiveTab] = useState('introduction');
  const location = useLocation();
  
  // Debug logs for component rendering
  console.log("OnlineGuide - Component rendering, embedded:", embedded);
  
  // Handle navigation from other tabs
  useEffect(() => {
    console.log("OnlineGuide - useEffect running with location:", location);
    const hash = location.hash.replace('#', '');
    if (hash && hash !== '/guia-online') {
      console.log("OnlineGuide - Setting active tab from hash:", hash);
      setActiveTab(hash);
    }
  }, [location]);

  // Send resize messages to parent window when in embedded mode
  useEffect(() => {
    if (embedded) {
      const sendResizeMessage = () => {
        const height = document.body.scrollHeight;
        try {
          // Use a more robust cross-origin communication approach
          window.parent.postMessage({ type: 'resize', height, source: 'energia-materna-guide' }, '*');
          console.log("OnlineGuide - Sending resize message, height:", height);
        } catch (error) {
          console.error("OnlineGuide - Error sending postMessage:", error);
        }
      };
      
      // Add a small delay for initial rendering
      setTimeout(sendResizeMessage, 100);
      
      // Send initial message and setup listeners
      window.addEventListener('resize', sendResizeMessage);
      
      // Observe DOM changes to detect content changes
      const observer = new MutationObserver(() => {
        console.log("OnlineGuide - DOM mutation detected, sending resize");
        sendResizeMessage();
      });
      
      // Start observing the document with the configured parameters
      observer.observe(document.body, { 
        childList: true, 
        subtree: true, 
        attributes: true,
        characterData: true 
      });
      
      // Check for content changes periodically as fallback
      const resizeInterval = setInterval(sendResizeMessage, 500);
      
      return () => {
        window.removeEventListener('resize', sendResizeMessage);
        clearInterval(resizeInterval);
        observer.disconnect();
      };
    }
  }, [embedded, activeTab]);

  const handleTabChange = (tab: string) => {
    console.log('Tab changed to:', tab);
    setActiveTab(tab);
    
    // When tab changes in embedded mode, ensure parent window is notified
    if (embedded) {
      setTimeout(() => {
        const height = document.body.scrollHeight;
        try {
          window.parent.postMessage({ type: 'resize', height, source: 'energia-materna-guide' }, '*');
        } catch (error) {
          console.error("Error sending postMessage on tab change:", error);
        }
      }, 100);
    }
  };

  console.log("OnlineGuide - Rendering with activeTab:", activeTab);
  return (
    <div className={`min-h-screen bg-white ${embedded ? 'embedded-mode' : ''}`}>
      {!embedded && <GuideHeader onNavigate={handleTabChange} currentTab={activeTab} />}
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <GuideTabs 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          embedded={embedded}
        />
      </main>
    </div>
  );
}
