import { ReactNode } from "react";
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
  const styleVars = Object.entries(config).reduce<Record<string, string>>((acc, [key, value]) => {
    const computedColor = getComputedStyle(document.documentElement).getPropertyValue(value.cssVariable);
    acc[`--color-${key}`] = computedColor || value.cssVariable;
    return acc;
  }, {});

  return (
    <div className={cn("relative", className)} style={styleVars}>
      {children}
    </div>
  );
}
