import React from 'react';

interface MenuTogglerProps {
  onClick: () => void;
  collapsed: boolean;
}

const MenuToggler: React.FC<MenuTogglerProps> = ({ onClick, collapsed }) => {
  return (
    <div className="cursor-pointer transition-transform" onClick={onClick}>
      <img
        src='/icons/menu-toggle.svg'
        alt='Menu Toggle'
        width={30}
        height={30}
        style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
      />
    </div>
  );
};

export default MenuToggler;
