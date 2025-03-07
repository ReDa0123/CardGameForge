export type TurnOrder = {
    activePlayer: string | 'EVERYBODY';
    nextPlayer: string;
    playOrder: string[];
    activePlayerIndex: number;
};

export type Teams = { [teamId: string]: string[] };

export type EndGameResult = {
    winner?: string;
    isTie: boolean;
    reason?: string;
};
