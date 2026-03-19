import ScorecardNav from '@/components/layout/ScorecardNav';
import HeroScrollVideo from '@/components/hero/HeroScrollVideo';
import MissionStatement from '@/components/sections/MissionStatement';
import ImpactNumbers from '@/components/sections/ImpactNumbers';
import CompanyShowcase from '@/components/sections/CompanyShowcase';
import MethodologyExplainer from '@/components/sections/MethodologyExplainer';
import ComparisonSection from '@/components/sections/ComparisonSection';
import PracticalGuide from '@/components/sections/PracticalGuide';
import WhyThisMatters from '@/components/sections/WhyThisMatters';
import CallToAction from '@/components/sections/CallToAction';
import ScorecardFooter from '@/components/layout/ScorecardFooter';

export default function Home() {
  return (
    <main className="relative bg-surface-0">
      <ScorecardNav />
      <HeroScrollVideo />
      <MissionStatement />
      <ImpactNumbers />
      <CompanyShowcase />
      <MethodologyExplainer />
      <ComparisonSection />
      <PracticalGuide />
      <WhyThisMatters />
      <CallToAction />
      <ScorecardFooter />
    </main>
  );
}
