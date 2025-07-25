import React from 'react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  gradientFrom: string;
  gradientTo: string;
  onClick: () => void;
  isActive?: boolean;
}

interface GradientMenuProps {
  menuItems: MenuItem[];
}

export default function GradientMenu({ menuItems }: GradientMenuProps) {
  return (
    <div className="flex justify-center items-center w-full">
      <ul className="flex gap-3 md:gap-4 lg:gap-5 flex-wrap justify-center max-w-full">
        {menuItems.map(({ id, label, icon: Icon, gradientFrom, gradientTo, onClick, isActive }) => (
          <li
            key={id}
            style={{ '--gradient-from': gradientFrom, '--gradient-to': gradientTo } as React.CSSProperties}
            className={`relative w-[44px] h-[44px] md:w-[48px] md:h-[48px] lg:w-[52px] lg:h-[52px] bg-white rounded-full flex items-center justify-center transition-all duration-300 ${
              isActive ? 'w-[44px] md:w-[48px] lg:w-[52px]' : 'hover:w-[130px] md:hover:w-[150px] lg:hover:w-[170px]'
            } group cursor-pointer`}
            onClick={onClick}
          >
            {/* Gradient background - always visible when active */}
            <span className={`absolute inset-0 rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] transition-all duration-300 ${
              isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}></span>
            
            {/* Icon - always visible and stays in center when active, moves to left when hovering inactive */}
            <span className={`relative z-10 transition-all duration-200 ${
              isActive ? 'text-white' : 'text-gray-600 group-hover:text-white group-hover:absolute group-hover:left-3 md:group-hover:left-4 lg:group-hover:left-5'
            }`}>
              <Icon size={18} className="md:hidden" />
              <Icon size={20} className="hidden md:block lg:hidden" />
              <Icon size={22} className="hidden lg:block" />
            </span>

            {/* Title - only visible on hover when not active */}
            <span className={`absolute text-white font-medium tracking-wide text-sm transition-all duration-300 ${
              isActive ? 'opacity-0 scale-0' : 'opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100'
            } delay-100 left-9 md:left-11 lg:left-13 text-xs md:text-xs lg:text-sm`}>
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}