/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Layers, 
  Server, 
  Key, 
  UserCheck, 
  Fingerprint, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

interface SSOAuthenticProps {
  onLoginSuccess: (tenant: string, idp: string) => void;
  userEmail: string;
}

export default function SSOAuthentic({ onLoginSuccess, userEmail }: SSOAuthenticProps) {
  const [tenant, setTenant] = useState<string>('amdox-emea');
  const [idp, setIdp] = useState<string>('google-workspace');
  const [mfaPin, setMfaPin] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [authStage, setAuthStage] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [credential, setCredential] = useState<string>('********');

  // Hardcoded target authentication challenge code
  const requiredPin = "2026";

  const handleNumClick = (val: string) => {
    if (mfaPin.length < 6) {
      setMfaPin(prev => prev + val);
    }
  };

  const handleBackspace = () => {
    setMfaPin(prev => prev.slice(0, -1));
  };

  const handleReset = () => {
    setMfaPin('');
    setErrorMessage(null);
  };

  const handleSubmitAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaPin.length < 4) {
      setErrorMessage("Multi-Factor authentication requires a minimum of 4 digits.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    // Simulate <2s latency OIDC handshake
    const stages = [
      'Authenticating client credentials against Identity Provider...',
      'Enforcing strict multi-tenant isolation protocols...',
      'Verifying SAML 2.0 signatures & claim tokens...',
      'MFA Token authorized. Emitting secured JWT block...'
    ];

    let currentStageIdx = 0;
    setAuthStage(stages[0]);

    const interval = setInterval(() => {
      currentStageIdx++;
      if (currentStageIdx < stages.length) {
        setAuthStage(stages[currentStageIdx]);
      } else {
        clearInterval(interval);
        setLoading(false);
        onLoginSuccess(tenant, idp);
      }
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#13121b] flex items-center justify-center p-6 text-text-primary relative selection:bg-brand-primary/30 selection:text-white">
      {/* Network mesh matrix grid backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      <div className="w-full max-w-md bg-surf-card border border-brand-outline rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(124,106,255,0.15)] space-y-6 relative overflow-hidden transition-all">
        
        {/* Glow Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl pointer-events-none" />

        {/* Branding header inside login box */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center border border-brand-primary/20 text-[#a78bfa] relative">
            <Lock className="w-5 h-5" />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#00d4aa] rounded-full border-2 border-surf-card" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-sans tracking-tight">Identity Access Manager</h2>
            <p className="text-[11px] text-text-secondary font-mono uppercase tracking-widest">Multi-Tenant Port Vault</p>
          </div>
        </div>

        {loading ? (
          /* MFA Handshake Loader */
          <div className="py-12 text-center space-y-6 min-h-[340px] flex flex-col justify-center items-center">
            <div className="relative">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10 border border-brand-primary/20 text-[#a78bfa]">
                <Fingerprint className="w-6 h-6 animate-pulse" />
              </span>
              <span className="absolute inset-0 rounded-full bg-brand-primary/10 border border-brand-primary animate-ping duration-1000 scale-[1.3]" />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-[#00d4aa] uppercase tracking-wider animate-pulse">
                SSO HANDSHAKE ACTIVE
              </h4>
              <p className="text-[11px] text-text-secondary font-mono max-w-xs mx-auto animate-fade-in leading-relaxed">
                {authStage}
              </p>
            </div>

            <div className="w-48 bg-surf-lowest h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand-primary to-[#00d4aa] animate-[pulse_1.5s_infinite] w-full" />
            </div>
          </div>
        ) : (
          /* Authentication Entry Fields */
          <form onSubmit={handleSubmitAuth} className="space-y-4 font-mono text-xs">
            
            {errorMessage && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/25 text-rose-300 text-xs rounded-lg flex items-start gap-2.5 animate-fade-in">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Tenant Selection Center */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-text-secondary tracking-wider font-extrabold flex justify-between">
                <span>Enterprise Workspace (Tenant Isolation)</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'amdox-us', name: 'Amdox US' },
                  { id: 'amdox-india', name: 'Amdox India' },
                  { id: 'amdox-uk', name: 'Amdox UK' }
                ].map((ten) => (
                  <button
                    key={ten.id}
                    type="button"
                    onClick={() => setTenant(ten.id)}
                    className={`py-2 px-1 text-center rounded border transition-all truncate text-[11px] ${
                      tenant === ten.id 
                        ? 'border-brand-primary text-white bg-brand-primary/10' 
                        : 'border-brand-outline text-text-secondary hover:text-white bg-transparent'
                    }`}
                  >
                    {ten.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Identity SSO Providers */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-text-secondary tracking-wider font-extrabold block">SSO Service Platform</label>
              <select 
                value={idp}
                onChange={(e) => setIdp(e.target.value)}
                className="w-full bg-[#0c0d14] text-white border border-brand-outline rounded-lg py-2 px-3 focus:outline-none focus:border-brand-primary cursor-pointer font-bold text-xs"
              >
                <option value="google-workspace">Google Workspace Account</option>
                <option value="azure-active-directory">Azure Active Directory (OIDC)</option>
                <option value="keycloak-saml">Keycloak Federation Vault</option>
              </select>
            </div>

            {/* Email Account */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-text-secondary tracking-wider font-extrabold block">Authorized User Profile ID</label>
              <div className="bg-[#0c0d14] border border-brand-outline rounded-lg py-2 px-3 text-text-secondary select-none flex justify-between items-center">
                <span className="truncate text-white font-bold">{userEmail}</span>
                <span className="text-[10px] bg-brand-primary/10 text-brand-primary-dim px-1.5 rounded uppercase block shrink-0 font-bold">Authorized</span>
              </div>
            </div>

            {/* Simulated password/secret to look professional */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-text-secondary tracking-wider font-extrabold flex justify-between">
                <span>SSO Password Target</span>
                <span className="text-text-secondary">Protected by JWT</span>
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={credential}
                  onChange={(e) => setCredential(e.target.value)}
                  className="w-full bg-[#0c0d14] border border-brand-outline rounded-lg py-2 px-3 text-white focus:outline-none focus:border-brand-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-text-secondary hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Interactive Multi-Factor MFA prompt */}
            <div className="space-y-2 border-t border-brand-outline/60 pt-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase text-text-secondary tracking-widest font-extrabold">
                  Interactive MFA Digital Token Pin
                </label>
                <span className="text-[11px] font-bold text-[#00d4aa] animate-pulse">Enter "2026" to demo</span>
              </div>
              
              {/* Display Pin */}
              <div className="bg-[#0c0d14] border border-brand-outline rounded-xl py-2.5 px-6 tracking-[0.6em] text-center text-xl font-bold font-mono text-white h-11 flex items-center justify-center relative">
                {mfaPin || <span className="text-xs text-text-muted select-none tracking-normal">Awaiting Safe Input</span>}
                {mfaPin && (
                  <button 
                    type="button" 
                    onClick={handleReset} 
                    className="absolute right-4 text-[10px] uppercase tracking-normal font-bold text-rose-400 hover:text-rose-300 font-mono"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Pin numeric keypad */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {['1', '2', '3'].map(n => (
                  <button key={n} type="button" onClick={() => handleNumClick(n)} className="py-2 bg-surf-card border border-brand-outline/65 hover:border-brand-primary rounded font-bold text-center text-white text-xs cursor-pointer select-none">
                    {n}
                  </button>
                ))}
                <button type="button" onClick={() => handleBackspace()} className="py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded font-bold text-center border border-rose-500/20 select-none cursor-pointer row-span-2 flex items-center justify-center text-[10px] uppercase">
                  Del
                </button>
                {['4', '5', '6'].map(n => (
                  <button key={n} type="button" onClick={() => handleNumClick(n)} className="py-2 bg-surf-card border border-brand-outline/65 hover:border-brand-primary rounded font-bold text-center text-white text-xs cursor-pointer select-none">
                    {n}
                  </button>
                ))}
                {['7', '8', '9'].map(n => (
                  <button key={n} type="button" onClick={() => handleNumClick(n)} className="py-2 bg-surf-card border border-brand-outline/65 hover:border-brand-primary rounded font-bold text-center text-white text-xs cursor-pointer select-none">
                    {n}
                  </button>
                ))}
                <button type="button" onClick={() => handleNumClick('0')} className="py-2 bg-surf-card border border-brand-outline/65 hover:border-brand-primary rounded font-bold text-center text-white text-xs cursor-pointer select-none">
                  0
                </button>
              </div>
            </div>

            {/* Authenticate Trigger */}
            <button
              type="submit"
              disabled={mfaPin !== requiredPin}
              className={`w-full py-2.5 font-bold tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 uppercase select-none ${
                mfaPin === requiredPin 
                  ? 'bg-[#00d4aa] text-[#13121b] cursor-pointer shadow-[0_0_15px_rgba(0,212,170,0.3)] hover:scale-[1.01]' 
                  : 'bg-surf-lowest text-text-muted border border-brand-outline cursor-not-allowed'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Verify MFA & Launch Dashboard</span>
            </button>

          </form>
        )}
      </div>
    </div>
  );
}
