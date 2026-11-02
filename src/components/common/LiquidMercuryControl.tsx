import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import './LiquidMercuryControl.css';

export interface LiquidMercuryOption<T extends string = string> {
  id: T;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export interface LiquidMercuryControlProps<T extends string = string> {
  options: LiquidMercuryOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'auto' | 'equal';
  ariaLabel?: string;
}

export function LiquidMercuryControl<T extends string = string>({
  options,
  value,
  onChange,
  className = '',
  size = 'md',
  layout = 'auto',
  ariaLabel = 'Segmented options',
}: LiquidMercuryControlProps<T>) {
  const trackRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const isFirstRender = useRef(true);

  const [thumbStyle, setThumbStyle] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    ready: boolean;
  }>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    ready: false,
  });

  const [isSquashing, setIsSquashing] = useState(false);
  const squashTimeoutRef = useRef<number | null>(null);

  const updateThumbPosition = useCallback(() => {
    const track = trackRef.current;
    const activeButton = buttonRefs.current[value];

    if (!track || !activeButton) {
      return;
    }

    const trackRect = track.getBoundingClientRect();
    const activeRect = activeButton.getBoundingClientRect();

    // Calculate position relative to track scroll and padding
    const left = activeButton.offsetLeft;
    const top = activeButton.offsetTop;
    const width = activeButton.offsetWidth;
    const height = activeButton.offsetHeight;

    setThumbStyle({
      left,
      top,
      width,
      height,
      ready: true,
    });
  }, [value]);

  // Initial and reactive updates
  useLayoutEffect(() => {
    updateThumbPosition();

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Trigger squash animation
    setIsSquashing(true);
    if (squashTimeoutRef.current) {
      window.clearTimeout(squashTimeoutRef.current);
    }
    squashTimeoutRef.current = window.setTimeout(() => {
      setIsSquashing(false);
    }, 480);

    return () => {
      if (squashTimeoutRef.current) {
        window.clearTimeout(squashTimeoutRef.current);
      }
    };
  }, [value, updateThumbPosition]);

  // Listen to window resize and ResizeObserver for the track
  useEffect(() => {
    const handleResize = () => updateThumbPosition();
    window.addEventListener('resize', handleResize);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && trackRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateThumbPosition();
      });
      resizeObserver.observe(trackRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [updateThumbPosition]);

  // Handle click with auto horizontal scroll for long lists
  const handleSelect = (optionId: T) => {
    if (optionId === value) return;
    onChange(optionId);

    const btn = buttonRefs.current[optionId];
    const track = trackRef.current;
    if (btn && track) {
      const btnRect = btn.getBoundingClientRect();
      const trackRect = track.getBoundingClientRect();

      // If button is outside visible bounds, gently scroll
      if (btnRect.left < trackRect.left || btnRect.right > trackRect.right) {
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    }
  };

  const gridColumnsStyle =
    layout === 'equal'
      ? { gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }
      : undefined;

  return (
    <div className={`liquid-mercury-wrapper ${className}`}>
      <div
        ref={trackRef}
        role="tablist"
        aria-label={ariaLabel}
        style={gridColumnsStyle}
        className={`liquid-mercury-track liquid-mercury-track--${size} ${
          layout === 'equal' ? 'liquid-mercury-track--equal' : ''
        }`}
      >
        {/* Animated Liquid Mercury Thumb */}
        {thumbStyle.ready && (
          <span
            className={`liquid-mercury-thumb ${isSquashing ? 'is-squashing' : ''}`}
            style={{
              left: `${thumbStyle.left}px`,
              top: `${thumbStyle.top}px`,
              width: `${thumbStyle.width}px`,
              height: `${thumbStyle.height}px`,
            }}
            aria-hidden="true"
          />
        )}

        {/* Option Items */}
        {options.map((opt) => {
          const isActive = opt.id === value;
          const Icon = opt.icon;

          return (
            <button
              key={opt.id}
              ref={(el) => {
                buttonRefs.current[opt.id] = el;
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleSelect(opt.id)}
              className={`liquid-mercury-opt liquid-mercury-opt--${size} ${
                isActive ? 'is-active' : ''
              }`}
            >
              {Icon && (
                <Icon
                  className={
                    size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-4.5 h-4.5' : 'w-4 h-4'
                  }
                />
              )}
              <span>{opt.label}</span>
              {opt.badge !== undefined && (
                <span
                  className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-slate-900/15 text-slate-900'
                      : 'bg-zinc-700/60 text-zinc-300'
                  }`}
                >
                  {opt.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LiquidMercuryControl;

