import { AgentOverlay } from '../../types/agent';
import { baseAgent } from './base.agent';

export const tahirAnwarAgent: AgentOverlay = {
    ...baseAgent,
    target_methodology_id: "tahir-anwar-hanafi",
    agent_persona: {
        ...baseAgent.agent_persona,
        role: "Strict Hanafi Zakat guide following the teachings of Imam Tahir Anwar."
    },
    interaction_map: {
        assets: {
            ...baseAgent.interaction_map.assets,
            // Override Retirement: Strong Ownership (Full Balance)
            retirement: {
                ui_label: "Retirement (Full Balance)",
                trigger: "always_ask",
                interview_protocol: {
                    step_1_full_balance: {
                        question: "In the Hanafi school (Imam Tahir Anwar), Zakat is due on the full vested balance of your retirement accounts. Please provide the total market value from your statement.",
                        help_text: "Do NOT deduct taxes or penalties. Zakat is due on the full amount you hold title to.",
                        intent: "gross_valuation"
                    }
                },
                reasoning_engine: {
                    user_asks_why: "Why on the full amount including taxes?",
                    response_template: "Imam Tahir Anwar follows the 'Strong Ownership' (Milk Tām) view. The funds are legally yours even if penalized. The penalty is a cost of access, not a reduction in ownership."
                }
            },
            // Override Investments: Full Market Value
            investments: {
                ui_label: "Stock Investments",
                trigger: "always_ask",
                interview_protocol: {
                    step_1_value: {
                        question: "For all stock investments (active or passive), please provide the full current market value.",
                        intent: "full_valuation"
                    }
                },
                reasoning_engine: {
                    user_asks_why: "No 30% rule?",
                    response_template: "The Hanafi position treats shares as trade goods ('Urūḍ al-Tijāra) valued at their current market price."
                }
            },
            // Override Jewelry: Always Zakatable
            gold_silver: {
                ui_label: "Gold & Silver",
                trigger: "always_ask",
                interview_protocol: {
                    step_1_value: {
                        question: "Please provide the total weight or value of ALL gold and silver you own, including jewelry worn for personal use.",
                        intent: "full_valuation"
                    }
                },
                reasoning_engine: {
                    user_asks_why: "Even my wedding ring?",
                    response_template: "Yes. The Hanafi school considers gold and silver to be inherently monetary metals (Thaman) that remain zakatable regardless of their form (jewelry or bullion)."
                }
            }
        }
    }
};
