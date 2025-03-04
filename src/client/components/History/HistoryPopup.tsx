import { useSelector } from 'react-redux';
import { getHistoryMessages } from '../../selectors';
import { useEffect } from 'react';
import { useNotification } from '../../hooks';

export const HistoryPopup = () => {
    const history = useSelector(getHistoryMessages);
    const notify = useNotification();
    useEffect(() => {
        if (history.length > 0) {
            notify(history[history.length - 1]);
        }
    }, [history, notify]);
};
