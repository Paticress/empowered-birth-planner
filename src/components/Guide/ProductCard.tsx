
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Book, Sun } from 'lucide-react';

interface ProductCardProps {
  title: string;
  description: string;
  icon?: string;
  subtitle?: string;
  buttonText?: string;
  buttonIcon?: ReactNode;
  url?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export function ProductCard({
  title,
  subtitle,
  description,
  buttonText,
  buttonIcon,
  url,
  imageSrc,
  imageAlt,
  icon
}: ProductCardProps) {
  // Simple function to render the icon based on the string name
  const renderIcon = () => {
    switch (icon) {
      case 'heart':
        return <Heart className="h-5 w-5 text-maternal-500" />;
      case 'book':
        return <Book className="h-5 w-5 text-maternal-500" />;
      case 'sun':
        return <Sun className="h-5 w-5 text-maternal-500" />;
      default:
        return null;
    }
  };

  // If there's an image, render the full product card
  if (imageSrc) {
    return (
      <Card className="border-maternal-200 overflow-hidden hover:shadow-md transition-all duration-300">
        <div className="h-64 overflow-hidden relative">
          <img 
            src={imageSrc}
            alt={imageAlt || title}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-50"></div>
        </div>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold text-maternal-800">{title}</CardTitle>
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </CardHeader>
        <CardContent>
          <p className="text-maternal-700 mb-4 text-sm">
            {description}
          </p>
          {buttonText && url && (
            <Button 
              className="w-full"
              variant="resource"
              onClick={() => window.open(url, '_blank')}
            >
              {buttonIcon} {buttonText}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Simpler card for use in ProductsSection
  return (
    <Card className="border-maternal-200 hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {renderIcon()}
          <CardTitle className="text-lg font-semibold text-maternal-800">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-maternal-700 text-sm">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
