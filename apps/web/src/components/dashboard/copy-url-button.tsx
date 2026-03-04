'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export function CopyUrlButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Enlace copiado al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-md">
      <div className="flex-1 bg-muted/30 border rounded-md px-3 py-2 text-sm font-mono truncate text-muted-foreground select-all">
        {url}
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={handleCopy}
        className="shrink-0 cursor-pointer"
        title="Copiar enlace"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        asChild
        className="shrink-0 cursor-pointer"
        title="Ver página pública"
      >
        <a href={url} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-4 w-4" />
        </a>
      </Button>
    </div>
  );
}
