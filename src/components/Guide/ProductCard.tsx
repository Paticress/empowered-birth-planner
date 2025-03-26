
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
  imageSrc: string;
  imageAlt: string;
}

export function ProductCard({
  title,
  subtitle,
  description,
  buttonText,
  buttonIcon,
  url,
  imageSrc,
  imageAlt
}: ProductCardProps) {
  return (
    <Card className="border-maternal-200 overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="h-64 overflow-hidden relative">
        <img 
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-50"></div>
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold text-maternal-800">{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-maternal-700 mb-4 text-sm">
          {description}
        </p>
        <Button 
          className="w-full"
          variant="resource"
          onClick={() => window.open(url, '_blank')}
        >
          {buttonIcon} {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}
