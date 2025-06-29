"use client" 

import * as React from "react"
import { useRef } from "react";
import {
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
 
import { cn } from "../../lib/utils";
import { Link } from "react-router-dom";
 
export interface AnimatedDockProps {
  className?: string;
  items: DockItemData[];
  vertical?: boolean;
}
 
export interface DockItemData {
  link: string;
  Icon: React.ReactNode;
  target?: string;
  onClick?: () => void;
  active?: boolean;
  label?: string;
}
 
export const AnimatedDock = ({ className, items, vertical = false }: AnimatedDockProps) => {
  const mouseY = useMotionValue(Infinity);
  const mouseX = useMotionValue(Infinity);
 
  return (
    <motion.div
      onMouseMove={(e) => {
        if (vertical) {
          mouseY.set(e.pageY);
        } else {
          mouseX.set(e.pageX);
        }
      }}
      onMouseLeave={() => {
        if (vertical) {
          mouseY.set(Infinity);
        } else {
          mouseX.set(Infinity);
        }
      }}
      className={cn(
        vertical 
          ? "mx-auto flex flex-col items-center gap-4 rounded-2xl bg-secondary/50 border border-primary/10 shadow-md py-4 px-3"
          : "mx-auto flex h-16 items-end gap-4 rounded-2xl bg-secondary/50 border border-primary/10 shadow-md px-4 pb-3",
        className,
      )}
    >
      {items.map((item, index) => (
        <DockItem 
          key={index} 
          mouseX={mouseX} 
          mouseY={mouseY} 
          vertical={vertical}
          active={item.active}
        >
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="grow flex items-center justify-center w-full h-full text-primary-foreground relative group"
            >
              {item.Icon}
              {item.label && (
                <div className={`absolute ${vertical ? 'left-full ml-3' : 'top-full mt-3'} px-3 py-2 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none`}>
                  {item.label}
                  <div className={`absolute ${vertical ? 'right-full top-1/2 -translate-y-1/2' : 'bottom-full left-1/2 -translate-x-1/2'} border-8 border-transparent ${vertical ? 'border-r-black/80' : 'border-b-black/80'}`}></div>
                </div>
              )}
            </button>
          ) : (
            <Link
              to={item.link}
              target={item.target}
              className="grow flex items-center justify-center w-full h-full text-primary-foreground relative group"
            >
              {item.Icon}
              {item.label && (
                <div className={`absolute ${vertical ? 'left-full ml-3' : 'top-full mt-3'} px-3 py-2 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none`}>
                  {item.label}
                  <div className={`absolute ${vertical ? 'right-full top-1/2 -translate-y-1/2' : 'bottom-full left-1/2 -translate-x-1/2'} border-8 border-transparent ${vertical ? 'border-r-black/80' : 'border-b-black/80'}`}></div>
                </div>
              )}
            </Link>
          )}
        </DockItem>
      ))}
    </motion.div>
  );
};
 
interface DockItemProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  children: React.ReactNode;
  vertical?: boolean;
  active?: boolean;
}
 
export const DockItem = ({ mouseX, mouseY, children, vertical = false, active = false }: DockItemProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(vertical ? mouseY : mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, y: 0, width: 0, height: 0 };
    if (vertical) {
      return val - bounds.y - bounds.height / 2;
    } else {
      return val - bounds.x - bounds.width / 2;
    }
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const iconScale = useTransform(width, [40, 80], [1, 1.5]);
  const iconSpring = useSpring(iconScale, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width, height: vertical ? width : undefined }}
      className={`aspect-square w-10 rounded-full ${active ? 'bg-primary/90 ring-2 ring-white/30' : 'bg-primary'} text-secondary-foreground flex items-center justify-center`}
    >
      <motion.div
        style={{ scale: iconSpring }}
        className="flex items-center justify-center w-full h-full grow"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};