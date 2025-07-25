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
      <ul className="flex gap-2 md:gap-3 lg:gap-4 xl:gap-6 flex-wrap justify-center max-w-full">
        {menuItems.map(({ id, label, icon: Icon, gradientFrom, gradientTo, onClick, isActive }) => (
          <li
            key={id}
            style={{ '--gradient-from': gradientFrom, '--gradient-to': gradientTo } as React.CSSProperties}
            className={`relative w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-16 xl:h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              isActive ? 'bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))]' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
            } group cursor-pointer`}
            onClick={onClick}
          >
            {/* Gradient background - always visible when active */}
            <span className={`absolute inset-0 rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] transition-all duration-500 ${
              isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}></span>
            

            {/* Icon - always visible and stays in center when active, moves to left when hovering inactive */}
            <span className={`relative z-10 transition-all duration-300 ${
              isActive ? 'text-white' : 'text-gray-600 group-hover:text-white group-hover:absolute group-hover:left-2 md:group-hover:left-3 lg:group-hover:left-4 xl:group-hover:left-5'
            }`}>
              <Icon size={16} className="md:hidden" />
              <Icon size={18} className="hidden md:block lg:hidden" />
              <Icon size={20} className="hidden lg:block xl:hidden" />
              <Icon size={24} className="hidden xl:block" />
            </span>

            {/* Title - only visible on hover when not active */}
            <span className={`absolute text-white tracking-wide text-sm transition-all duration-300 ${
              isActive ? 'opacity-0 scale-0' : 'opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100'
            } delay-150 left-8 md:left-10 lg:left-12 xl:left-16 text-xs md:text-xs lg:text-sm`}>
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}