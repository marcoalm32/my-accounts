export interface LatestTransactions {
    name: string;
    value: number;
    date: Date;
    type?: 'account' | 'income';
}