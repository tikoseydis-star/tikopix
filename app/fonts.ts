import { Archivo, Inter, Mrs_Saint_Delafield, Sedgwick_Ave } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
/** Thin italic brush for accent words ("INTENTION", CTA), closest to the brand mockup */
const brush = Sedgwick_Ave({ subsets: ["latin"], weight: "400", variable: "--font-brush", display: "swap" });
const sign = Mrs_Saint_Delafield({ subsets: ["latin"], weight: "400", variable: "--font-sign", display: "swap" });

export const fontVariables = `${inter.variable} ${archivo.variable} ${brush.variable} ${sign.variable}`;
