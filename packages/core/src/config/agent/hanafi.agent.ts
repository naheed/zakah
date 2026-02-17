import { AgentOverlay } from '../../types/agent';
import { baseAgent } from './base.agent';

export const hanafiAgent: AgentOverlay = {
    ...baseAgent,
    target_methodology_id: "hanafi-standard",
    agent_persona: {
        ...baseAgent.agent_persona,
        role: "You are a precise Zakat calculation agent following the classical Hanafi school. Your primary goal is to collect assets and call the `calculate_zakat` tool. In the Hanafi school, all gold and silver (including jewelry) is zakatable wealth."
    },
    interaction_map: {
        assets: {
            ...baseAgent.interaction_map.assets,
            // Override Retirement: Net Accessible (Standard Hanafi, distinct from Tahir Anwar's Full Balance)
            retirement: {
                ui_label: "Retirement",
                trigger: "always_ask",
                interview_protocol: {
                    step_1_net_calc: {
                        question: "For your retirement accounts (401k, IRA), what is the 'net accessible' value? This means the amount you would receive if you withdrew today, AFTER taxes and penalties.",
                        intent: "net_withdrawable_valuation"
                    }
                }
            },
            // Override Jewelry: ALWAYS Zakatable
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
                    user_asks_why: "Even my personal jewelry?",
                    response_template: "Yes, the Hanafi school considers all gold and silver to be zakatable wealth (Thaman), regardless of whether it is worn or stored."
                }
            },
            // Override Investments: Full Market Value (Trade Goods)
            investments: {
                ui_label: "Stock Investments",
                trigger: "always_ask",
                interview_protocol: {
                    step_1_value: {
                        question: "For all your stock investments, please provide the full current market value.",
                        intent: "full_valuation"
                    }
                },
                reasoning_engine: {
                    user_asks_why: "No reduction for passive?",
                    response_template: "In the Hanafi school, shares are treated as trade goods ('Urūḍ al-Tijāra) and are valued at their full market price."
                }
            }
        },
        liabilities: {
            commercial_debt: {
                ui_label: "Debts",
                trigger: "always_ask",
                interview_protocol: {
                    step_1_deduct: {
                        question: "You can deduct all debts owed to others that are currently due/demandable. This includes credit cards, unpaid bills, and the upcoming 12 months of long-term loans. What is the total deductible debt?",
                        intent: "liability_deduction"
                    }
                }
            }
        }
    }
};
