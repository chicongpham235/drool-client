import { sdk } from "../axios";
import { type Transaction } from "@/interface/transaction";
import { type Customer } from "@/interface/customer";

export const FeeApi = {
  calcFee: (data: { transaction: Transaction; customer: Customer }) =>
    sdk.post("fee-service/fee/fee-calc", data),
};

export default FeeApi;
