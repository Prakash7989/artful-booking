import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/home/HeroSection";
import StatesGridPreview from "@/components/home/StatesGridPreview";
import FeaturedArtists from "@/components/home/FeaturedArtists";
import ArtFormsSection from "@/components/home/ArtFormsSection";
import HowItWorks from "@/components/home/HowItWorks";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <StatesGridPreview />
      <FeaturedArtists />
      <ArtFormsSection />
      <HowItWorks />
      <CTASection />
    </MainLayout>
  );
};

export default Index;
