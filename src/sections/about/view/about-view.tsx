'use client';

import { AboutHero } from '../about-hero';
import { AboutStory } from '../about-story';
import { AboutValues } from '../about-values';
import { AboutContact } from '../about-contact';

// ----------------------------------------------------------------------

export function AboutView() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutContact />
      <AboutValues />
    </>
  );
}
