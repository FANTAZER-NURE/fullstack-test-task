import { Dialog as RTDialog, Flex } from '@radix-ui/themes';
import type { ReactNode } from 'react';

export type AppDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: '1' | '2' | '3' | '4';
  width?: string;
};

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = '3',
  width,
}: AppDialogProps) {
  return (
    <RTDialog.Root open={open} onOpenChange={onOpenChange}>
      <RTDialog.Content size={size} width={width ?? ''}>
        {title && <RTDialog.Title>{title}</RTDialog.Title>}
        {description && (
          <RTDialog.Description>{description}</RTDialog.Description>
        )}
        <div style={{ marginTop: 12 }}>{children}</div>
        {footer && (
          <Flex mt="4" gap="3" justify="end">
            {footer}
          </Flex>
        )}
      </RTDialog.Content>
    </RTDialog.Root>
  );
}
