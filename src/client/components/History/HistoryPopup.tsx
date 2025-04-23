import { useSelector } from 'react-redux';
import { getHistoryMessages } from '../../selectors';
import { useEffect, useRef } from 'react';
import { useNotification } from '../../hooks';

/**
 * HistoryPopup component that displays the last message from the history.
 * It uses the useNotification hook to display the message.
 */
export const HistoryPopup = () => {
    const lastHistoryArr = useRef<string[]>([]);
    const history = useSelector(getHistoryMessages);
    const notify = useNotification();
    useEffect(() => {
        const newHistoryLength = history.length;
        const oldHistoryLength = lastHistoryArr.current.length;
        if (newHistoryLength > oldHistoryLength) {
            const messagesToDisplay = history.slice(oldHistoryLength, newHistoryLength).reverse();
            messagesToDisplay.forEach((message) => {
                notify(message);
            });
            lastHistoryArr.current = history;
        }
    }, [history, notify]);
};
