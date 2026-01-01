
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Normalized data: Values are % of the asset's specific gross value
// This prevents small assets (Jewelry $8k) from disappearing against large ones (401k $320k)
const data = [
    {
        subject: 'Cash',
        gross: 57000,
        A: 100, valA: 57000, // Conservative
        B: 100, valB: 57000, // Optimized
        C: 100, valC: 57000  // Bradford
    },
    {
        subject: '401(k)',
        gross: 320000,
        A: 100, valA: 320000,
        B: 58, valB: 185600, // ~58% (After tax/penalty)
        C: 0, valC: 0       // Exempt
    },
    {
        subject: 'Roth IRA',
        gross: 60000,
        A: 100, valA: 60000,
        B: 100, valB: 60000,
        C: 100, valC: 60000
    },
    {
        subject: 'Stocks',
        gross: 150000,
        A: 100, valA: 150000,
        B: 30, valB: 45000, // 30% Rule
        C: 30, valC: 45000  // 30% Rule
    },
    {
        subject: 'Jewelry',
        gross: 8000,
        A: 100, valA: 8000,
        B: 100, valB: 8000,
        C: 100, valC: 8000
    },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        // Find the original data item to get the gross value
        const item = data.find(d => d.subject === label);
        return (
            <div className="bg-popover border border-border p-3 rounded-lg shadow-lg text-sm z-50">
                <p className="font-semibold mb-1">{label}</p>
                <p className="text-xs text-muted-foreground mb-2">Total Value: ${item?.gross.toLocaleString()}</p>
                <div className="space-y-1">
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="font-medium text-muted-foreground">{entry.name}:</span>
                            </div>
                            <div className="text-right">
                                <span className="font-mono font-semibold">${entry.payload[`val${entry.dataKey}`].toLocaleString()}</span>
                                <span className="text-xs text-muted-foreground ml-1">({entry.value}%)</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

export function ZakatModeComparisonChart() {
    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                    Asset Zakatable Percentage by Mode
                </CardTitle>
                <CardDescription>
                    Showing what % of each asset's value is considered zakatable.
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] w-full min-w-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="hsl(var(--muted-foreground))" strokeOpacity={0.15} />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: 'hsl(var(--foreground))', fontSize: 13, fontWeight: 500 }}
                        />
                        <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            tick={false}
                            axisLine={false}
                        />

                        <Radar
                            name="Conservative"
                            dataKey="A"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            fill="hsl(var(--primary))"
                            fillOpacity={0.1}
                        />
                        <Radar
                            name="Optimized"
                            dataKey="B"
                            stroke="#F59E0B" // Amber-500 for distinct "middle ground"
                            strokeWidth={2}
                            fill="#F59E0B"
                            fillOpacity={0.1}
                        />
                        <Radar
                            name="Bradford"
                            dataKey="C"
                            stroke="hsl(var(--destructive))"
                            strokeWidth={2}
                            fill="hsl(var(--destructive))"
                            fillOpacity={0.1}
                        />
                        <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
                        <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
