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
    <div className="flex justify-center items-center">
      <ul className="flex gap-6">
        {menuItems.map(({ id, label, icon: Icon, gradientFrom, gradientTo, onClick, isActive }) => (
          <li
            key={id}
            style={{ '--gradient-from': gradientFrom, '--gradient-to': gradientTo } as React.CSSProperties}
            className={`relative w-[60px] h-[60px] bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'w-[60px] shadow-none' : 'hover:w-[180px]'} group cursor-pointer`}
            onClick={onClick}
          >
            {/* Gradient background - always visible when active */}
            <span className={`absolute inset-0 rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></span>
            
            {/* Blur glow */}
            <span className={`absolute top-[10px] inset-x-0 h-full rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] blur-[15px] -z-10 transition-all duration-500 ${isActive ? 'opacity-50' : 'opacity-0 group-hover:opacity-50'}`}></span>

            {/* Icon - always visible */}
            <span className={`relative z-10 transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`}>
              <Icon size={24} />
            </span>

            {/* Title - only visible on hover when not active */}
            <span className={`absolute text-white uppercase tracking-wide text-sm transition-all duration-500 ${isActive ? 'scale-0' : 'scale-0 group-hover:scale-100'} delay-150 left-16`}>
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}