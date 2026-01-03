import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Flask, FileCode, Database, Bug } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

/**
 * DevTools - Consolidated testing entry point
 * Only accessible to authenticated users in development
 */
export default function DevTools() {
    const { user } = useAuth();

    // Gate: Only allow authenticated users
    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    const tools = [
        {
            title: "Sankey Chart Test",
            description: "Test 10-category Sankey with mode toggle",
            icon: <Database className="h-6 w-6" weight="duotone" />,
            path: "/sankey-test",
            color: "text-emerald-500",
        },
        {
            title: "Extraction Test",
            description: "Test AI document extraction with V2 line-item parsing",
            icon: <FileCode className="h-6 w-6" weight="duotone" />,
            path: "/extraction-test",
            color: "text-blue-500",
        },
        {
            title: "Adapter Test",
            description: "Debug V2 → Legacy form adapter mapping",
            icon: <Database className="h-6 w-6" weight="duotone" />,
            path: "/debug-adapter",
            color: "text-purple-500",
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>DevTools | ZakatFlow</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* Header */}
            <div className="sticky top-0 z-10 bg-card border-b border-border">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-3">
                        <Link to="/">
                            <Button variant="ghost" size="icon" className="-ml-2">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div className="flex items-center gap-2">
                            <Flask className="h-5 w-5 text-amber-500" weight="duotone" />
                            <h1 className="text-lg font-semibold text-foreground">Developer Tools</h1>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Warning Banner */}
                <div className="mb-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                        <Bug className="h-5 w-5" weight="duotone" />
                        <p className="text-sm font-medium">
                            Internal testing tools. These pages are not visible to regular users.
                        </p>
                    </div>
                </div>

                {/* Tool Cards */}
                <div className="grid gap-4 md:grid-cols-2">
                    {tools.map((tool) => (
                        <Link key={tool.path} to={tool.path}>
                            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                                <CardHeader>
                                    <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-2 ${tool.color} group-hover:scale-110 transition-transform`}>
                                        {tool.icon}
                                    </div>
                                    <CardTitle>{tool.title}</CardTitle>
                                    <CardDescription>{tool.description}</CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Quick Info */}
                <div className="mt-8 text-sm text-muted-foreground">
                    <p>Logged in as: <span className="font-mono text-foreground">{user.email}</span></p>
                </div>
            </main>
        </div>
    );
}
