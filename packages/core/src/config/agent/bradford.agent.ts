import { AgentOverlay } from '../../types/agent';
import { baseAgent } from './base.agent';

export const bradfordAgent: AgentOverlay = {
    ...baseAgent,
    target_methodology_id: "bradford",
    agent_persona: {
        ...baseAgent.agent_persona,
        role: "Knowledgeable Zakat guide following Sheikh Joe Bradford's methodology."
    },
    interaction_map: {
        assets: {
            ...baseAgent.interaction_map.assets,
            // Override Retirement for Age Check
            retirement: {
                ui_label: "Retirement (401k, IRA)",
                trigger: "always_ask",
                interview_protocol: {
                    step_1_eligibility: {
                        question: "For your retirement accounts (401k, Traditional IRA), are you currently over the age of 59 ½?",
                        intent: "determine_penalty_status",
                        help_text: "We need to know if you can access these funds without penalty.",
                        logic_branch: {
                            "yes": "proceed_to_valuation",
                            "no": "apply_exemption_logic"
                        }
                    },
                    step_2_valuation: {
                        question: "Great. Please provide the total market value of your portfolio. The calculator will automatically exclude the non-zakatable portion (taxes/penalties) for you.",
                        help_text: "Do not deduct taxes yourself. Give the gross balance from your statement."
                    }
                },
                reasoning_engine: {
                    user_asks_why: "Why isn't the full amount zakatable?",
                    response_template: "Sheikh Joe Bradford considers this 'Māl ḍimār' (inaccessible wealth). Since you cannot access it without penalty, you only owe Zakat on the portion that is effectively liquid/owned today."
                }
            },
            // Override Investments for Active/Passive split
            investments: {
                ui_label: "Stock Investments",
                trigger: "always_ask",
                interview_protocol: {
                    step_1_intent: {
                        question: "For your stock investments, are you an active day trader or a long-term investor?",
                        logic_branch: {
                            "active": "full_market_value",
                            "passive": "proxy_rule"
                        }
                    }
                },
                reasoning_engine: {
                    user_asks_why: "Why 30% for passive?",
                    response_template: "For long-term buy-and-hold investors, Zakat is due on the underlying liquid assets of the company, approximated at 30% of the market cap."
                }
            },
            // Override Crypto (Standard Base didn't have it, so we add it)
            cryptocurrency: {
                ui_label: "Cryptocurrency",
                trigger: "suggest_if",
                keywords: ["bitcoin", "eth", "crypto", "staking", "coinbase", "wallet", "tokens"],
                guardrails: [
                    {
                        condition: "user_asks_about_haram_coins",
                        action: "warn",
                        message: "Zakat is only due on halal assets. If you believe a specific token is impermissible to own, it should be excluded entirely."
                    }
                ],
                reasoning_engine: {
                    user_asks_why: "Why is my crypto zakatable?",
                    response_template: "Crypto is treated as wealth (Mal) with store of value, similar to gold/silver. 2.5% is due on the full market value."
                }
            }
        }
    }
};
