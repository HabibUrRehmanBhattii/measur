import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import React, { ReactNode } from 'react';

/**
 * Combines multiple class names and tailwind classes safely
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generic container for animated content with staggered children
 */
export function AnimatedContainer({
  children,
  className,
  delay = 0,
  delayIncrement = 0.1,
}: {
  children: ReactNode[];
  className?: string;
  delay?: number;
  delayIncrement?: number;
}) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        
        return React.cloneElement(child as React.ReactElement<any>, {
          className: cn(
            (child as React.ReactElement).props.className || '',
            'animate-slide-up opacity-0'
          ),
          style: {
            ...((child as React.ReactElement).props.style || {}),
            animationDelay: `${delay + index * delayIncrement}s`,
            animationFillMode: 'forwards',
          },
        });
      })}
    </div>
  );
}

/**
 * Adds noise texture to any element
 */
export function withNoise<T extends React.ElementType>(Component: T) {
  return React.forwardRef<React.ComponentRef<T>, React.ComponentPropsWithoutRef<T>>(
    ({ className, ...props }, ref) => {
      return (
        <Component
          ref={ref}
          className={cn('noise-texture', className)}
          {...props}
        />
      );
    }
  );
}

/**
 * Badge component for labels and tags
 */
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
}: {
  children: ReactNode;
  variant?: 'default' | 'outline' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const variantClasses = {
    default: 'bg-surface border-border text-foreground-secondary',
    outline: 'bg-transparent border-border text-foreground-secondary',
    primary: 'bg-primary/10 border-primary/30 text-primary',
    secondary: 'bg-secondary/10 border-secondary/30 text-secondary',
  };
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-4 py-1.5',
  };
  
  return (
    <span 
      className={cn(
        'inline-flex items-center justify-center rounded-full border font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}

/**
 * Glass card with optional hover animation
 */
export function GlassCard({
  children,
  className,
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        'glass rounded-2xl backdrop-blur-lg border border-border p-6',
        hover && 'transition-bounce hover:shadow-3d hover:-translate-y-1',
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Text with gradient effect and optional glow
 */
export function GradientText({
  children,
  className,
  variant = 'primary',
  glow = false,
  ...props
}: {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'accent';
  glow?: boolean;
  'data-text'?: string;
}) {
  return (
    <span
      className={cn(
        variant === 'primary' ? 'gradient-text' : 'gradient-text-accent',
        glow && 'text-shadow-glow',
        className
      )}
      data-text={props['data-text'] || (typeof children === 'string' ? children : undefined)}
      {...props}
    >
      {children}
    </span>
  );
}

/**
 * Creates a shimmer effect on a placeholder element
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-shimmer rounded-md bg-surface',
        className
      )}
      {...props}
    />
  );
}