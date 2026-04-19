// GSAP Setup — Import only what you need to keep bundle light
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import { TextPlugin } from 'gsap/TextPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

// Register plugins
gsap.registerPlugin(ScrollTrigger, Observer, TextPlugin, MotionPathPlugin);

export { gsap, ScrollTrigger };
export default gsap;
