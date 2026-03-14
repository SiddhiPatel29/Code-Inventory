import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="grid gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage system configuration and warehouses.</p>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-12 min-h-[400px]">
        <div className="flex flex-col items-center gap-2 text-center">
          <Settings className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="text-2xl font-bold tracking-tight">
            Settings Dashboard
          </h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            System configuration and warehouse management will be available here.
          </p>
        </div>
      </div>
    </div>
  );
}
