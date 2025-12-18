import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpenTART - JAM Telemetry & Analytics",
  description: "Open-source telemetry and analytics for the JAM Protocol. Monitor your validators in real-time.",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Landing page has its own layout without sidebar/header
  return <>{children}</>;
}
