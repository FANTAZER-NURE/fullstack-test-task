import * as RToast from '@radix-ui/react-toast';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { hideToast } from '@/redux/slices/uiSlice';
import styles from './Toaster.module.scss';

export default function Toaster() {
  const toasts = useAppSelector((s) => s.ui.toasts);
  const dispatch = useAppDispatch();

  return (
    <RToast.Provider swipeDirection="right">
      {toasts.map((t) => (
        <RToast.Root
          key={t.id}
          duration={4000}
          className={styles.toast}
          data-variant={t.variant ?? 'info'}
          onOpenChange={(open) => {
            if (!open) dispatch(hideToast(t.id));
          }}
        >
          {t.title && (
            <RToast.Title className={styles.title}>{t.title}</RToast.Title>
          )}
          {t.description && (
            <RToast.Description className={styles.desc}>
              {t.description}
            </RToast.Description>
          )}
        </RToast.Root>
      ))}
      <RToast.Viewport className={styles.viewport} />
    </RToast.Provider>
  );
}
