import { sdk } from "../axios";
import { type Transaction } from "@/interface/transaction";
import { type Customer } from "@/interface/customer";

export const FeeApi = {
  calcFee: (data: { transaction: Transaction; customer: Customer }) =>
    sdk.post("fee-service/fee/fee-calc", data),
  khaiBaoThamSo: (data: any) =>
    sdk.post("fee-service/fee/khai-bao-tham-so", data),
};

export default FeeApi;
