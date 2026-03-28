import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import HowItWorks from '../components/home/HowItWorks';
import DashboardPreview from '../components/home/DashboardPreview';

const Home = () => {
  return (
    <div className="relative">
      <Hero />
      <Features />
      <HowItWorks />
      <DashboardPreview />
    </div>
  );
};

export default Home;
