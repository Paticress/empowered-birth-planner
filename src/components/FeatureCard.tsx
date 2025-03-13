
import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="feature-card animate-fade-in-up">
      <div className="text-maternal-600 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-maternal-900 mb-2">{title}</h3>
      <p className="text-maternal-700">{description}</p>
    </div>
  );
}
