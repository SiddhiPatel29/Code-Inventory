import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ArrowDownToLine, 
  Truck, 
  ArrowLeftRight, 
  SlidersHorizontal,
  Settings,
  User,
  Package2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  className?: string;
  activeHref?: string;
}

export function Sidebar({ className, activeHref = '/' }: SidebarProps) {
  const routes = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { label: 'Products', icon: Package, href: '/products' },
    { label: 'Receipts', icon: ArrowDownToLine, href: '/receipts' },
    { label: 'Deliveries', icon: Truck, href: '/deliveries' },
    { label: 'Transfers', icon: ArrowLeftRight, href: '/transfers' },
    { label: 'Adjustments', icon: SlidersHorizontal, href: '/adjustments' },
  ];

  return (
    <div className={cn("pb-12 min-h-screen border-r bg-muted/20", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <Link href="/" className="flex items-center pl-3 mb-14">
            <Package2 className="mr-2 h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">CoreInventory</h1>
          </Link>
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
              Overview
            </h2>
            {routes.map((route) => (
              <Link key={route.href} href={route.href} className="w-full">
                <Button
                  variant={activeHref === route.href ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", activeHref === route.href && "font-semibold")}
                >
                  <route.icon className="mr-2 h-4 w-4" />
                  {route.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
            Settings
          </h2>
          <div className="space-y-1">
            <Link href="/settings" className="w-full">
              <Button variant={activeHref === '/settings' ? "secondary" : "ghost"} className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
              </Button>
            </Link>
            <Link href="/profile" className="w-full">
              <Button variant={activeHref === '/profile' ? "secondary" : "ghost"} className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
