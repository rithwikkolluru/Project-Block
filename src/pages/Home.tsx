import React from 'react';
import Scene from '../components/visuals/Scene';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import HowItWorks from '../components/home/HowItWorks';
import DashboardPreview from '../components/home/DashboardPreview';

const Home = () => {
  return (
    <>
      <Scene />
      <Hero />
      <Features />
      <HowItWorks />
      <DashboardPreview />
    </>
  );
};

export default Home;
