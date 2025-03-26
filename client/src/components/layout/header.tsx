import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location === path;
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Blog", path: "/blog" },
    { name: "Careers", path: "/careers" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-primary font-bold text-2xl font-sans">SoftFlow</div>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.path} 
                      href={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`text-lg ${isActive(link.path) ? 'text-primary font-medium' : 'text-gray-700 hover:text-primary'}`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  
                  {user?.isAdmin && (
                    <Link 
                      href="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-lg text-gray-700 hover:text-primary"
                    >
                      Admin
                    </Link>
                  )}
                  
                  {user ? (
                    <Button variant="destructive" onClick={handleLogout}>
                      Logout
                    </Button>
                  ) : (
                    <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full">Login</Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                className={`font-medium ${isActive(link.path) 
                  ? 'text-neutral-800 border-b-2 border-primary py-1' 
                  : 'text-neutral-700 hover:text-primary py-1'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {user?.isAdmin && (
              <Link 
                href="/admin"
                className="font-medium text-neutral-700 hover:text-primary py-1"
              >
                Admin
              </Link>
            )}
            
            {user ? (
              <Button 
                variant="outline"
                onClick={handleLogout}
                className="ml-2"
              >
                Logout
              </Button>
            ) : (
              <Link href="/auth">
                <Button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
