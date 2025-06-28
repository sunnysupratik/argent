const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'sans': ['Inter', 'sans-serif'], // Make Inter the default sans font
      },
      fontWeight: {
        'regular': '400',
        'medium': '500',
        'bold': '700',
        'black': '900',
      },
      fontSize: {
        'inter-headline': ['6rem', { lineHeight: '1.0', fontWeight: '900', letterSpacing: '-0.02em' }],
        'inter-body': ['1.125rem', { lineHeight: '1.6', fontWeight: '400', letterSpacing: '0.01em' }],
        'inter-nav': ['1rem', { lineHeight: '1.5', fontWeight: '500', letterSpacing: '0.5px' }],
        'inter-section': ['1.5rem', { lineHeight: '1.3', fontWeight: '700', letterSpacing: '1.5px' }],
      },
      colors: {
        // Swiss Modernist Color Palette (Primary)
        'background': '#EAEAEA',
        'text-primary': '#000000',
        'text-accent': '#FFFFFF',
        'graphic-subtle': '#B0B0B0',
        'overlay-bg': '#FFFFFF',
        'action-primary': '#000000',
        'action-hover': '#333333',
        
        // SIGNATURE ACCENT COLOR - The Game Changer
        'accent-blue': '#007AFF',
        'accent-blue-hover': '#0056CC',
        'accent-blue-light': '#E6F3FF',
        
        // shadcn/ui color system
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#007AFF",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F1F5F9",
          foreground: "#0F172A",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#F8FAFC",
          foreground: "#64748B",
        },
        accent: {
          DEFAULT: "#F1F5F9",
          foreground: "#0F172A",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
        // Legacy colors for compatibility (if needed)
        'dark-navy': '#0A0F1E',
        'electric-blue': '#3C65F5',
        'accent-purple': '#6A11CB',
        'text-light': '#F0F0F0',
        'text-bright': '#F8FAFC',
        'text-muted': '#E2E8F0',
        'text-subtle': '#CBD5E1',
        'signature-blue': '#3C65F5',
        'signature-purple': '#6A11CB',
      },
      letterSpacing: {
        'inter-tight': '-0.02em',
        'inter-normal': '0.01em',
        'inter-nav': '0.5px',
        'inter-section': '1.5px',
        'inter-button': '0.25px',
      },
      lineHeight: {
        'inter-tight': '1.0',
        'inter-comfortable': '1.6',
      },
      borderRadius: {
        'pill': '9999px',
        'glass': '16px',
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'swiss-card': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'swiss-float': '0 8px 24px rgba(0, 0, 0, 0.15)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
        'glass-hover': '0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
        'accent-glow': '0 0 0 3px rgba(0, 122, 255, 0.1)',
      },
      backdropBlur: {
        'glass': '20px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'accent-pulse': 'accentPulse 2s ease-in-out infinite',
        aurora: "aurora 60s linear infinite",
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        accentPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 122, 255, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(0, 122, 255, 0)' },
        },
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
      }
    },
  },
  plugins: [addVariablesForColors],
};

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}