
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserSettingsPanel } from './UserSettingsPanel';
import { UserMenu } from './UserMenu';

export const NavbarHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between w-full">
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => navigate('/')}
      >
        <div className="text-xl font-bold font-mono text-accent uppercase tracking-wider">
          OPEN FINDASH
        </div>
      </div>
      <div className="flex items-center gap-2">
        <UserSettingsPanel />
        <UserMenu />
      </div>
    </div>
  );
};
