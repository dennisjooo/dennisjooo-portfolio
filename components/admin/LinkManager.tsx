import { useState } from 'react';
import { LinkIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { formStyles } from './shared/formStyles';

interface LinkManagerProps {
  links: Array<{ text: string; url: string }>;
  onAdd: (link: { text: string; url: string }) => void;
  onRemove: (index: number) => void;
}

export function LinkManager({ links, onAdd, onRemove }: LinkManagerProps) {
  const [linkInput, setLinkInput] = useState({ text: '', url: '' });

  const addLink = () => {
    if (linkInput.text && linkInput.url) {
      onAdd(linkInput);
      setLinkInput({ text: '', url: '' });
    }
  };

  return (
    <div>
      <label className={formStyles.label}>Related Links</label>
      <div className="space-y-3 p-4 rounded-lg bg-muted/30 border border-border/50">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Label (e.g. GitHub)"
            value={linkInput.text}
            onChange={e => setLinkInput(prev => ({ ...prev, text: e.target.value }))}
            className={`${formStyles.input} py-2 text-sm`}
          />
          <input
            type="text"
            placeholder="https://..."
            value={linkInput.url}
            onChange={e => setLinkInput(prev => ({ ...prev, url: e.target.value }))}
            className={`${formStyles.input} py-2 text-sm`}
          />
          <button
            type="button"
            onClick={addLink}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <LinkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {links.map((link, index) => (
            <div key={index} className="flex items-center gap-3 p-2 bg-background rounded-md border border-border/50 group">
              <span className="font-medium text-sm">{link.text}</span>
              <span className="text-xs text-muted-foreground truncate flex-1 font-mono">{link.url}</span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
          {links.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-2">No links added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
