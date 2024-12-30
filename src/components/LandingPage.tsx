
import Navbar from './Navbar';
import Hero from './landing/Hero';
import StatsSection from './landing/StatsSection';
import BenefitsSection from './landing/BenefitsSection';
import AgentShowcase from './features/AgentShowcase';
import IntegrationShowcase from './features/IntegrationShowcase';
import SecuritySection from './features/SecuritySection';
import Pricing from './Pricing';
import Footer from './Footer';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsSection />
        <BenefitsSection />
        <AgentShowcase />
        <IntegrationShowcase />
        <SecuritySection />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}