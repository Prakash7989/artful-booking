import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/home/HeroSection";
import StatesGridPreview from "@/components/home/StatesGridPreview";
import FeaturedArtists from "@/components/home/FeaturedArtists";
import ArtFormsSection from "@/components/home/ArtFormsSection";
import HowItWorks from "@/components/home/HowItWorks";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'artist') {
      navigate('/artist/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

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
