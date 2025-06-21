
import React, { useEffect } from 'react';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useUserTitle } from '@/hooks/useUserTitle';

export const BackgroundAnimation = () => {
  const { data } = useFinancialData();
  const { userTitle } = useUserTitle();
  
  // Check if user has CHAMPION+ role (level 70+ OR champion/legend titles)
  const isChampionUser = userTitle.level >= 70 || ['WHALE', 'LEGEND', 'PATRON', 'CHAMPION'].includes(userTitle.title);
  
  // Check if black hole theme is active
  const isBlackHoleTheme = data.userProfile.theme === 'black-hole';
  
  // Only show for Champion+ users with black hole theme
  const shouldShow = isChampionUser && isBlackHoleTheme;

  useEffect(() => {
    if (!shouldShow) return;

    // Add the script only once
    if (!document.querySelector('script[src*="unicornstudio"]')) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = `
        !function(){
          if(!window.UnicornStudio){
            window.UnicornStudio={isInitialized:!1};
            var i=document.createElement("script");
            i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.25/dist/unicornStudio.umd.js";
            i.onload=function(){
              window.UnicornStudio.isInitialized||(UnicornStudio.init(),window.UnicornStudio.isInitialized=!0)
            };
            (document.head || document.body).appendChild(i)
          }
        }();
      `;
      document.head.appendChild(script);
    }
  }, [shouldShow]);

  if (!shouldShow) {
    return null;
  }

  return (
    <div 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ paddingTop: '80px' }}
    >
      <div 
        className="flex justify-center w-full"
      >
        <div 
          data-us-project="db3DaP9gWVnnnr7ZevK7" 
          style={{ width: '2000px', height: '900px' }}
        />
      </div>
    </div>
  );
};
