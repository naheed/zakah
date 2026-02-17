import { AgentOverlay } from '../../types/agent';

export const baseAgent: AgentOverlay = {
    target_schema_version: "1.0",
    target_methodology_id: "base",
    agent_persona: {
        role: "You are a precise Zakat calculation agent. Your primary goal is to use the `calculate_zakat` tool to provide accurate results. If a user provides gold/silver in grams, you can call `calculate_zakat` using `gold_grams` directly, OR first call `get_market_prices` to show them the valuation. Always prioritize calling `calculate_zakat` even with partial data to show the Nisab status. AFTER providing the calculation, ALWAYS offer to generate a full report using `create_report_link`.",
        tone: "direct",
        language_style: "simple_english"
    },
    interaction_map: {
        assets: {
            cash: {
                ui_label: "Cash & Sensitivity",
                trigger: "always_ask",
                interview_protocol: {
                    step_1_value: {
                        question: "Let's start with the basics. What is the total value of cash you have on hand, in bank accounts, or digital wallets today?",
                        help_text: "Include checking, savings, Venmo, PayPal, and any foreign currency."
                    }
                }
            },
            gold_silver: {
                ui_label: "Gold & Silver",
                trigger: "always_ask",
                interview_protocol: {
                    step_1_type: {
                        question: "Do you own any gold or silver? This could be investment bars, coins, or jewelry.",
                        logic_branch: {
                            "yes": "step_2_breakdown",
                            "no": "next_category"
                        }
                    },
                    step_2_breakdown: {
                        question: "Is this held as investment bullion (bars/coins) or as jewelry?",
                        logic_branch: {
                            "investment": "ask_value",
                            "jewelry": "check_usage_rules" // Overridden by specific madhabs
                        }
                    }
                }
            },
            business: {
                ui_label: "Business Assets",
                trigger: "suggest_if",
                keywords: ["business", "company", "llc", "inventory", "shop"],
                interview_protocol: {
                    step_1_valuation: {
                        question: "For your business, we need to calculate the 'Zakat Base'. This is strictly: (Cash + Receivables + Inventory) - (Current Payables). Do NOT include equipment or furniture.",
                        help_text: "Fixed assets like computers, desks, and machinery are exempt. Only liquid assets and goods for sale are zakatable."
                    }
                }
            },
            real_estate: {
                ui_label: "Real Estate",
                trigger: "suggest_if",
                keywords: ["house", "property", "land", "rent", "airbnb"],
                interview_protocol: {
                    step_1_usage: {
                        question: "How is this property used? Is it your personal home, a rental property, or land held for investment?",
                        logic_branch: {
                            "personal": "exempt_msg",
                            "rental": "ask_net_income",
                            "investment": "ask_market_value"
                        }
                    }
                }
            },
            loans: {
                ui_label: "Money Owed to You",
                trigger: "suggest_if",
                keywords: ["loaned", "lent", "owed", "debt"],
                interview_protocol: {
                    step_1_expectancy: {
                        question: "Do you expect this money to be repaid (good debt) or is it unlikely (bad debt)?",
                        logic_branch: {
                            "good": "include_value",
                            "bad": "exclude_value"
                        }
                    }
                }
            }
        }
    }
};
