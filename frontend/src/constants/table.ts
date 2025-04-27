export const TABLE_CONSTANTS = {
  // Table dimensions
  MAX_HEIGHT: 300, // Reduced from 600 to make it more compact
  
  // Status colors
  STATUS_COLORS: {
    SUSPICIOUS: {
      TEXT: {
        LIGHT: 'text-red-600',
        DARK: 'text-red-400'
      },
      BACKGROUND: {
        LIGHT: 'bg-red-50/50',
        DARK: 'bg-red-900/10'
      }
    },
    NORMAL: {
      TEXT: {
        LIGHT: 'text-green-600',
        DARK: 'text-green-400'
      }
    }
  },

  // Scrollbar
  SCROLLBAR: {
    THUMB: {
      DEFAULT: 'primary/20',
      HOVER: 'primary/40',
      DARK: {
        DEFAULT: 'primary/40',
        HOVER: 'primary/60'
      }
    }
  }
};