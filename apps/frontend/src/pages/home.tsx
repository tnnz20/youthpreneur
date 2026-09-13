import { BlogSection } from '@/components/home/blog-section';
import { CategoriesSection } from '@/components/home/categories-section';
import { CoursesSection } from '@/components/home/courses-section';
import { FeaturesRibbon } from '@/components/home/features-ribbon';
import { HeroSection } from '@/components/home/hero-section';
import { MentorsSection } from '@/components/home/mentors-section';
import { MetricsSection } from '@/components/home/metrics-section';
import { TestimonialsSection } from '@/components/home/testimonials-section';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MetricsSection />
      <CoursesSection />
      <FeaturesRibbon />
      <CategoriesSection />
      <MentorsSection />
      <TestimonialsSection />
      <BlogSection />
    </>
  );
}
