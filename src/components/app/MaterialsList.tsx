'use client';

import { useState } from 'react';
import { BookMarked, Download, ExternalLink, FileText, Presentation, PlayCircle } from 'lucide-react';
import { getResourceDownload } from '@/data/learning/learningService';
import type { StudyResource } from '@/data/learning/types';
import { fmt, useTranslation } from '@/localization/useTranslation';
import { Spinner } from '@/components/ui/States';
import { useToast } from '@/components/ui/Toast';

const KIND_ICON = { slides: Presentation, video: PlayCircle, textbook: BookMarked, notes: FileText };

const FILE_TYPE: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/vnd.ms-powerpoint': 'PowerPoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint',
  'application/msword': 'Word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
};

const formatBytes = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1000))} KB`;

/**
 * Lecture slides, videos, textbooks and notes. Uploaded files open through a
 * 15-minute signed link from the server; YouTube and links open in a new tab.
 */
export function MaterialsList({
  resources,
  topicTitles,
}: {
  resources: StudyResource[];
  topicTitles?: Map<string, string>;
}) {
  const { t } = useTranslation();
  const toast = useToast();
  const [opening, setOpening] = useState<string | null>(null);

  const open = async (resource: StudyResource) => {
    if (resource.source !== 'file') {
      const url = resource.link ?? (resource.youTubeId ? `https://www.youtube.com/watch?v=${resource.youTubeId}` : null);
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
      else toast(t.materials.openFailed, 'error');
      return;
    }
    // Open the tab now (inside the click) so pop-up blockers allow it.
    const tab = window.open('', '_blank');
    setOpening(resource.id);
    try {
      const link = await getResourceDownload(resource.id);
      if (tab) tab.location.assign(link.url);
      else window.location.assign(link.url);
    } catch {
      tab?.close();
      toast(t.materials.downloadFailed, 'error');
    } finally {
      setOpening(null);
    }
  };

  return (
    <ul className="divide-y divide-divider overflow-hidden rounded-2xl border border-border bg-surface">
      {resources.map(resource => {
        const Icon = KIND_ICON[resource.kind];
        const meta = [
          resource.source === 'youtube'
            ? t.materials.youtube
            : resource.source === 'link'
            ? t.materials.webLink
            : resource.file
            ? [FILE_TYPE[resource.file.mimeType], resource.file.size > 0 && formatBytes(resource.file.size)].filter(Boolean).join(' · ')
            : '',
          resource.topicId && topicTitles?.get(resource.topicId),
          resource.institution && fmt(t.materials.schoolOnly, { school: resource.institution }),
        ]
          .filter(Boolean)
          .join(' · ');
        return (
          <li key={resource.id}>
            <button
              onClick={() => open(resource)}
              aria-label={resource.source === 'file' ? fmt(t.materials.download, { title: resource.title }) : fmt(t.materials.openA11y, { title: resource.title })}
              className="flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-surface-muted">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                <Icon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold text-text">{resource.title}</span>
                <span className="block truncate text-sm text-text-muted">
                  {t.materials.kinds[resource.kind]}
                  {meta ? ` · ${meta}` : ''}
                </span>
              </span>
              {opening === resource.id ? (
                <Spinner className="size-5 text-primary" />
              ) : resource.source === 'file' ? (
                <Download className="size-5 text-text-muted" />
              ) : (
                <ExternalLink className="size-5 text-text-muted" />
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
