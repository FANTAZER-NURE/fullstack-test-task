import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Flex, Text, TextField } from "@radix-ui/themes";
import { Dialog } from "@/components/ui/Dialog";
import { Label } from "@radix-ui/react-label";

export type UsernamePromptProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (username: string) => void;
};

type FormValues = { username: string };
const formId = "usernamePromptForm";

export default function UsernamePrompt({ open, onClose, onSubmit }: UsernamePromptProps) {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { username: "" }
  });

  const submit = useCallback(
    (data: FormValues) => {
      onSubmit(data.username.trim());
    },
    [onSubmit]
  );

  const footer = (
    <>
      <Button variant="soft" onClick={onClose}>
        Cancel
      </Button>
      <Button type="submit" form={formId}>
        Continue
      </Button>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={onClose} title="Enter a username" footer={footer}>
      <form id={formId} onSubmit={handleSubmit(submit)}>
        <Flex direction="column" gap="3">
          <Text size="2" color="gray">
            This will be used to save your movies per user.
          </Text>
          <Flex direction="column" gap="2">
            <Label htmlFor="username">Your username</Label>
            <TextField.Root id="username" placeholder="e.g. alice" {...register("username", { required: true, minLength: 3 })} />
          </Flex>
          {formState.errors.username && (
            <Text color="red" size="1">
              Username must be at least 3 characters
            </Text>
          )}
        </Flex>
      </form>
    </Dialog>
  );
}
