import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, NotebookText, Settings } from 'lucide-react'; // Added Settings for potential future use

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-8 w-8 text-primary">
            <rect width="256" height="256" fill="none"/>
            <path d="M128,24a104,104,0,1,0,104,104A104.2,104.2,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z" opacity="0.2"/>
            <path d="M128,24a104,104,0,1,0,104,104A104.2,104.2,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-32-80a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Zm-16-40a8,8,0,0,1,0-16H176a8,8,0,0,1,0,16Z" fill="currentColor"/>
          </svg>
          <span className="font-headline text-2xl font-semibold text-foreground">TaskZen</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5" />
              <span className="hidden sm:inline">Tasks</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/recipes" className="flex items-center gap-2">
              <NotebookText className="h-5 w-5" />
              <span className="hidden sm:inline">Recipes</span>
            </Link>
          </Button>
          {/* Example for future settings link */}
          {/* 
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
          */}
        </nav>
      </div>
    </header>
  );
}
