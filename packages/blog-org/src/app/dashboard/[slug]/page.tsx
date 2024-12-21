"use client";

import { dynamicRoutes } from "@/settings/dashboardRoutes";
import { usePathname, notFound, useRouter } from "next/navigation";

export default function DashboardPage({ params }) {
  const router = useRouter();
  const pathname = usePathname();
  const key = pathname.split("/").pop();
  const Component = dynamicRoutes(key);
  const { slug } = params || { slug: "" };

  if (!slug) notFound();

  return Component ? <Component /> : null;
}
