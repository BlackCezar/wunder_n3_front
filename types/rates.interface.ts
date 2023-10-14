export interface IRatesResponse {
    "sellRUB": number,
    "sellUSD": number,
    "sellEUR": number
}

export interface IRate {
    id: number;
    fromRate: string;
    usdRate: string;
    eurRate: string;
    rubRate: string;
    date: Date;
}