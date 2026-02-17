/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

export type TriggerLogic = 'always_ask' | 'suggest_if' | 'never_ask';

export interface Guardrail {
    condition: string;
    action: 'warn' | 'block' | 'clarify';
    message: string;
}

export interface InterviewStep {
    question: string;
    intent?: string;
    help_text?: string;
    logic_branch?: Record<string, string>; // Maps answer (e.g. "yes") to next step ID
}

export interface InterviewProtocol {
    [step_id: string]: InterviewStep;
}

export interface ReasoningEngine {
    user_asks_why?: string;
    response_template?: string;
}

export interface AgentAssetInteraction {
    ui_label: string;
    trigger: TriggerLogic;
    keywords?: string[]; // For 'suggest_if'
    interview_protocol?: InterviewProtocol;
    reasoning_engine?: ReasoningEngine;
    guardrails?: Guardrail[];
}

export interface AgentPersona {
    role: string;
    tone: 'empathetic' | 'academic' | 'direct';
    language_style: 'simple_english' | 'fiqh_terminology';
}

export interface AgentOverlay {
    target_schema_version: string;
    target_methodology_id: string; // Links to base config ID
    agent_persona: AgentPersona;
    interaction_map: {
        assets: Record<string, AgentAssetInteraction>;
        liabilities?: Record<string, AgentAssetInteraction>;
    };
}
