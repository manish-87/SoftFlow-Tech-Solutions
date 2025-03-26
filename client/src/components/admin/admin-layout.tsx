import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, Redirect } from "wouter";
import AdminSidebar from "./sidebar";
import { Button } from "@/components/ui/button";
import { Menu, User, LogOut } from "lucide-react";
import { 
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  // Redirect to login if not an admin
  if (!user) {
    return <Redirect to="/auth" />;
  }

  if (!user.isAdmin) {
    return <Redirect to="/" />;
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Top Navbar - Mobile */}
      <header className="bg-white border-b border-neutral-200 h-16 flex items-center justify-between px-4 md:px-6 lg:hidden">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <AdminSidebar />
            </SheetContent>
          </Sheet>
          <div className="font-bold text-xl">SoftFlow Admin</div>
        </div>
        <UserMenu user={user} onLogout={handleLogout} />
      </header>

      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-64 border-r border-neutral-200 bg-white">
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Navbar - Desktop */}
          <header className="bg-white border-b border-neutral-200 h-16 items-center justify-end px-6 hidden lg:flex">
            <UserMenu user={user} onLogout={handleLogout} />
          </header>

          {/* Page Content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}

function UserMenu({ user, onLogout }: { user: any; onLogout: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <span className="hidden sm:inline">{user.username}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="text-muted-foreground" disabled>
          <div>Signed in as</div>
          <div className="font-medium">{user.username}</div>
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem onClick={onLogout} className="text-red-600">
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
