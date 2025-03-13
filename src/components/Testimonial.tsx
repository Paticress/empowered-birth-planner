
import { Card } from '@/components/ui/card';

interface TestimonialProps {
  quote: string;
  name: string;
  role?: string;
  imageUrl?: string;
}

export function Testimonial({ quote, name, role, imageUrl }: TestimonialProps) {
  return (
    <Card className="testimonial-card overflow-hidden animate-fade-in">
      <div className="flex flex-col space-y-4">
        <div className="text-maternal-400">
          <svg
            className="h-8 w-8"
            fill="currentColor"
            viewBox="0 0 32 32"
            aria-hidden="true"
          >
            <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
          </svg>
        </div>
        <p className="text-maternal-700 text-lg leading-relaxed">{quote}</p>
        <div className="flex items-center mt-4">
          {imageUrl && (
            <div className="flex-shrink-0 mr-3">
              <img
                className="h-10 w-10 rounded-full object-cover border border-maternal-200"
                src={imageUrl}
                alt={name}
              />
            </div>
          )}
          <div>
            <p className="text-maternal-900 font-medium">{name}</p>
            {role && <p className="text-maternal-500 text-sm">{role}</p>}
          </div>
        </div>
      </div>
    </Card>
  );
}
