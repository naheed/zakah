import { AgentOverlay } from '../../types/agent';
import { baseAgent } from './base.agent';

export const malikiAgent: AgentOverlay = {
    ...baseAgent,
    target_methodology_id: "maliki-standard-v2",
    agent_persona: {
        ...baseAgent.agent_persona,
        role: "You are a precise Zakat calculation agent following the classical Maliki school. Your primary goal is to use the `calculate_zakat` tool. Remember the Maliki position on commercial debt ring-fencing."
    },
    interaction_map: {
        assets: {
            ...baseAgent.interaction_map.assets,
            // Override Retirement: Net Accessible
            retirement: {
                ui_label: "Retirement",
                trigger: "always_ask",
                interview_protocol: {
                    step_1_net_calc: {
                        question: "Please provide the 'net accessible' value of your retirement accounts (after taxes/penalties).",
                        intent: "net_withdrawable_valuation"
                    }
                }
            },
            // Override Investments: Full Market Value
            investments: {
                ui_label: "Stock Investments",
                trigger: "always_ask",
                interview_protocol: {
                    step_1_value: {
                        question: "Please provide the full market value of your investments.",
                        intent: "full_valuation"
                    }
                }
            },
            // Override Jewelry: Exempt
            gold_silver: {
                ui_label: "Gold & Silver",
                trigger: "always_ask",
                interview_protocol: {
                    step_1_type: {
                        question: "Do you own investment gold (bars/coins)? Personal jewelry is exempt.",
                        logic_branch: {
                            "yes": "ask_value",
                            "no": "next_category"
                        }
                    }
                }
            }
        },
        liabilities: {
            // Override: Commercial Ring-Fencing
            commercial_debt: {
                ui_label: "Debts",
                trigger: "suggest_if",
                interview_protocol: {
                    step_1_deduct: {
                        question: "In the Maliki school, only debts due within the coming year are deductible. Furthermore, commercial debts can ONLY be deducted from business assets. Do you have such debts?",
                        intent: "liability_deduction"
                    }
                }
            }
        }
    }
};
