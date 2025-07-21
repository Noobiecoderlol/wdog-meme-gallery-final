import React, { useState } from 'react';
import { Hero } from '@/components/Hero';
import { PFPGenerator } from '@/components/PFPGenerator';

const Index = () => {
  const [showGenerator, setShowGenerator] = useState(false);

  if (showGenerator) {
    return <PFPGenerator onBack={() => setShowGenerator(false)} />;
  }

  return <Hero onGetStarted={() => setShowGenerator(true)} />;
};

export default Index;
