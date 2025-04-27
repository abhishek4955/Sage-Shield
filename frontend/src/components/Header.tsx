import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Shield, Menu } from 'lucide-react';
import { PAGES } from '../config/pages';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Button } from './ui/button';

interface HeaderProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export function Header({ theme, onThemeToggle }: HeaderProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    PAGES.MONITORING,
    PAGES.ANALYTICS,
    PAGES.NETWORK_MAPS,
    PAGES.SYSTEM_LOGS,
    PAGES.SECURITY_RULES,
    PAGES.SETTINGS,
    PAGES.ABOUT,
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-[2560px] px-4 mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and App Name */}
          <Link 
            to={PAGES.MONITORING.path} 
            className="flex items-center space-x-2 transition-transform duration-200 hover:scale-105"
          >
            <Shield className="h-6 w-6 transition-colors duration-200 hover:text-primary" />
            <span className="font-bold text-lg sm:text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 hover:to-primary/90 transition-all duration-300">
              Sage Shield
            </span>
          </Link>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  relative px-3 py-2 text-sm font-medium rounded-md
                  transition-all duration-200 ease-in-out
                  hover:bg-primary/10
                  group
                  ${isActive(item.path) 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-primary'
                  }
                `}
              >
                {item.title}
                <span className={`
                  absolute bottom-0 left-0 w-full h-0.5 
                  bg-primary transform origin-left
                  transition-all duration-200 ease-out
                  ${isActive(item.path) 
                    ? 'scale-x-100' 
                    : 'scale-x-0 group-hover:scale-x-100'
                  }
                `} />
              </Link>
            ))}
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="transition-all duration-200 hover:scale-110 hover:bg-primary/10"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5 transition-transform duration-200 hover:rotate-180" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-64"
                aria-label="Navigation menu"
              >
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                  <SheetDescription>
                    Access all pages of Sage Shield
                  </SheetDescription>
                </SheetHeader>
                <nav 
                  className="flex flex-col space-y-1 mt-6"
                  aria-label="Mobile navigation"
                >
                  {navigationItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`
                        relative px-3 py-2 text-sm font-medium rounded-md
                        transition-all duration-200 ease-in-out
                        hover:bg-primary/10 hover:translate-x-2
                        ${isActive(item.path) 
                          ? 'text-primary bg-primary/5' 
                          : 'text-muted-foreground hover:text-primary'
                        }
                      `}
                    >
                      {item.title}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={onThemeToggle}
            className="
              rounded-full p-2.5 
              transition-all duration-300 ease-in-out
              hover:scale-110 hover:rotate-12
              hover:bg-primary/10 
              active:scale-95
            "
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 transition-all duration-300 hover:text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 transition-all duration-300 hover:text-blue-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}