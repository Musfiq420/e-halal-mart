'use client';

const variants = {
  halal: 'bg-primary text-white',
  organic: 'bg-light-green text-dark-green',
  new: 'bg-amber-500 text-white',
  sale: 'bg-red-500 text-white',
  featured: 'bg-dark-green text-white',
  default: 'bg-gray-100 text-gray-800',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  icon = null,
  className = '',
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 font-medium rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {icon && <span className="w-3 h-3">{icon}</span>}
      {children}
    </span>
  );
}

// Pre-configured badges for common use
export function HalalBadge({ size = 'md', className = '' }) {
  return (
    <Badge variant="halal" size={size} className={className}>
      ☪ Halal Certified
    </Badge>
  );
}

export function OrganicBadge({ size = 'md', className = '' }) {
  return (
    <Badge variant="organic" size={size} className={className}>
      🌿 Organic
    </Badge>
  );
}

export function NewBadge({ size = 'md', className = '' }) {
  return (
    <Badge variant="new" size={size} className={className}>
      New
    </Badge>
  );
}

export function SaleBadge({ size = 'md', className = '' }) {
  return (
    <Badge variant="sale" size={size} className={className}>
      Sale
    </Badge>
  );
}
