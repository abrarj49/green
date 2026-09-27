'use client';

import ScrollReveal, { ScrollRevealProps } from './ScrollReveal';

export interface SectionRevealProps extends ScrollRevealProps {}

export default function SectionReveal(props: SectionRevealProps) {
  return <ScrollReveal {...props} />;
}
