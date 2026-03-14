import { User as UserIcon } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="grid gap-1">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal account settings.</p>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-12 min-h-[400px]">
        <div className="flex flex-col items-center gap-2 text-center">
          <UserIcon className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="text-2xl font-bold tracking-tight">
            User Profile
          </h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            Manage your credentials and preferences here.
          </p>
        </div>
      </div>
    </div>
  );
}
