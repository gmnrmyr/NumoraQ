
import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Heart } from 'lucide-react';

export const DonationLinks = () => {
  return (
    <>
      <Link 
        to="/donation"
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-accent font-mono"
      >
        <Coffee size={12} />
        Buy us a coffee
      </Link>
      <Link 
        to="/donation"
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-accent font-mono"
      >
        <Heart size={12} />
        Support the project
      </Link>
    </>
  );
};
