import { Metadata } from 'next';
import { 
  LandingHeader, 
  HeroSection, 
  FeaturesSection, 
  HowItWorksSection,
  CTASection,
  Footer 
} from '@/components/landing';

export const metadata: Metadata = {
  title: "OpenTART - Your Nodes. Your Rules.",
  description: "Open-source telemetry and analytics for JAM Protocol. Monitor your validators in real-time with zero trust required. See your nodes like never before.",
  openGraph: {
    title: "OpenTART - Your Nodes. Your Rules.",
    description: "Open-source telemetry for JAM Protocol. Your validators are already running. Now see what they're actually doing.",
    url: "/landing",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OpenTART - JAM Protocol Telemetry & Analytics",
      },
    ],
  },
  twitter: {
    title: "OpenTART - Your Nodes. Your Rules.",
    description: "Open-source telemetry for JAM Protocol. Your validators are already running. Now see what they're actually doing.",
    images: ["/og-image.png"],
  },
};

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
