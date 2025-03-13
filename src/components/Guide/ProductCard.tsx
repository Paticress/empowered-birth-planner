
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductCardProps {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonIcon: ReactNode;
  url: string;
}

export function ProductCard({
  title,
  subtitle,
  description,
  buttonText,
  buttonIcon,
  url
}: ProductCardProps) {
  return (
    <Card className="border-maternal-200 hover:border-maternal-300 transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-maternal-800">{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-maternal-700 mb-4">
          {description}
        </p>
        <Button 
          className="w-full bg-maternal-600 hover:bg-maternal-700"
          onClick={() => window.open(url, '_blank')}
        >
          {buttonIcon} {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}
