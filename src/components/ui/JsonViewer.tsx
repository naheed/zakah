
import { Highlight, themes } from "prism-react-renderer"
import { Copy as CopyIcon, Check as CheckIcon, FileText as FileIcon } from "@phosphor-icons/react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface JsonViewerProps {
    data: unknown
    title?: string
    className?: string
    initialExpanded?: boolean
}

export function JsonViewer({ data, title = "JSON Data", className }: JsonViewerProps) {
    const [copied, setCopied] = useState(false)
    const jsonString = JSON.stringify(data, null, 2)

    const handleCopy = () => {
        navigator.clipboard.writeText(jsonString)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden", className)}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <FileIcon className="w-4 h-4" />
                    <span>{title}</span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleCopy}
                >
                    {copied ? (
                        <CheckIcon className="w-4 h-4 text-green-500" />
                    ) : (
                        <CopyIcon className="w-4 h-4" />
                    )}
                    <span className="sr-only">Copy JSON</span>
                </Button>
            </div>

            {/* Code Block */}
            <div className="bg-[#011627] overflow-x-auto text-xs sm:text-sm">
                <Highlight
                    theme={themes.nightOwl}
                    code={jsonString}
                    language="json"
                >
                    {({ style, tokens, getLineProps, getTokenProps }: any) => (
                        <pre style={{ ...style, margin: 0, padding: '1rem', fontFamily: 'monospace' }}>
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {tokens.map((line: any, i: number) => (
                                <div key={i} {...getLineProps({ line })}>
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {line.map((token: any, key: number) => (
                                        <span key={key} {...getTokenProps({ token })} />
                                    ))}
                                </div>
                            ))}
                        </pre>
                    )}
                </Highlight>
            </div>
        </div>
    )
}
