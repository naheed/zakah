import { AgentOverlay } from '../../types/agent';
import { baseAgent } from './base.agent';

export const amjaAgent: AgentOverlay = {
    ...baseAgent,
    target_methodology_id: "amja-standard",
    agent_persona: {
        ...baseAgent.agent_persona,
        role: "Zakat guide following the AMJA (Assembly of Muslim Jurists of America) collective fatwas."
    },
    interaction_map: {
        assets: {
            ...baseAgent.interaction_map.assets,
            // Override Retirement: Net Withdrawable concept
            retirement: {
                ui_label: "Retirement (Net Withdrawable)",
                trigger: "always_ask",
                interview_protocol: {
                    step_1_net_calc: {
                        question: "For your retirement accounts (401k/IRA), AMJA requires Zakat on the 'net withdrawable amount'. Please check your statement: What would be the cash value if you withdrew everything today, *after* deducting taxes and penalties?",
                        help_text: "Formula: Gross Balance - Early Withdrawal Penalty (10%) - Estimated Taxes = Zakatable Amount.",
                        intent: "net_withdrawable_valuation"
                    }
                },
                reasoning_engine: {
                    user_asks_why: "Why deduct taxes and penalties?",
                    response_template: "AMJA views Zakat as being due on what you actually *own* and can access. Penalties and taxes are debts/encumbrances that reduce your effective ownership."
                }
            },
            // Override Investments: Exploited assets view
            investments: {
                ui_label: "Stock Investments",
                trigger: "always_ask",
                interview_protocol: {
                    step_1_intent: {
                        question: "For your stocks, are they for short-term trading or long-term investment?",
                        logic_branch: {
                            "active": "full_market_value",
                            "passive": "dividends_only"
                        }
                    },
                    step_2_passive: {
                        question: "For your long-term investments, AMJA treats them as 'exploited assets'. Please provide the total value of DIVIDENDS and earnings received this year, not the total share price.",
                        intent: "dividend_valuation"
                    }
                },
                reasoning_engine: {
                    user_asks_why: "Why only dividends?",
                    response_template: "AMJA analogizes long-term stocks to rental property (Mustaghallāt). The capital (share) is the 'building' (exempt), and the dividend is the 'rent' (zakatable)."
                }
            },
            // Override Jewelry: Exempt
            gold_silver: {
                ui_label: "Gold & Silver",
                trigger: "always_ask",
                interview_protocol: {
                    step_1_type: {
                        question: "Do you own any investment gold/silver (bars/coins) or jewelry?",
                        logic_branch: {
                            "investment": "ask_value",
                            "jewelry": "exempt_check"
                        }
                    },
                    step_2_jewelry_exempt: {
                        question: "Is this jewelry for personal use/adornment, or held as a store of value?",
                        logic_branch: {
                            "personal": "exempt_msg",
                            "store_of_value": "ask_value"
                        }
                    }
                },
                reasoning_engine: {
                    user_asks_why: "Why is my jewelry exempt?",
                    response_template: "AMJA follows the majority scholarly view that jewelry for lawful personal use is not subject to Zakat, as it is considered personal property (like clothing)."
                }
            }
        }
    }
};
