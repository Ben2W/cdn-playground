"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shad-ui/card";
import { useWorkOrders } from "@/api-client/get-data";
import type { WorkOrder } from "@dsa/api/src/shop-ware/api-helpers/get-work-data";
import {
  PieChart,
  Clock,
  CheckCircle2,
  Timer,
  CalendarClock,
} from "lucide-react";
import { Progress } from "@/components/shad-ui/progress";
import { Label as ShadcnLabel } from "@/components/shad-ui/label"; // Assuming there's a Label component
import { Loading } from "@/components/loading";

const colors = {
  gray: "bg-gray-200 dark:bg-gray-800",
  stone: "bg-stone-200 dark:bg-stone-800",
  pink: "bg-pink-200 dark:bg-pink-800",
  yellow: "bg-yellow-200 dark:bg-yellow-800",
  slate: "bg-slate-200 dark:bg-slate-800",
  green: "bg-green-200 dark:bg-green-800",
};

const Label = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  if (label === "Repair") {
    return (
      <ShadcnLabel className={`px-2 py-1 rounded ${colors.stone}`}>
        {children}
      </ShadcnLabel>
    );
  }

  if (label === "Diagnosis") {
    return (
      <ShadcnLabel className={`px-2 py-1 rounded ${colors.pink}`}>
        {children}
      </ShadcnLabel>
    );
  }

  if (label === "Employee") {
    return (
      <ShadcnLabel className={`px-2 py-1 rounded ${colors.yellow}`}>
        {children}
      </ShadcnLabel>
    );
  }

  if (label === "Scheduled") {
    return (
      <ShadcnLabel className={`px-2 py-1 rounded ${colors.slate}`}>
        {children}
      </ShadcnLabel>
    );
  }

  if (label === "Tire") {
    return (
      <ShadcnLabel className={`px-2 py-1 rounded ${colors.green}`}>
        {children}
      </ShadcnLabel>
    );
  }

  return (
    <ShadcnLabel className={`px-2 py-1 rounded ${colors.gray}`}>
      {children}
    </ShadcnLabel>
  );
};

function processTechnicianData(workOrders: WorkOrder[]) {
  const technicianMap = new Map();

  workOrders.forEach((order) => {
    const technicianId =
      order.technician?.id ||
      (order.involved_technicians.length > 0
        ? order.involved_technicians[0]
        : null);

    if (technicianId) {
      const technicianName =
        order.technician?.full_name || order.advisor?.full_name;

      if (!technicianMap.has(technicianId)) {
        technicianMap.set(technicianId, {
          id: technicianId,
          name: technicianName,
          completedOrders: [],
          activeOrders: [],
          scheduledOrders: [],
          completedHours: 0,
          totalHours: 0,
        });
      }

      const technicianData = technicianMap.get(technicianId);
      const completedHours = parseFloat(
        order.completed_labors_total_hours || "0"
      );
      const totalHours = parseFloat(order.labors_total_hours || "0");

      technicianData.completedHours += completedHours;
      technicianData.totalHours += totalHours;

      // Categorize orders
      if (order.state === "invoice") {
        technicianData.completedOrders.push(order);
      } else if (order.state === "in_progress") {
        technicianData.activeOrders.push(order);
      } else if (order.state === "estimate") {
        technicianData.scheduledOrders.push(order);
      }
    }

    // Ensure active_tech_ids are of type (number | undefined)[]
    if (order.service_statuses) {
      order.service_statuses.forEach((status) => {
        status.active_tech_ids = status.active_tech_ids.map(
          (id) => id ?? undefined
        );
      });
    }
  });

  return Array.from(technicianMap.values());
}

function WorkOrderCard({ order }: { order: WorkOrder }) {
  return (
    <div className="mb-2 p-3 py-6 bg-secondary/10 rounded-lg">
      <div className="flex justify-between items-center">
        {order.status && (
          <span className="font-medium"> {order.status.text}</span>
        )}
        <span className="text-xs">{order.labors_total_hours}hrs</span>
      </div>

      <div className="text-sm mt-1">
        {order.vehicle.year} {order.vehicle.make} {order.vehicle.model}
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        {order.customer.name}
      </div>
      <div className="flex gap-1 mt-2 justify-between items-center">
        {order.label && (
          <Label label={order.label.text}>{order.label.text}</Label>
        )}
        <span className="text-xs text-muted-foreground">#{order.number}</span>
      </div>
    </div>
  );
}

export function TechnicianWorkloadCards() {
  const { data: workOrders, isLoading } = useWorkOrders();

  if (isLoading) {
    return <Loading />;
  }

  if (!workOrders) {
    return <div>No work orders found</div>;
  }

  const technicianData = processTechnicianData(workOrders);

  // Sort the technician data by status
  technicianData.forEach((technician) => {
    technician.activeOrders.sort((a: WorkOrder, b: WorkOrder) =>
      (a.status?.row_order ?? Infinity) > (b.status?.row_order ?? Infinity)
        ? 1
        : -1
    );
    technician.scheduledOrders.sort((a: WorkOrder, b: WorkOrder) =>
      (a.status?.row_order ?? Infinity) > (b.status?.row_order ?? Infinity)
        ? 1
        : -1
    );
    technician.completedOrders.sort((a: WorkOrder, b: WorkOrder) =>
      (a.status?.row_order ?? Infinity) > (b.status?.row_order ?? Infinity)
        ? 1
        : -1
    );
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {technicianData.map((technician) => (
        <Card key={technician.id}>
          <CardHeader className="bg-secondary/5">
            <CardTitle className="flex justify-between items-center">
              <span>{technician.name}</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  {technician.completedHours}/{technician.totalHours}hrs
                </span>
              </div>
            </CardTitle>
            <Progress
              value={
                (technician.completedHours / (technician.totalHours || 1)) * 100
              }
              className="h-2"
            />
          </CardHeader>
          <CardContent className="p-4">
            {technician.activeOrders.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Timer className="w-4 h-4 text-blue-500" />
                  <h3 className="font-semibold">In Progress</h3>
                </div>
                {technician.activeOrders.map((order: WorkOrder) => (
                  <WorkOrderCard key={order.id} order={order} />
                ))}
              </div>
            )}

            {technician.scheduledOrders.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarClock className="w-4 h-4 text-orange-500" />
                  <h3 className="font-semibold">Provided Estimate</h3>
                </div>
                {technician.scheduledOrders.map((order: WorkOrder) => (
                  <WorkOrderCard key={order.id} order={order} />
                ))}
              </div>
            )}

            {technician.completedOrders.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <h3 className="font-semibold">Completed with Invoice</h3>
                </div>
                {technician.completedOrders.map((order: WorkOrder) => (
                  <WorkOrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
