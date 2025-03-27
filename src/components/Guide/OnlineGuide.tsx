
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

  const handleTabChange = (tab: string) => {
    console.log('Tab changed to:', tab);
    setActiveTab(tab);
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
