import { 
  LandingHeader, 
  HeroSection, 
  FeaturesSection, 
  HowItWorksSection,
  CTASection,
  Footer 
} from '@/components/landing';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      <LandingHeader />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
}
