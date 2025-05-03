import React, { useEffect, useRef, useState, useCallback } from "react"

interface IDevice {
    info: string;
    Android(): RegExpMatchArray | null;
    BlackBerry(): RegExpMatchArray | null;
    IEMobile(): RegExpMatchArray | null;
    iOS(): RegExpMatchArray | null;
    iPad(): boolean;
    OperaMini(): RegExpMatchArray | null;
    any(): boolean;
}

const IsDevice: IDevice = (() => {
    if (typeof navigator == 'undefined') return {} as IDevice;

    let ua = navigator.userAgent;

    return {
        info: ua,

        Android() {
            return ua.match(/Android/i)
        },
        BlackBerry() {
            return ua.match(/BlackBerry/i)
        },
        IEMobile() {
            return ua.match(/IEMobile/i)
        },
        iOS() {
            return ua.match(/iPhone|iPad|iPod/i)
        },
        iPad() {
            return (
                ua.match(/Mac/) !== null &&
                navigator.maxTouchPoints &&
                navigator.maxTouchPoints > 2
            )
        },
        OperaMini() {
            return ua.match(/Opera Mini/i)
        },
        any() {
            return (
                IsDevice.Android() ||
                IsDevice.BlackBerry() ||
                IsDevice.iOS() ||
                IsDevice.iPad() ||
                IsDevice.OperaMini() ||
                IsDevice.IEMobile()
            ) !== null
        }
    }
})()

function useEventListener<K extends keyof WindowEventMap>(
    eventName: K,
    handler: (event: WindowEventMap[K]) => void,
    element: HTMLElement | Window | Document = document
): void {
    const savedHandler = useRef<(event: WindowEventMap[K]) => void>();

    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        const isSupported = element && element.addEventListener;
        if (!isSupported) return;

        const eventListener = (event: WindowEventMap[K]) => {
            savedHandler.current?.(event);
        };

        element.addEventListener(eventName, eventListener);

        return () => {
            element.removeEventListener(eventName, eventListener);
        };
    }, [eventName, element]);
}

interface CursorCoreProps {
    outerStyle?: React.CSSProperties;
    innerStyle?: React.CSSProperties;
    color?: string;
    outerAlpha?: number;
    innerSize?: number;
    outerSize?: number;
    outerScale?: number;
    innerScale?: number;
    trailingSpeed?: number;
    clickables?: string[];
}

interface Coordinates {
    x: number;
    y: number;
}

function CursorCore({
    outerStyle,
    innerStyle,
    color = '220, 90, 90',
    outerAlpha = 0.3,
    innerSize = 8,
    outerSize = 8,
    outerScale = 6,
    innerScale = 0.6,
    trailingSpeed = 8,
    clickables = [
        'a',
        'input[type="text"]',
        'input[type="email"]',
        'input[type="number"]',
        'input[type="submit"]',
        'input[type="image"]',
        'label[for]',
        'select',
        'textarea',
        'button',
        '.link'
    ]
}: CursorCoreProps): JSX.Element {
    const cursorOuterRef = useRef<HTMLDivElement>(null);
    const cursorInnerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>();
    const previousTimeRef = useRef<number>();
    const [coords, setCoords] = useState<Coordinates>({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isActiveClickable, setIsActiveClickable] = useState(false);
    const endX = useRef(0);
    const endY = useRef(0);

    const onMouseMove = useCallback(({ clientX, clientY }: MouseEvent) => {
        if (cursorInnerRef.current) {
            cursorInnerRef.current.style.top = `${clientY}px`;
            cursorInnerRef.current.style.left = `${clientX}px`;
        }
        endX.current = clientX;
        endY.current = clientY;
    }, []);

    const animateOuterCursor = useCallback(
        (time: number) => {
            if (previousTimeRef.current !== undefined) {
                const deltaX = (endX.current - coords.x) / trailingSpeed;
                const deltaY = (endY.current - coords.y) / trailingSpeed;

                const newX = coords.x + deltaX;
                const newY = coords.y + deltaY;

                if (cursorOuterRef.current) {
                    cursorOuterRef.current.style.top = `${newY}px`;
                    cursorOuterRef.current.style.left = `${newX}px`;
                }

                setCoords({ x: newX, y: newY });
            }
            previousTimeRef.current = time;
            requestRef.current = requestAnimationFrame(animateOuterCursor);
        },
        [coords, trailingSpeed]
    );

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animateOuterCursor);
        return () => cancelAnimationFrame(requestRef.current!);
    }, [animateOuterCursor]);

    const onMouseDown = useCallback(() => setIsActive(true), []);
    const onMouseUp = useCallback(() => setIsActive(false), []);
    const onMouseEnterViewport = useCallback(() => setIsVisible(true), []);
    const onMouseLeaveViewport = useCallback(() => setIsVisible(false), []);

    useEventListener('mousemove', onMouseMove);
    useEventListener('mousedown', onMouseDown);
    useEventListener('mouseup', onMouseUp);
    useEventListener('mouseover', onMouseEnterViewport);
    useEventListener('mouseout', onMouseLeaveViewport);

    useEffect(() => {
        if (isActive) {
            if (cursorInnerRef.current) {
                cursorInnerRef.current.style.transform = `translate(-50%, -50%) scale(${innerScale})`;
            }
            if (cursorOuterRef.current) {
                cursorOuterRef.current.style.transform = `translate(-50%, -50%) scale(${outerScale})`;
            }
        } else {
            if (cursorInnerRef.current) {
                cursorInnerRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
            }
            if (cursorOuterRef.current) {
                cursorOuterRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        }
    }, [innerScale, outerScale, isActive]);

    useEffect(() => {
        if (isActiveClickable) {
            if (cursorInnerRef.current) {
                cursorInnerRef.current.style.transform = `translate(-50%, -50%) scale(${innerScale * 1.2})`;
            }
            if (cursorOuterRef.current) {
                cursorOuterRef.current.style.transform = `translate(-50%, -50%) scale(${outerScale * 1.4})`;
            }
        }
    }, [innerScale, outerScale, isActiveClickable]);

    useEffect(() => {
        if (isVisible) {
            if (cursorInnerRef.current) cursorInnerRef.current.style.opacity = '1';
            if (cursorOuterRef.current) cursorOuterRef.current.style.opacity = '1';
        } else {
            if (cursorInnerRef.current) cursorInnerRef.current.style.opacity = '0';
            if (cursorOuterRef.current) cursorOuterRef.current.style.opacity = '0';
        }
    }, [isVisible]);

    const styles = {
        cursorInner: {
            zIndex: 999,
            display: 'block',
            position: 'fixed',
            borderRadius: '50%',
            width: innerSize,
            height: innerSize,
            pointerEvents: 'none',
            backgroundColor: `rgba(${color}, 1)`,
            ...(innerStyle && innerStyle),
            transition: 'opacity 0.15s ease-in-out, transform 0.25s ease-in-out'
        },
        cursorOuter: {
            zIndex: 999,
            display: 'block',
            position: 'fixed',
            borderRadius: '50%',
            pointerEvents: 'none',
            width: outerSize,
            height: outerSize,
            backgroundColor: `rgba(${color}, ${outerAlpha})`,
            transition: 'opacity 0.15s ease-in-out, transform 0.15s ease-in-out',
            willChange: 'transform',
            ...(outerStyle && outerStyle)
        }
    };

    document.body.style.cursor = 'none';

    return (
        <>
            <div ref={cursorOuterRef} style={styles.cursorOuter as any} />
            <div ref={cursorInnerRef} style={styles.cursorInner as any} />
        </>
    );
}

interface AnimatedCursorProps extends CursorCoreProps { }

function AnimatedCursor({
    outerStyle,
    innerStyle,
    color,
    outerAlpha,
    innerSize,
    innerScale,
    outerSize,
    outerScale,
    trailingSpeed,
    clickables
}: AnimatedCursorProps): JSX.Element {
    if (typeof navigator !== 'undefined' && IsDevice.any()) {
        return <React.Fragment></React.Fragment>
    }
    return <CursorCore
        outerStyle={outerStyle}
        innerStyle={innerStyle}
        color={color}
        outerAlpha={outerAlpha}
        innerSize={innerSize}
        innerScale={innerScale}
        outerSize={outerSize}
        outerScale={outerScale}
        trailingSpeed={trailingSpeed}
        clickables={clickables}
    />;
}

export default AnimatedCursor;