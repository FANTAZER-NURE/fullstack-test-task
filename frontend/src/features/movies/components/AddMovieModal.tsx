import { useEffect } from 'react';
import { Button, Flex, TextField, Text } from '@radix-ui/themes';
import { Dialog } from '@/components/ui/Dialog';
import { useForm } from 'react-hook-form';

export type AddFormValues = {
  title: string;
  year?: string;
  runtime?: string;
  genre?: string;
  director?: string;
};

export type AddMovieModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AddFormValues) => void;
  loading?: boolean;
};

export default function AddMovieModal({
  open,
  onOpenChange,
  onSubmit,
  loading,
}: AddMovieModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddFormValues>({
    defaultValues: {
      title: '',
      year: '',
      runtime: '',
      genre: '',
      director: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    if (!open)
      reset({ title: '', year: '', runtime: '', genre: '', director: '' });
  }, [open, reset]);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add custom movie"
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
            Add
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
                    !v || /^\d{4}$/.test(v) || 'Year must be YYYY',
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
                    v === '' || v === undefined ? undefined : String(v),
                })}
              />
            </label>
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
