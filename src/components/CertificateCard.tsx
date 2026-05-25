import React, { useRef } from 'react';
import { Download, CheckCircle, ShieldCheck, Star, Share2 } from 'lucide-react';
import type { UserProfile } from '../utils/SupabaseMock';
import type { LanguageStrings } from '../data/translations';

interface CertificateCardProps {
  profile: UserProfile;
  labels: LanguageStrings;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({ profile, labels }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const getLevelLabel = (level: string | null) => {
    if (level === 'Beginner') return labels.levelBeginner;
    if (level === 'Intermediate') return labels.levelIntermediate;
    if (level === 'Expert') return labels.levelExpert;
    return '';
  };

  // Generate a mock hash for verification
  const verificationHash = `NS-${profile.id.toUpperCase().substring(5)}-${profile.trade.toUpperCase().substring(0, 3)}`;

  // Function to simulate downloading (capturing card metadata as text or generating printable layout)
  const handleDownload = () => {
    // Generate simple metadata file
    const element = document.createElement("a");
    const certDetails = `
--------------------------------------------------
          NARI SHAKTI CERTIFICATE OF SKILL
--------------------------------------------------
Certificate ID: ${verificationHash}
Name: ${profile.name}
Trade: ${profile.trade === 'tailoring' ? 'Tailoring & Sewing' : profile.trade === 'beauty' ? 'Beauty Parlour & Wellness' : 'Food Prep & Catering'}
Skill Level: ${profile.skillLevel}
Issue Date: ${profile.certifiedAt || new Date().toLocaleDateString()}
Status: VERIFIED AND BLOCKCHAIN ANCHORED
--------------------------------------------------
Verify online by scanning the QR code in your app.
`;
    const file = new Blob([certDetails], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${profile.name.replace(/\s+/g, '_')}_NariShakti_Certificate.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Certificate Frame */}
      <div
        ref={cardRef}
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-400 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white relative p-6 mt-4"
      >
        {/* Background Decorative patterns */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        {/* Header decoration */}
        <div className="flex justify-between items-start border-b border-teal-800/40 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] uppercase tracking-widest text-teal-300 font-bold">SECURE BLOCKCHAIN ID</span>
            </div>
            <h3 className="text-sm font-extrabold text-amber-400 tracking-wide mt-1">
              {labels.certificateTitle}
            </h3>
            <p className="text-[9px] text-slate-300 font-medium tracking-tight">
              {labels.certificateSubtitle}
            </p>
          </div>
          
          <div className="flex flex-col items-end">
            <ShieldCheck size={28} className="text-amber-400 fill-amber-400/20" />
            <span className="text-[9px] text-emerald-400 mt-1 font-bold">VERIFIED</span>
          </div>
        </div>

        {/* User Details */}
        <div className="flex gap-4 items-center my-4">
          <div className="relative">
            {profile.photoUrl ? (
              <img
                src={profile.photoUrl}
                alt={profile.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-400"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-teal-800 border-2 border-amber-400 flex items-center justify-center text-teal-100 font-extrabold text-xl">
                {profile.name.charAt(0)}
              </div>
            )}
            <div className="absolute -bottom-1.5 -right-1 bg-amber-400 text-teal-950 p-0.5 rounded-full">
              <CheckCircle size={14} className="fill-current text-teal-950" />
            </div>
          </div>

          <div className="flex-1">
            <h4 className="text-base font-bold text-white tracking-wide">{profile.name}</h4>
            <div className="flex items-center gap-1 mt-1">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <span className="text-xs font-semibold text-slate-200">
                {getLevelLabel(profile.skillLevel)}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">ID: {verificationHash}</p>
          </div>
        </div>

        {/* Certificate metadata */}
        <div className="grid grid-cols-2 gap-4 bg-teal-900/30 border border-teal-800/30 rounded-xl p-3 my-4 text-left">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400">{labels.tradeLabel}</span>
            <p className="text-xs font-bold text-slate-100">
              {profile.trade === 'tailoring' ? labels.sewingTrade : profile.trade === 'beauty' ? labels.beautyTrade : labels.foodTrade}
            </p>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400">{labels.issueDate}</span>
            <p className="text-xs font-bold text-slate-100">
              {profile.certifiedAt || new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Bottom verification QR block */}
        <div className="flex justify-between items-center bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/30">
          <div className="text-left max-w-[180px]">
            <p className="text-[8px] text-slate-400 leading-tight">
              Scan this code to verify authenticity instantly on public ledger.
            </p>
            <p className="text-[9px] font-semibold text-amber-400 mt-1">
              {labels.verifiedBy}
            </p>
          </div>

          {/* Inline SVG QR Code representation to work instantly offline */}
          <div className="bg-white p-1 rounded-lg">
            <svg width="48" height="48" viewBox="0 0 29 29">
              <path d="M0 0h7v7H0zm1 1v5h5V1zm8 0h1v1H9zm1 0h1v2h-1zm1 0h3v1h-3zm3 0h1v4h-1zm1 0h1v1h-1zm1 0h3v3h-1V2h-1v1h-1zm3 0h1v2h-1zm-6 2h1v1h-1zm1 0h2v1h-2zm-5 4h1v1H3zm17-2v1h-1v-1zm1 0h1v2h-1zm1 0h2v1h-2zm1 0h1v1h-1zm-6 2h1v3h-1zm1 0h1v1h-1zm2 0h1v1h-1zm1 0h1v2h-1zm-15 4h7v7H0zm1 1v5h5v-5zm8-1h1v1H9zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h2v1h-2zm2 0h1v3h-1zm2 0h1v1h-1zm1 0h1v2h-1zm-9 2h1v1h-1zm2 0h1v2h-1zm2 0h1v1h-1zm-8 2h1v1H3zm6 0h1v1H9zm1 0h2v1h-2zm4 0h1v2h-1zm2 0h2v1h-2zm1 0h1v1h-1zm-10 2h1v1h-1zm2 0h3v1h-3zm4 0h1v1h-1zm3 0h1v1h-1zm1 0h2v1h-2z" fill="#0D5C75"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-3 w-full max-w-sm mt-4">
        <button
          onClick={handleDownload}
          className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors text-sm"
        >
          <Download size={18} />
          {labels.downloadCert}
        </button>
        <button
          onClick={() => {
            alert("Verification Link copied! Share this link with employers to prove verification status.");
          }}
          className="bg-teal-700 hover:bg-teal-800 text-white font-bold p-3 rounded-xl flex items-center justify-center shadow-md transition-colors"
          title="Share Certificate"
        >
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
};
