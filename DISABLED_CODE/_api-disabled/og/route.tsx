import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

/**
 * Generates dynamic OpenGraph images for budget comparisons and items
 *
 * Query parameters:
 * - title: Main headline text (required)
 * - subtitle: Secondary text (optional)
 * - type: "comparison" | "budget" (default: "comparison")
 *
 * Examples:
 * - /api/og?title=NASA Budget&subtitle=$25.4 Billion&type=budget
 * - /api/og?title=NASA could fund 500,000 median US homes&type=comparison
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get('title') || 'Federal Budget Dashboard';
    const subtitle = searchParams.get('subtitle') || '';
    const type = searchParams.get('type') || 'comparison';

    // Brand colors matching the dashboard
    const colors = {
      background: '#0f172a', // slate-900
      primary: '#3b82f6', // blue-500
      text: '#f8fafc', // slate-50
      textSecondary: '#cbd5e1', // slate-300
      accent: '#60a5fa', // blue-400
    };

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: colors.background,
            padding: '80px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Header Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
              }}
            >
              💰
            </div>
            <div
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: colors.textSecondary,
                letterSpacing: '-0.02em',
              }}
            >
              Federal Budget Dashboard
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: subtitle ? '24px' : '0',
              maxWidth: '1040px',
            }}
          >
            {/* Title */}
            <div
              style={{
                fontSize: type === 'comparison' ? '64px' : '72px',
                fontWeight: '700',
                color: colors.text,
                lineHeight: '1.1',
                letterSpacing: '-0.03em',
                display: 'flex',
              }}
            >
              {title}
            </div>

            {/* Subtitle */}
            {subtitle && (
              <div
                style={{
                  fontSize: '42px',
                  fontWeight: '600',
                  color: colors.accent,
                  letterSpacing: '-0.02em',
                  display: 'flex',
                }}
              >
                {subtitle}
              </div>
            )}
          </div>

          {/* Footer with Type Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  backgroundColor: colors.primary + '20',
                  border: `2px solid ${colors.primary}`,
                  fontSize: '20px',
                  fontWeight: '600',
                  color: colors.primary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'flex',
                }}
              >
                {type === 'budget' ? 'Budget Item' : 'Comparison'}
              </div>
            </div>

            {/* Decorative gradient bar */}
            <div
              style={{
                height: '4px',
                width: '240px',
                borderRadius: '2px',
                background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                display: 'flex',
              }}
            />
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);

    // Fallback error response
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            color: '#f8fafc',
            fontSize: '48px',
            fontWeight: '700',
            fontFamily: 'system-ui',
          }}
        >
          Federal Budget Dashboard
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}
