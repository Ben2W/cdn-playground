"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shad-ui/card";
import { useWorkOrders } from "@/api-client/get-data";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/shad-ui/chart";

export function Workflow() {
  const { data: workOrders, isLoading } = useWorkOrders();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!workOrders) {
    return <div>No work orders found</div>;
  }

  // Calculate statistics
  const totalOrders = workOrders.length;
  const completedOrders = workOrders.filter(
    (wo) => wo.state === "completed"
  ).length;
  const inProgressOrders = workOrders.filter(
    (wo) => wo.state === "in_progress"
  ).length;
  const partsNeededOrders = workOrders.filter(
    (wo) => wo.parts_are_needed
  ).length;

  // Prepare data for bar chart
  const chartData = [
    { name: "Total", value: totalOrders },
    { name: "Completed", value: completedOrders },
    { name: "In Progress", value: inProgressOrders },
    { name: "Parts Needed", value: partsNeededOrders },
  ];

  // Calculate employee workload
  const employeeWorkload = workOrders.reduce((acc, wo) => {
    wo.involved_technicians.forEach((tech) => {
      if (!acc[tech.id]) {
        acc[tech.id] = {
          name: tech.full_name,
          count: 0,
        };
      }
      acc[tech.id].count += 1;
    });
    return acc;
  }, {});

  const employeeData = Object.values(employeeWorkload).map((emp) => ({
    name: emp.name,
    workload: emp.count,
  }));

  const chartConfig = {
    total: {
      label: "Total",
      color: "#2563eb",
    },
    completed: {
      label: "Completed",
      color: "#16a34a",
    },
    inProgress: {
      label: "In Progress",
      color: "#f59e0b",
    },
    partsNeeded: {
      label: "Parts Needed",
      color: "#dc2626",
    },
  } satisfies ChartConfig;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Work Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrders}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Completed Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {completedOrders}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>In Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {inProgressOrders}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Parts Needed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {partsNeededOrders}
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Work Orders Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="value" fill="var(--color-total)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Employee Workload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employeeData.map((emp) => (
              <div key={emp.name} className="flex items-center justify-between">
                <div className="font-medium">{emp.name}</div>
                <div className="text-sm text-gray-500">
                  {emp.workload} assigned work orders
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
