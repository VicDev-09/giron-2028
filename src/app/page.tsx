import { HomeHero } from "@/components/home/HomeHero";
import { LineupPoster } from "@/components/home/LineupPoster";
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
      <LineupPoster />
      <CallsToAction />
      <SponsorsStrip />
      <SocialSection />
    </>
  );
}
