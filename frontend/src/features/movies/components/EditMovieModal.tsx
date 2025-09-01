import { useEffect } from 'react';
import { Button, Flex, TextField, Text } from '@radix-ui/themes';
import { Dialog } from '@/components/ui/Dialog';
import { useForm } from 'react-hook-form';

export type EditFormValues = {
  title: string;
  year: string | null;
  runtime: string | null;
  genre: string | null;
  director: string | null;
};

export type EditMovieModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: EditFormValues;
  onSubmit: (values: EditFormValues) => void;
  loading?: boolean;
};

export default function EditMovieModal({
  open,
  onOpenChange,
  initial,
  onSubmit,
  loading,
}: EditMovieModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditFormValues>({
    defaultValues: initial,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    reset(initial);
  }, [initial, reset]);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit movie"
      size="2"
      footer={
        <>
          <Button
            variant="soft"
            color="gray"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            onClick={handleSubmit((v) => onSubmit(v))}
            disabled={loading}
          >
            Save
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit((v) => onSubmit(v))}>
        <Flex direction="column" gap="3">
          <div>
            <label>
              Title
              <TextField.Root
                {...register('title', {
                  required: 'Title is required',
                  minLength: { value: 3, message: 'Min length is 3' },
                })}
              />
            </label>
            {errors.title && (
              <Text color="red" size="1">
                {errors.title.message}
              </Text>
            )}
          </div>

          <div>
            <label>
              Year
              <TextField.Root
                {...register('year', {
                  validate: (v) =>
                    !v ||
                    v.length === 0 ||
                    /^\d{4}$/.test(String(v)) ||
                    'Year must be YYYY',
                })}
              />
            </label>
            {errors.year && (
              <Text color="red" size="1">
                {errors.year.message as string}
              </Text>
            )}
          </div>

          <div>
            <label>
              Runtime (min)
              <TextField.Root
                type="number"
                min="0"
                step="1"
                {...register('runtime', {
                  setValueAs: (v) =>
                    v === '' || v === undefined ? null : String(v),
                  validate: (v) =>
                    v === null ||
                    v === undefined ||
                    /^\d+$/.test(String(v)) ||
                    'Digits only',
                })}
              />
            </label>
            {errors.runtime && (
              <Text color="red" size="1">
                {errors.runtime.message as string}
              </Text>
            )}
          </div>

          <div>
            <label>
              Genre
              <TextField.Root {...register('genre')} />
            </label>
          </div>

          <div>
            <label>
              Director
              <TextField.Root {...register('director')} />
            </label>
          </div>
        </Flex>
      </form>
    </Dialog>
  );
}
