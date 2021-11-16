type TMessageDirection = 'incoming' | 'outgoing';

export interface IWithMessageDirection {
    messageDirection: TMessageDirection;
}