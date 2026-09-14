import { BadapatanSection } from '@/components/about/badapatan-section';
import { CommitmentSection } from '@/components/about/commitment-section';
import { CtaSection } from '@/components/about/cta-section';
import { ProfileSection } from '@/components/about/profile-section';

export default function AboutPage() {
  return (
    <>
      <ProfileSection />
      <BadapatanSection />
      <CommitmentSection />
      <CtaSection />
    </>
  );
}
