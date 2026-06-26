import { useState } from 'react';
import { ImageOff, Droplets, Zap, Car, Wind, Sparkles, WashingMachine, Hammer, Brush, Wrench, Leaf, Paintbrush, Shield, Bug, LayoutGrid } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackIcon?: React.ReactNode;
  category?: string;
}

export default function ImageWithFallback({ fallbackIcon, category, className = "", ...props }: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  if (error || !props.src) {
    let IconComponent = <ImageOff className="w-1/3 h-1/3 opacity-50" />;
    
    if (fallbackIcon) {
      IconComponent = <>{fallbackIcon}</>;
    } else if (category) {
      const cls = "w-1/3 h-1/3 opacity-30 text-primary";
      switch(category) {
        case "Plumbing":     IconComponent = <Droplets className={cls} />; break;
        case "Electrical":   IconComponent = <Zap className={cls} />; break;
        case "Auto Mechanic":IconComponent = <Car className={cls} />; break;
        case "AC Repair":    IconComponent = <Wind className={cls} />; break;
        case "Deep Cleaning":IconComponent = <Sparkles className={cls} />; break;
        case "Laundry":      IconComponent = <WashingMachine className={cls} />; break;
        case "Carpentry":    IconComponent = <Hammer className={cls} />; break;
        case "Cleaning":     IconComponent = <Brush className={cls} />; break;
        case "Maintenance":  IconComponent = <Wrench className={cls} />; break;
        case "Repairs":      IconComponent = <Hammer className={cls} />; break;
        case "Gardening":    IconComponent = <Leaf className={cls} />; break;
        case "Painting":     IconComponent = <Paintbrush className={cls} />; break;
        case "Security":     IconComponent = <Shield className={cls} />; break;
        case "Pest Control": IconComponent = <Bug className={cls} />; break;
        case "General":      IconComponent = <LayoutGrid className={cls} />; break;
        default:             IconComponent = <LayoutGrid className={cls} />; break;
      }
    }

    return (
      <div className={`flex flex-col items-center justify-center bg-surface-container-low text-on-surface-variant ${className}`}>
        {IconComponent}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      className={className}
      onError={(e) => {
        setError(true);
        if (props.onError) props.onError(e);
      }}
    />
  );
}
