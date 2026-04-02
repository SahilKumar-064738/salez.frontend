/**
 * src/services/automation.ts — COMPLETE
 *
 * Connects to the automation_rules CRUD API backed by the automation controller.
 * Replaces the stub in the original public zip.
 */

import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/apiClient';

export type TriggerType =
  | 'inbound_message'
  | 'call_ended'
  | 'contact_stage_changed'
  | 'schedule';

export type ActionType =
  | 'send_whatsapp'
  | 'send_whatsapp_text'
  | 'update_contact_stage'
  | 'create_scheduled_call'
  | 'add_tag'
  | 'notify_webhook';

export interface AutomationAction {
  type:           ActionType;
  template_id?:  number;
  content?:      string;
  delay_minutes?: number;
  stage?:        string;
  tag?:          string;
  url?:          string;
  message?:      string;
}

export interface AutomationRule {
  id:           number;
  name:         string;
  trigger_type: TriggerType;
  conditions:   Record<string, unknown>;
  actions:      AutomationAction[];
  is_active:    boolean;
  created_at:   string;
  updated_at:   string;
}

export interface CreateRulePayload {
  name:         string;
  trigger_type: TriggerType;
  conditions?:  Record<string, unknown>;
  actions:      AutomationAction[];
  is_active?:   boolean;
}

interface ListResponse { data: AutomationRule[]; }
interface SingleResponse { data: AutomationRule; }

export const automationService = {
  list():                                       Promise<AutomationRule[]> {
    return apiGet<ListResponse>('/automation').then((r) => r.data);
  },
  getById(id: number):                          Promise<AutomationRule> {
    return apiGet<SingleResponse>(`/automation/${id}`).then((r) => r.data);
  },
  create(payload: CreateRulePayload):           Promise<AutomationRule> {
    return apiPost<SingleResponse>('/automation', payload).then((r) => r.data);
  },
  update(id: number, payload: Partial<CreateRulePayload>): Promise<AutomationRule> {
    return apiPatch<SingleResponse>(`/automation/${id}`, payload).then((r) => r.data);
  },
  delete(id: number):                           Promise<void> {
    return apiDelete(`/automation/${id}`);
  },
  toggle(id: number):                           Promise<AutomationRule> {
    return apiPost<SingleResponse>(`/automation/${id}/toggle`).then((r) => r.data);
  },
};