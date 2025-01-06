"use client"

import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ChartConfig {
  [key: string]: {
    label: string;
    cssVariable: string;
  };
}

interface ChartContainerProps {
  config: ChartConfig;
  children: ReactNode;
  className?: string;
}

export function ChartContainer({ config, children, className }: ChartContainerProps) {
  const [styleVars, setStyleVars] = useState<Record<string, string>>({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    try {
      const computedVars = Object.entries(config).reduce<Record<string, string>>((acc, [key, value]) => {
        acc[`--color-${key}`] = value.cssVariable;
        return acc;
      }, {});
      setStyleVars(computedVars);
    } catch {
      // Fallback to using raw CSS variables if computation fails
      const fallbackVars = Object.entries(config).reduce<Record<string, string>>((acc, [key, value]) => {
        acc[`--color-${key}`] = value.cssVariable;
        return acc;
      }, {});
      setStyleVars(fallbackVars);
    }
  }, [config, isMounted]);

  return (
    <div className={cn("relative", className)} style={styleVars}>
      {children}
    </div>
  );
}
