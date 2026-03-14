import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getRecentActivity } from "@/app/actions/dashboard";

export async function RecentActivity() {
  const response = await getRecentActivity();
  const activity = response.success ? response.data ?? [] : [];

  if (activity.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No recent activity detected.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Reference</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="hidden md:table-cell">Product</TableHead>
          <TableHead className="hidden sm:table-cell">Date</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activity.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.reference}</TableCell>
            <TableCell>{item.type}</TableCell>
            <TableCell className="hidden md:table-cell text-muted-foreground">
              {item.product.name}
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              {new Date(item.date).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <Badge variant={
                item.status === "Done" ? "default" :
                item.status === "Pending" ? "secondary" : "outline"
              }>
                {item.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
