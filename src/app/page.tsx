import { HomeHero } from "@/components/home/HomeHero";
import {
  CallsToAction,
  FestTeaser,
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
      <ProgrammePreview />
      <CallsToAction />
      <SponsorsStrip />
      <SocialSection />
    </>
  );
}
