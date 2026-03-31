/**
 * src/services/automation.ts — STUBBED
 * /automation endpoint does NOT exist in the backend API contract.
 * AutomationPage is demo-only. This file is kept for import compatibility.
 */

export interface AutomationRule {
  id: number;
  name: string;
  enabled: boolean;
  triggerType?: string;
  triggerValue?: string | null;
  conditionType?: string | null;
  conditionValue?: string | null;
  actionType?: string;
  actionValue?: string | null;
}

export const automationService = {
  async list(): Promise<AutomationRule[]> { return []; },
  async create(_data: Partial<AutomationRule>): Promise<AutomationRule> { throw new Error("Automation API not available"); },
  async update(_id: number, _data: Partial<AutomationRule>): Promise<AutomationRule> { throw new Error("Automation API not available"); },
  async delete(_id: number): Promise<void> { throw new Error("Automation API not available"); },
};
