'use client';

import { AboutHero } from '../about-hero';
import { AboutStory } from '../about-story';
import { AboutStats } from '../about-stats';
import { AboutValues } from '../about-values';

// ----------------------------------------------------------------------

export function AboutView() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutStats />
      <AboutValues />
    </>
  );
}
