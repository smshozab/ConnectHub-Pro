module.exports = {
  content: ["./pages/*.{html,js}", "./index.html", "./js/*.js"],
  theme: {
    extend: {
      colors: {
        // Primary Colors - Forest Green
        primary: {
          DEFAULT: "#2B5D4F", // forest-green-700
          50: "#F0F7F4", // forest-green-50
          100: "#D1E7DD", // forest-green-100
          200: "#A3CFBB", // forest-green-200
          300: "#75B799", // forest-green-300
          400: "#479F77", // forest-green-400
          500: "#2B5D4F", // forest-green-500
          600: "#234A3F", // forest-green-600
          700: "#1B372F", // forest-green-700
          800: "#13241F", // forest-green-800
          900: "#0B120F", // forest-green-900
        },
        // Secondary Colors - Earth Brown
        secondary: {
          DEFAULT: "#8B4513", // earth-brown-600
          50: "#F7F3F0", // earth-brown-50
          100: "#E8DDD4", // earth-brown-100
          200: "#D1BBA9", // earth-brown-200
          300: "#BA997E", // earth-brown-300
          400: "#A37753", // earth-brown-400
          500: "#8B4513", // earth-brown-500
          600: "#6F370F", // earth-brown-600
          700: "#53290B", // earth-brown-700
          800: "#371B07", // earth-brown-800
          900: "#1B0D04", // earth-brown-900
        },
        // Accent Colors - Coral
        accent: {
          DEFAULT: "#FF6B35", // coral-500
          50: "#FFF4F1", // coral-50
          100: "#FFE4DC", // coral-100
          200: "#FFC9B9", // coral-200
          300: "#FFAE96", // coral-300
          400: "#FF9373", // coral-400
          500: "#FF6B35", // coral-500
          600: "#E5522A", // coral-600
          700: "#B8411F", // coral-700
          800: "#8B3014", // coral-800
          900: "#5E1F09", // coral-900
        },
        // Background Colors
        background: "#FEFEFE", // neutral-50
        surface: "#F8F9FA", // neutral-100
        // Text Colors
        text: {
          primary: "#1A1A1A", // neutral-900
          secondary: "#6B7280", // neutral-500
        },
        // Status Colors
        success: {
          DEFAULT: "#10B981", // emerald-500
          50: "#ECFDF5", // emerald-50
          100: "#D1FAE5", // emerald-100
          500: "#10B981", // emerald-500
          600: "#059669", // emerald-600
        },
        warning: {
          DEFAULT: "#F59E0B", // amber-500
          50: "#FFFBEB", // amber-50
          100: "#FEF3C7", // amber-100
          500: "#F59E0B", // amber-500
          600: "#D97706", // amber-600
        },
        error: {
          DEFAULT: "#EF4444", // red-500
          50: "#FEF2F2", // red-50
          100: "#FEE2E2", // red-100
          500: "#EF4444", // red-500
          600: "#DC2626", // red-600
        },
        // Border Colors
        border: {
          DEFAULT: "#E5E7EB", // gray-200
          light: "#F3F4F6", // gray-100
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        accent: ['Playfair Display', 'serif'],
        playfair: ['Playfair Display', 'serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      boxShadow: {
        'custom-sm': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'custom-md': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'custom-lg': '0 10px 25px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        DEFAULT: '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
        'card': '8px',
        'button': '6px',
      },
      transitionDuration: {
        'default': '300ms',
      },
      transitionTimingFunction: {
        'default': 'ease-out',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'slide-up': 'slideUp 300ms ease-out',
        'scale-in': 'scaleIn 300ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}