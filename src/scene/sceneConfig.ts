/**
 * Geometry of the workstation photograph, in *source image pixels*
 * (the original 1024×768 frame; the shipped JPEG is a 2× upscale so
 * everything is expressed relative to SCENE.w/SCENE.h).
 */
export const SCENE = { w: 1024, h: 768, src: `${import.meta.env.BASE_URL}scene/workstation.jpg` };

/** The CRT glass (inner dark rectangle of the monitor). */
export const GLASS = { x: 337, y: 151, w: 289, h: 210 };

/** Physical power button on the tower (the lower square button, ⊙). */
export const POWER = { x: 616, y: 473, w: 30, h: 29 };

/** The power LED to the left of the button. */
export const LED = { x: 612.5, y: 486.5, r: 2.6 };

/** Logical resolution of the OS surface rendered inside the glass. */
export const SURFACE = { w: 1024, h: Math.round(1024 * GLASS.h / GLASS.w) };

/** Fraction of the viewport height where the glass center should sit when zoomed out. */
export const FRAME_Y = 0.38;

export const ZOOM_MS = 1100;
