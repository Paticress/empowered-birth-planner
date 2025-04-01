
import React from 'react';
import { OnlineGuide } from './OnlineGuide';

export function EmbeddedOnlineGuide() {
  console.log("EmbeddedOnlineGuide component rendering");
  return <OnlineGuide embedded={true} />;
}

// Add global export for compatibility with non-module contexts
if (typeof window !== 'undefined') {
  try {
    window.EmbeddedOnlineGuide = EmbeddedOnlineGuide;
    console.log("EmbeddedOnlineGuide component exported to window.EmbeddedOnlineGuide successfully");
  } catch (error) {
    console.error("Error exporting EmbeddedOnlineGuide to window:", error);
  }
}
