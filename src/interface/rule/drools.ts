export interface Condition {
  field: string;
  operator: string;
  value: string;
}

export interface ThenAction {
  object: string;
  action: string;
  value: string;
}

export interface WhenGroup {
  object: string;
  conditions: Condition[];
}

export interface DroolsRule {
  name: string;
  salience: number;
  when?: WhenGroup[];
  then: ThenAction[];
}

export default DroolsRule;
