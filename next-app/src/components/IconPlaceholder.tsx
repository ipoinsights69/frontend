import React from 'react';

interface IconPlaceholderProps {
  name: string;
  size?: number;
  className?: string;
}

export const IconPlaceholder: React.FC<IconPlaceholderProps> = ({ 
  name, 
  size = 16, 
  className = "" 
}) => {
  const getIcon = () => {
    switch(name.toLowerCase()) {
      case 'calendar-alt': return '📅';
      case 'industry': return '🏭';
      case 'exchange-alt': return '🔄';
      case 'tools': return '🔧';
      case 'check': return '✓';
      case 'cameo': return '📊';
      case 'linkintime': return '🔗';
      case 'kfintech': return '📘';
      case 'bigshare services pvt ltd': return '📈';
      case 'bigshare': return '📈';
      default: return '📄';
    }
  };
  
  const style = {
    fontSize: `${size}px`,
    lineHeight: 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  
  return <span style={style} className={className}>{getIcon()}</span>;
}; 