"use client";

export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Stacked coins */}
      <ellipse cx="20" cy="28" rx="14" ry="5" fill="rgba(124,58,237,0.15)" stroke="#7c3aed" strokeWidth="1.5"/>
      <ellipse cx="20" cy="22" rx="14" ry="5" fill="rgba(124,58,237,0.15)" stroke="#a78bfa" strokeWidth="1.5"/>
      <ellipse cx="20" cy="16" rx="14" ry="5" fill="rgba(124,58,237,0.2)" stroke="#c4b5fd" strokeWidth="1.5"/>
      {/* Dollar sign on top coin */}
      <path d="M20 13v2" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round"/>
      <text x="20" y="19" textAnchor="middle" fill="#c4b5fd" fontSize="6" fontWeight="bold">$</text>
      {/* Green plus — tracking indicator */}
      <circle cx="33" cy="10" r="4" fill="#10b981" opacity="0.2" stroke="#10b981" strokeWidth="1"/>
      <path d="M31 10h4m-2-2v4" stroke="#10b981" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  );
}
