/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */


import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDocumentParser } from '@/hooks/useDocumentParser';
import { ZakatFormData } from '@/lib/zakatTypes';
import { UploadSimple, FilePdf, Spinner, CheckCircle, XCircle } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface BatchUploadDropzoneProps {
    onUploadComplete: (data: Partial<ZakatFormData>) => void;
}

export function BatchUploadDropzone({ onUploadComplete }: BatchUploadDropzoneProps) {
    const { parseDocuments, isUploading, progress } = useDocumentParser();
    const [files, setFiles] = useState<File[]>([]);
    const [isSuccess, setIsSuccess] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Append new files
        setFiles(prev => [...prev, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
        },
        disabled: isUploading || isSuccess
    });

    const handleUpload = async () => {
        if (files.length === 0) return;

        try {
            const result = await parseDocuments(files);
            if (result) {
                setIsSuccess(true);
                toast.success("Documents processed successfully!");
                // Wait a moment for user to see success
                setTimeout(() => {
                    onUploadComplete(result);
                }, 1500);
            }
        } catch (e) {
            console.error(e);
            toast.error("Upload failed");
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            {/* Dropzone Area */}
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
                    isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                    (isUploading || isSuccess) && "pointer-events-none opacity-50"
                )}
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        {isSuccess ? (
                            <CheckCircle className="w-8 h-8 text-green-500" weight="fill" />
                        ) : isUploading ? (
                            <Spinner className="w-8 h-8 text-primary animate-spin" />
                        ) : (
                            <UploadSimple className="w-8 h-8 text-muted-foreground" />
                        )}
                    </div>

                    <div className="space-y-1">
                        <h3 className="font-semibold text-lg">
                            {isUploading ? "Processing..." : isSuccess ? "Success!" : "Upload Statements"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {isUploading ? "AI is analyzing your documents" : "Drag & drop PDF or Image files here"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            {isUploading && (
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Analyzing...</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
            )}

            {/* File List */}
            {files.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground">Files ({files.length})</h4>
                    <div className="space-y-2">
                        {files.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-card border rounded-lg shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-muted rounded-md">
                                        <FilePdf className="w-5 h-5 text-primary" weight="duotone" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
                                    </div>
                                </div>
                                {!isUploading && !isSuccess && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                                        className="text-muted-foreground hover:text-destructive p-1"
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-end pt-4">
                <Button
                    onClick={handleUpload}
                    disabled={files.length === 0 || isUploading || isSuccess}
                    className="w-full sm:w-auto"
                >
                    {isUploading ? "Processing..." : `Process ${files.length} Document${files.length !== 1 ? 's' : ''}`}
                </Button>
            </div>

        </div>
    );
}
