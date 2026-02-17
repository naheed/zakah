import { AgentOverlay } from '../../types/agent';
import { baseAgent } from './base.agent';

export const qaradawiAgent: AgentOverlay = {
    ...baseAgent,
    target_methodology_id: "qaradawi-fiqh-alzakah-v1",
    agent_persona: {
        ...baseAgent.agent_persona,
        role: "Deeply scholarly Zakat guide following Dr. Yusuf Al-Qaradawi's 'Fiqh al-Zakah'."
    },
    interaction_map: {
        assets: {
            ...baseAgent.interaction_map.assets,
            // Override Retirement: Net Accessible
            retirement: {
                ui_label: "Retirement (Net Accessible)",
                trigger: "always_ask",
                interview_protocol: {
                    step_1_net_calc: {
                        question: "For retirement accounts, Dr. Al-Qaradawi requires Zakat on the 'net accessible' amount. What is the cash value if you withdrew today after taxes and penalties?",
                        help_text: "Even if you don't intend to withdraw, he considers this wealth to be under your ownership/access.",
                        intent: "net_withdrawable_valuation"
                    }
                },
                reasoning_engine: {
                    user_asks_why: "Why not exempt?",
                    response_template: "Al-Qaradawi argues that modern retirement funds are voluntary wealth that you have access to (even with a penalty), unlike a locked pension."
                }
            },
            // Override Investments: Exploited assets / Industrial analogy
            investments: {
                ui_label: "Stock Investments",
                trigger: "always_ask",
                interview_protocol: {
                    step_1_intent: {
                        question: "For your stocks, are they for active trading or long-term investment?",
                        logic_branch: {
                            "active": "full_market_value",
                            "passive": "ask_company_type"
                        }
                    },
                    step_2_passive_type: {
                        question: "For long-term holdings, are these primarily 'Commercial' (retail/trading) or 'Industrial' (factories/production) companies?",
                        logic_branch: {
                            "commercial": "proxy_rule",
                            "industrial": "net_profit_10_percent" // Note: ZakatFlow approx with 30% proxy, but conversation handles nuance
                        }
                    }
                },
                reasoning_engine: {
                    user_asks_why: "Why the distinction?",
                    response_template: "Al-Qaradawi applies the agricultural analogy to industrial companies (Zakat on the yield/profit at 10%) and the trading analogy to commercial companies (Zakat on underlying liquid assets)."
                }
            },
            // Override Real Estate: Rental Income 10%
            real_estate: {
                ui_label: "Real Estate",
                trigger: "suggest_if",
                keywords: ["house", "property", "land", "rent"],
                interview_protocol: {
                    step_1_usage: {
                        question: "How is this property used? (Personal, Rental, or Investment/Resale)",
                        logic_branch: {
                            "personal": "exempt_msg",
                            "rental": "ask_gross_income", // Qaradawi specific: 10% of income
                            "investment": "ask_market_value"
                        }
                    },
                    step_2_rental_income: {
                        question: "For the rental property, what was the total *net* income received this year (Rent - Expenses)?",
                        intent: "rental_income_valuation"
                    }
                },
                reasoning_engine: {
                    user_asks_why: "Why 10% on income?",
                    response_template: "This is based on the agricultural analogy. Just as land is exempt but crops are taxed at 10%, the building is exempt but the rental income is taxed at 10%."
                }
            },
            // Override Jewelry: Exempt but Recommended
            gold_silver: {
                ui_label: "One caveat on Jewelry...",
                trigger: "always_ask",
                interview_protocol: {
                    step_1_value: {
                        question: "Do you own gold/silver jewelry for personal use?",
                        logic_branch: {
                            "yes": "recommend_payment",
                            "no": "next_category"
                        }
                    },
                    step_2_recommendation: {
                        question: "Al-Qaradawi holds that personal jewelry is technically exempt, but *strongly recommends* paying Zakat on it as a precaution (Ahwat). Would you like to include it in the calculation to be safe?",
                        logic_branch: {
                            "yes": "ask_value",
                            "no": "exclude_value"
                        }
                    }
                }
            }
        }
    }
};
