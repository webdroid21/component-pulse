'use client';

import { HomeCTA } from '../home-cta';
import { HomeHero } from '../home-hero';
import { HomeBrands } from '../home-brands';
import { HomeCategories } from '../home-categories';
import { HomeWhyChooseUs } from '../home-why-choose-us';
import { HomeTestimonials } from '../home-testimonials';
import { HomeFeaturedProducts } from '../home-featured-products';

// ----------------------------------------------------------------------

export function HomeView() {
  return (
    <>
      <HomeHero />
      <HomeBrands />
      <HomeCategories />
      <HomeFeaturedProducts />
      <HomeWhyChooseUs />
      <HomeTestimonials />
      <HomeCTA />
    </>
  );
}
