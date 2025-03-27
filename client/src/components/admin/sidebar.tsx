import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Newspaper,
  MessageSquare,
  Building,
  Briefcase,
  ArrowLeft,
  Home,
  Layers,
  Users,
  FolderKanban,
  Receipt
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminSidebar() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path || location.startsWith(`${path}/`);
  };

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
      exact: true
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Projects",
      href: "/admin/projects",
      icon: <FolderKanban className="h-5 w-5" />,
    },
    {
      name: "Invoices",
      href: "/admin/invoices",
      icon: <Receipt className="h-5 w-5" />,
    },
    {
      name: "Blog Management",
      href: "/admin/blog",
      icon: <Newspaper className="h-5 w-5" />,
    },
    {
      name: "Messages",
      href: "/admin/messages",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      name: "Partners",
      href: "/admin/partners",
      icon: <Building className="h-5 w-5" />,
    },
    {
      name: "Services",
      href: "/admin/services",
      icon: <Layers className="h-5 w-5" />,
    },
    {
      name: "Careers",
      href: "/admin/careers",
      icon: <Briefcase className="h-5 w-5" />,
    },
  ];

  return (
    <aside className="h-full flex flex-col">
      {/* Admin Panel Header */}
      <div className="p-6">
        <h1 className="text-2xl font-bold">SoftFlow</h1>
        <p className="text-sm text-muted-foreground">Administration Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <a
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    (item.exact ? isActive(item.href) : location.startsWith(item.href))
                      ? "bg-primary text-primary-foreground"
                      : "text-neutral-700 hover:bg-neutral-100"
                  )}
                >
                  {item.icon}
                  {item.name}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Back to Site */}
      <div className="p-6 border-t border-neutral-200">
        <Link href="/">
          <a className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Website</span>
          </a>
        </Link>
      </div>
    </aside>
  );
}
