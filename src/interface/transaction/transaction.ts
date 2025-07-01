export interface Transaction {
  amount: number;
  type: string;
  channel: string;
  fee?: number;
}

export default Transaction;
