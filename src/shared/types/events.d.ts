export type JoinRoomArgs = {
    roomId: string;
    nickname: string;
};

export type GameStartArgs<CustomGameOptions> = {
    gameOptions?: CustomGameOptions;
};

export type PlayMoveArgs = {
    moveName: string;
    payload: unknown;
};
