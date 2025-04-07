
// This file is kept for reference but not currently used in the application
// Magic link functionality has been temporarily disabled

import { MagicLinkForm } from '../forms/MagicLinkForm';
import { useState } from 'react';

export function MagicLinkTab() {
  const [magicLinkEmail, setMagicLinkEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);

  // Placeholder function - magic link functionality is disabled
  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Magic link functionality is currently disabled');
  };

  return (
    <MagicLinkForm 
      magicLinkEmail={magicLinkEmail}
      setMagicLinkEmail={setMagicLinkEmail}
      isLoading={isLoading}
      isMagicLinkSent={isMagicLinkSent}
      setIsMagicLinkSent={setIsMagicLinkSent}
      handleMagicLinkSubmit={handleMagicLinkSubmit}
      loadingText="Enviando link de acesso..."
    />
  );
}
