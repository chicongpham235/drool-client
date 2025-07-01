import { DroolsRule } from "@/interface/rule";
import { sdk } from "../axios";

export const RuleManagementApi = {
  create: (data: DroolsRule[]) => sdk.post("rule-management", data),
};

export default RuleManagementApi;
