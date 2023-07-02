"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";

export interface ModalProps {
  title: string;
  description?: string;
  isOpen: boolean;
  children?: React.ReactNode;
  onClose: () => void;
}

const Modal = ({
  title,
  description,
  isOpen,
  children,
  onClose,
}: ModalProps) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};

Modal.displayName = "Modal";

export { Modal };
