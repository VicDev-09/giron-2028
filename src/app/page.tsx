import { HomeHero } from "@/components/home/HomeHero";
import {
  CallsToAction,
  FestTeaser,
  KeyFigures,
  KeywordBand,
  ProgrammePreview,
  SocialSection,
  SponsorsStrip,
} from "@/components/home/HomeSections";

export default function Home() {
  return (
    <>
      <HomeHero />
      <KeywordBand />
      <FestTeaser />
      <KeyFigures />
      <ProgrammePreview />
      <CallsToAction />
      <SponsorsStrip />
      <SocialSection />
    </>
  );
}
