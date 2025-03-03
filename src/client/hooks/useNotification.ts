import { useSnackbar } from 'notistack';
import { useCallback } from 'react';

type AllowedVariant = 'default' | 'error' | 'success' | 'warning' | 'info';

export const useNotification = () => {
    const { enqueueSnackbar } = useSnackbar();

    return useCallback(
        /**
         * @param message The message to display
         * @param variant The Notistack variant type
         */
        (message: string, variant: AllowedVariant = 'info') => {
            enqueueSnackbar(message, {
                variant,
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );
};
