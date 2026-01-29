'use client';

import * as React from 'react';
import {
  CheckIcon,
  CopyIcon,
  FacebookIcon,
  LinkedinIcon,
  LinkIcon,
  QrCodeIcon,
  Share2Icon,
  XIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparisonId: string;
  title: string;
}

export function ShareModal({
  isOpen,
  onClose,
  comparisonId,
  title,
}: ShareModalProps) {
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [copiedEmbed, setCopiedEmbed] = React.useState(false);
  const [showQR, setShowQR] = React.useState(false);

  // Generate the shareable URL
  const shareUrl = React.useMemo(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/compare/${comparisonId}`;
  }, [comparisonId]);

  // Generate embed code
  const embedCode = React.useMemo(() => {
    return `<iframe src="${shareUrl}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;
  }, [shareUrl]);

  // Generate social sharing URLs
  const socialUrls = React.useMemo(() => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);
    const text = encodeURIComponent(`Check out this comparison: ${title}`);

    return {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    };
  }, [shareUrl, title]);

  // Generate QR code URL (using a free QR code API)
  const qrCodeUrl = React.useMemo(() => {
    if (!shareUrl) return '';
    const encodedUrl = encodeURIComponent(shareUrl);
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUrl}`;
  }, [shareUrl]);

  // Copy link to clipboard
  const handleCopyLink = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  }, [shareUrl]);

  // Copy embed code to clipboard
  const handleCopyEmbed = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopiedEmbed(true);
      toast.success('Embed code copied!');
      setTimeout(() => setCopiedEmbed(false), 2000);
    } catch (error) {
      toast.error('Failed to copy embed code');
    }
  }, [embedCode]);

  // Open social share in new window
  const handleSocialShare = React.useCallback((url: string) => {
    window.open(url, '_blank', 'width=600,height=400,noopener,noreferrer');
  }, []);

  // Reset state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setCopiedLink(false);
      setCopiedEmbed(false);
      setShowQR(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2Icon className="size-5" />
            Share Comparison
          </DialogTitle>
          <DialogDescription>
            Share this budget comparison with others
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preview Section */}
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Preview
            </p>
            <p className="font-semibold text-lg">{title}</p>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              An interactive comparison from the Federal Budget Dashboard
            </p>
          </div>

          {/* Copy Link Section */}
          <div className="space-y-2">
            <label
              htmlFor="share-url"
              className="text-sm font-medium flex items-center gap-2"
            >
              <LinkIcon className="size-4" />
              Share Link
            </label>
            <div className="flex gap-2">
              <Input
                id="share-url"
                value={shareUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
                className={cn(
                  'shrink-0 transition-colors',
                  copiedLink && 'bg-green-500/10 border-green-500 text-green-600'
                )}
              >
                {copiedLink ? (
                  <CheckIcon className="size-4" />
                ) : (
                  <CopyIcon className="size-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Share on Social Media</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => handleSocialShare(socialUrls.twitter)}
                className="flex-1 min-w-[120px]"
              >
                <XIcon className="size-4" />
                Twitter/X
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialShare(socialUrls.facebook)}
                className="flex-1 min-w-[120px]"
              >
                <FacebookIcon className="size-4" />
                Facebook
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialShare(socialUrls.linkedin)}
                className="flex-1 min-w-[120px]"
              >
                <LinkedinIcon className="size-4" />
                LinkedIn
              </Button>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium flex items-center gap-2">
                <QrCodeIcon className="size-4" />
                QR Code
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQR(!showQR)}
              >
                {showQR ? 'Hide' : 'Show'}
              </Button>
            </div>
            {showQR && (
              <div className="flex justify-center p-4 bg-white rounded-lg border">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-48 h-48"
                  loading="lazy"
                />
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Scan with a mobile device to open this comparison
            </p>
          </div>

          {/* Embed Code Section */}
          <div className="space-y-2">
            <label
              htmlFor="embed-code"
              className="text-sm font-medium"
            >
              Embed Code
            </label>
            <div className="space-y-2">
              <div className="relative">
                <textarea
                  id="embed-code"
                  value={embedCode}
                  readOnly
                  rows={3}
                  className={cn(
                    'w-full rounded-md border bg-muted/30 px-3 py-2 text-xs font-mono',
                    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none',
                    'resize-none'
                  )}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyEmbed}
                  className={cn(
                    'absolute top-2 right-2',
                    copiedEmbed && 'text-green-600'
                  )}
                >
                  {copiedEmbed ? (
                    <>
                      <CheckIcon className="size-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <CopyIcon className="size-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Copy and paste this code to embed the comparison on your website
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
