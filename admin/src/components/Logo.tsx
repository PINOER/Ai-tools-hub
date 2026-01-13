import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LogoProps {
  collapsed?: boolean;
}

const Logo: React.FC<LogoProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  return (
    <div className='flex gap-2 cursor-pointer items-center' onClick={() => navigate('/')}> 
      <img src='/icons/logo.svg' alt='Logo' width={40} height={60} />
      {!collapsed && (
        <div className='text-xs font-medium text-black font-inter'>
          <p>AI</p>
          <p>Tools</p>
          <div className='flex gap-1'>
            <span>Hub</span>
            <span className='text-slate-600'>admin</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
