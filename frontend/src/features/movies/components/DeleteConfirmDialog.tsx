import { Button, Spinner } from '@radix-ui/themes';
import { Dialog } from '@/components/ui/Dialog';

export type DeleteConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
};

export default function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  loading,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete movie"
      description="Are you sure? This action cannot be undone."
      size="2"
      width="370px"
      footer={
        <>
          <Button variant="soft" color="gray" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="solid"
            color="red"
            onClick={onConfirm}
            disabled={!!loading}
          >
            {loading ? <Spinner /> : 'Delete'}
          </Button>
        </>
      }
    />
  );
}
