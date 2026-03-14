import { User as UserIcon, Mail, ShieldAlert } from 'lucide-react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  // Extract session variables securely server-side
  const userRole = (session?.user as { role?: string })?.role || "GUEST";
  const userEmail = session?.user?.email || "No Email Provided";

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="grid gap-1">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal account settings and identity.</p>
      </div>
      
      <div className="flex flex-1 items-center justify-center rounded-lg border shadow-sm p-4 sm:p-12 min-h-[400px]">
        <div className="flex flex-col items-center gap-6 max-w-sm w-full p-8 rounded-xl bg-card border text-card-foreground shadow">
          
          <div className="rounded-full bg-primary/10 p-5 mt-2 shadow-inner">
            <UserIcon className="h-12 w-12 text-primary" />
          </div>
          
          <div className="flex flex-col items-center space-y-1 w-full border-b pb-6">
            <h3 className="text-xl font-bold tracking-tight">
              Warehouse Operative
            </h3>
            <Badge variant="default" className="mt-2 text-xs font-semibold px-2 py-0.5">
              <ShieldAlert className="w-3 h-3 mr-1" />
              {userRole} ACCESS
            </Badge>
          </div>
          
          <div className="flex flex-col items-center w-full space-y-3 pt-2">
            <div className="flex w-full items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </span>
              <span className="font-medium text-foreground">{userEmail}</span>
            </div>
            
            <div className="flex w-full items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                Security
              </span>
              <span className="text-emerald-500 font-medium">OTP Secured</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
