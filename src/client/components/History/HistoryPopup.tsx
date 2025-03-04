import { useSelector } from 'react-redux';
import { getHistoryMessages } from '../../selectors';
import { useEffect } from 'react';
import { useNotification } from '../../hooks';

/**
 * HistoryPopup component that displays the last message from the history.
 * It uses the useNotification hook to display the message.
 */
export const HistoryPopup = () => {
    const history = useSelector(getHistoryMessages);
    const notify = useNotification();
    useEffect(() => {
        if (history.length > 0) {
            notify(history[history.length - 1]);
        }
    }, [history, notify]);
};
