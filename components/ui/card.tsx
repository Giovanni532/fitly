import { cn } from "@/lib/utils";
import * as React from "react";
import { Text, TextProps, View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTextProps extends TextProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ className, children, ...props }: CardProps) {
  return (
    <View
      className={cn(
        "bg-card rounded-2xl border border-border p-4 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}

function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <View
      className={cn(
        "flex-row justify-between items-start gap-4 mb-4",
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}

function CardTitle({ className, children, ...props }: CardTextProps) {
  return (
    <Text className={cn("text-lg font-semibold text-foreground", className)} {...props}>
      {children}
    </Text>
  );
}

function CardDescription({ className, children, ...props }: CardTextProps) {
  return (
    <Text className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </Text>
  );
}

function CardContent({ className, children, ...props }: CardProps) {
  return (
    <View className={cn("", className)} {...props}>
      {children}
    </View>
  );
}

function CardFooter({ className, children, ...props }: CardProps) {
  return (
    <View
      className={cn("mt-4 flex-row items-center justify-end gap-4", className)}
      {...props}
    >
      {children}
    </View>
  );
}

export {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
};

