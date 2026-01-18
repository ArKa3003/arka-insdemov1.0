"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// Size configurations
export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

const sizeStyles: Record<ModalSize, string> = {
  sm: "max-w-[400px]",
  md: "max-w-[500px]",
  lg: "max-w-[600px]",
  xl: "max-w-[800px]",
  full: "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]",
};

// Animation variants
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1] as const,
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 10,
    transition: {
      duration: 0.2,
      ease: "easeIn" as const,
    }
  },
};

// Root and trigger components
const Modal = DialogPrimitive.Root;
const ModalTrigger = DialogPrimitive.Trigger;
const ModalPortal = DialogPrimitive.Portal;
const ModalClose = DialogPrimitive.Close;

// Overlay component
const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay ref={ref} asChild {...props}>
    <motion.div
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
        className
      )}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={overlayVariants}
      transition={{ duration: 0.2 }}
    />
  </DialogPrimitive.Overlay>
));
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

// Content component
export interface ModalContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  size?: ModalSize;
  showCloseButton?: boolean;
  onCloseClick?: () => void;
}

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(({ className, children, size = "md", showCloseButton = true, onCloseClick, ...props }, ref) => (
  <ModalPortal>
    <AnimatePresence>
      <ModalOverlay />
      <DialogPrimitive.Content ref={ref} asChild {...props}>
        <motion.div
          className={cn(
            "fixed left-[50%] top-[50%] z-50 w-full",
            "translate-x-[-50%] translate-y-[-50%]",
            "bg-white rounded-xl shadow-2xl",
            "border border-slate-200",
            "focus:outline-none",
            sizeStyles[size],
            size === "full" && "h-[calc(100vh-2rem)] flex flex-col",
            className
          )}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={contentVariants}
        >
          {children}
          {showCloseButton && (
            <DialogPrimitive.Close
              onClick={onCloseClick}
              className={cn(
                "absolute right-4 top-4 p-1.5 rounded-lg",
                "text-slate-400 hover:text-slate-600",
                "hover:bg-slate-100",
                "focus:outline-none focus:ring-2 focus:ring-arka-blue focus:ring-offset-2",
                "transition-all duration-150",
                "disabled:pointer-events-none"
              )}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          )}
        </motion.div>
      </DialogPrimitive.Content>
    </AnimatePresence>
  </ModalPortal>
));
ModalContent.displayName = DialogPrimitive.Content.displayName;

// Header component
export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  showBorder?: boolean;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
  className,
  showBorder = true,
  ...props
}) => (
  <div
    className={cn(
      "flex flex-col gap-1.5 p-6 pr-12",
      showBorder && "border-b border-slate-100",
      className
    )}
    {...props}
  />
);
ModalHeader.displayName = "ModalHeader";

// Title component
const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "font-display text-xl font-semibold text-arka-navy",
      className
    )}
    {...props}
  />
));
ModalTitle.displayName = DialogPrimitive.Title.displayName;

// Description component
const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-slate-500", className)}
    {...props}
  />
));
ModalDescription.displayName = DialogPrimitive.Description.displayName;

// Body component
export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  scrollable?: boolean;
}

const ModalBody: React.FC<ModalBodyProps> = ({
  className,
  scrollable = false,
  ...props
}) => (
  <div
    className={cn(
      "p-6",
      scrollable && "overflow-y-auto flex-1",
      className
    )}
    {...props}
  />
);
ModalBody.displayName = "ModalBody";

// Footer component
export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  showBorder?: boolean;
}

const ModalFooter: React.FC<ModalFooterProps> = ({
  className,
  showBorder = true,
  ...props
}) => (
  <div
    className={cn(
      "flex items-center justify-end gap-3 p-6",
      showBorder && "border-t border-slate-100",
      className
    )}
    {...props}
  />
);
ModalFooter.displayName = "ModalFooter";

// Compound Modal component for easier use
export interface CompoundModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  showCloseButton?: boolean;
}

const CompoundModal: React.FC<CompoundModalProps> = ({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  size = "md",
  showCloseButton = true,
}) => (
  <Modal open={open} onOpenChange={onOpenChange}>
    {trigger && <ModalTrigger asChild>{trigger}</ModalTrigger>}
    <ModalContent size={size} showCloseButton={showCloseButton}>
      {(title || description) && (
        <ModalHeader>
          {title && <ModalTitle>{title}</ModalTitle>}
          {description && <ModalDescription>{description}</ModalDescription>}
        </ModalHeader>
      )}
      {children && <ModalBody>{children}</ModalBody>}
      {footer && <ModalFooter>{footer}</ModalFooter>}
    </ModalContent>
  </Modal>
);
CompoundModal.displayName = "CompoundModal";

// Confirmation modal variant
export interface ConfirmModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onOpenChange,
  title = "Confirm Action",
  description = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "info",
  isLoading = false,
}) => {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange?.(false);
  };

  const handleConfirm = () => {
    onConfirm?.();
  };

  const confirmButtonClass = cn(
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
    variant === "danger" && "bg-arka-red text-white hover:bg-arka-red/90",
    variant === "warning" && "bg-arka-amber text-arka-navy hover:bg-arka-amber/90",
    variant === "info" && "bg-arka-blue text-white hover:bg-arka-blue/90",
    isLoading && "opacity-50 pointer-events-none"
  );

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="sm">
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <ModalDescription>{description}</ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {cancelText}
          </button>
          <button onClick={handleConfirm} className={confirmButtonClass}>
            {isLoading ? "Loading..." : confirmText}
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
ConfirmModal.displayName = "ConfirmModal";

export {
  Modal,
  ModalPortal,
  ModalOverlay,
  ModalClose,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  CompoundModal,
  ConfirmModal,
};
