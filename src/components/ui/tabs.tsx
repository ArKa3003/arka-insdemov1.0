"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Variant and orientation types
export type TabsVariant = "underline" | "pill" | "enclosed";
export type TabsOrientation = "horizontal" | "vertical";
export type TabsSize = "sm" | "md" | "lg";

// Context for sharing variant/orientation
interface TabsContextValue {
  variant: TabsVariant;
  orientation: TabsOrientation;
  size: TabsSize;
}

const TabsContext = React.createContext<TabsContextValue>({
  variant: "underline",
  orientation: "horizontal",
  size: "md",
});

// Root component
export interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  variant?: TabsVariant;
  size?: TabsSize;
}

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
>(({ className, variant = "underline", orientation = "horizontal", children, ...props }, ref) => {
  // Determine size based on context or default
  const size = "md";
  
  return (
    <TabsContext.Provider value={{ variant, orientation: orientation as TabsOrientation, size }}>
      <TabsPrimitive.Root
        ref={ref}
        orientation={orientation}
        className={cn(
          "w-full",
          orientation === "vertical" && "flex gap-4",
          className
        )}
        {...props}
      >
        {children}
      </TabsPrimitive.Root>
    </TabsContext.Provider>
  );
});
Tabs.displayName = TabsPrimitive.Root.displayName;

// List component
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const { variant, orientation } = React.useContext(TabsContext);

  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "flex shrink-0",
        // Orientation styles
        orientation === "horizontal" && "flex-row",
        orientation === "vertical" && "flex-col",
        // Variant styles
        variant === "underline" && [
          "border-b border-slate-200",
          orientation === "vertical" && "border-b-0 border-r",
        ],
        variant === "pill" && [
          "bg-slate-100 p-1 rounded-lg gap-1",
        ],
        variant === "enclosed" && [
          "bg-slate-50 border border-slate-200 rounded-t-lg",
          "border-b-0",
        ],
        className
      )}
      {...props}
    />
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

// Trigger component
export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, children, icon, badge, ...props }, ref) => {
  const { variant, orientation, size } = React.useContext(TabsContext);

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5",
  };

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "relative inline-flex items-center justify-center whitespace-nowrap font-medium",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arka-blue focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        sizeClasses[size],
        // Variant-specific styles
        variant === "underline" && [
          "text-slate-500 hover:text-slate-700",
          "data-[state=active]:text-arka-blue",
          "border-b-2 border-transparent",
          "data-[state=active]:border-arka-blue",
          "-mb-px",
          orientation === "vertical" && [
            "border-b-0 border-r-2 -mr-px",
            "data-[state=active]:border-r-arka-blue",
          ],
        ],
        variant === "pill" && [
          "text-slate-600 hover:text-slate-900",
          "rounded-md",
          "data-[state=active]:bg-white data-[state=active]:text-arka-navy",
          "data-[state=active]:shadow-sm",
        ],
        variant === "enclosed" && [
          "text-slate-500 hover:text-slate-700 hover:bg-slate-100",
          "border-b-2 border-transparent",
          "data-[state=active]:bg-white data-[state=active]:text-arka-navy",
          "data-[state=active]:border-slate-200 data-[state=active]:border-b-white",
          "data-[state=active]:rounded-t-lg",
          "data-[state=active]:-mb-px",
        ],
        className
      )}
      {...props}
    >
      {icon && (
        <span className="flex-shrink-0 w-4 h-4">{icon}</span>
      )}
      {children}
      {badge && (
        <span className="ml-1">{badge}</span>
      )}
    </TabsPrimitive.Trigger>
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

// Content component with animations
export interface TabsContentProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {
  animated?: boolean;
}

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, children, animated = true, ...props }, ref) => {
  const { orientation } = React.useContext(TabsContext);

  if (!animated) {
    return (
      <TabsPrimitive.Content
        ref={ref}
        className={cn(
          "mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arka-blue focus-visible:ring-offset-2",
          orientation === "vertical" && "mt-0 flex-1",
          className
        )}
        {...props}
      >
        {children}
      </TabsPrimitive.Content>
    );
  }

  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arka-blue focus-visible:ring-offset-2",
        orientation === "vertical" && "mt-0 flex-1",
        className
      )}
      {...props}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </TabsPrimitive.Content>
  );
});
TabsContent.displayName = TabsPrimitive.Content.displayName;

// Animated underline indicator (for underline variant)
interface TabIndicatorProps {
  activeTab: string;
  tabs: { value: string; label: string }[];
  className?: string;
}

const TabIndicator: React.FC<TabIndicatorProps> = ({
  activeTab,
  tabs,
  className,
}) => {
  const activeIndex = tabs.findIndex((tab) => tab.value === activeTab);
  const tabWidth = 100 / tabs.length;

  return (
    <motion.div
      className={cn(
        "absolute bottom-0 h-0.5 bg-arka-blue",
        className
      )}
      initial={false}
      animate={{
        left: `${activeIndex * tabWidth}%`,
        width: `${tabWidth}%`,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
    />
  );
};

// Simple tabs component for common use cases
export interface SimpleTabsProps {
  tabs: {
    value: string;
    label: string;
    icon?: React.ReactNode;
    content: React.ReactNode;
    disabled?: boolean;
  }[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: TabsVariant;
  orientation?: TabsOrientation;
  className?: string;
}

const SimpleTabs: React.FC<SimpleTabsProps> = ({
  tabs,
  defaultValue,
  value,
  onValueChange,
  variant = "underline",
  orientation = "horizontal",
  className,
}) => {
  const initialValue = defaultValue || value || tabs[0]?.value;

  return (
    <Tabs
      defaultValue={initialValue}
      value={value}
      onValueChange={onValueChange}
      variant={variant}
      orientation={orientation}
      className={className}
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            icon={tab.icon}
            disabled={tab.disabled}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};
SimpleTabs.displayName = "SimpleTabs";

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabIndicator,
  SimpleTabs,
};
