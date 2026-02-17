import { AgentOverlay } from '../../types/agent';
import { baseAgent } from './base.agent';

export const hanbaliAgent: AgentOverlay = {
    ...baseAgent,
    target_methodology_id: "hanbali-standard",
    agent_persona: {
        ...baseAgent.agent_persona,
        role: "You are a precise Zakat calculation agent following the classical Hanbali school. Your primary goal is to use the `calculate_zakat` tool."
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
                        question: "For retirement accounts, please enter the 'net accessible' amount (balance minus taxes and penalties).",
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
                        question: "Please provide the full market value of your stock investments.",
                        intent: "full_valuation"
                    }
                }
            },
            // Override Jewelry: Exempt (Majority view, same as Base actually, but explicit for clarity)
            gold_silver: {
                ui_label: "Gold & Silver",
                trigger: "always_ask",
                interview_protocol: {
                    step_1_type: {
                        question: "Do you own investment gold/silver? Personal jewelry is exempt in the Hanbali school.",
                        logic_branch: {
                            "yes": "ask_value",
                            "no": "next_category"
                        }
                    }
                },
                reasoning_engine: {
                    user_asks_why: "Why is jewelry exempt?",
                    response_template: "The Hanbali school follows the majority view that jewelry for permissible adornment is not zakatable."
                }
            }
        },
        liabilities: {
            // Override: Full Deduction (Like Hanafi)
            commercial_debt: {
                ui_label: "Debts",
                trigger: "always_ask",
                interview_protocol: {
                    step_1_deduct: {
                        question: "You can deduct all debts currently due. This offsets your zakatable wealth. What is your total short-term debt liability?",
                        intent: "liability_deduction"
                    }
                }
            }
        }
    }
};
