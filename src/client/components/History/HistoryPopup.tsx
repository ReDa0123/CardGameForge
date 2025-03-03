import { useSelector } from 'react-redux';
import { getHistoryMessages } from '../../selectors/history';
import { useEffect } from 'react';
import { useNotification } from '../../hooks/useNotification';

export const HistoryPopup = () => {
    const history = useSelector(getHistoryMessages);
    const notify = useNotification();
    useEffect(() => {
        if (history.length > 0) {
            notify(history[history.length - 1]);
        }
    }, [history, notify]);
};
