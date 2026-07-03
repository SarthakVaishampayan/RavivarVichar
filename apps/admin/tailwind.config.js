/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FEF7EC',
          100: '#FDEDD0',
          200: '#FAD89D',
          300: '#F7C06A',
          400: '#F5A623',
          500: '#F5A623',
          600: '#D98F1A',
          700: '#B87814',
          800: '#8F5E10',
          900: '#754E0D',
        },
        secondary: {
          50: '#F0F7EC',
          100: '#DAECD0',
          200: '#B8DBA6',
          300: '#8FC578',
          400: '#6AA84F',
          500: '#6AA84F',
          600: '#558F3D',
          700: '#437630',
          800: '#365E28',
          900: '#2A4D1F',
        },
        accent: {
          blue: '#5DADE2',
          red: '#D96C6C',
        },
        surface: {
          white: '#FFFFFF',
          secondary: '#FAF9F7',
          section: '#F8F8F6',
        },
        ink: {
          primary: '#222222',
          secondary: '#6E6E6E',
        },
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        hero: ['64px', { lineHeight: '1.1', fontWeight: '700' }],
        section: ['46px', { lineHeight: '1.2', fontWeight: '700' }],
        card: ['26px', { lineHeight: '1.3', fontWeight: '700' }],
        body: ['18px', { lineHeight: '1.8' }],
        nav: ['14px', { lineHeight: '1.5', letterSpacing: '1px' }],
      },
      borderRadius: {
        pill: '999px',
        card: '28px',
        image: '24px',
        input: '18px',
      },
      spacing: {
        18: '4.5rem',
        30: '7.5rem',
        40: '10rem',
        60: '15rem',
      },
      maxWidth: {
        container: '1280px',
        content: '1180px',
      },
      boxShadow: {
        soft: '0 12px 40px rgba(0,0,0,0.05)',
        card: '0 15px 45px rgba(0,0,0,0.06)',
        hover: '0 20px 50px rgba(0,0,0,0.08)',
        nav: '0 2px 20px rgba(0,0,0,0.06)',
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
    },
  },
  plugins: [],
};
