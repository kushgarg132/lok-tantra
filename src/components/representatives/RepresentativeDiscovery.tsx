"use client";

import { useState } from "react";
import { getPartyColor } from "@/lib/utils";
import { EntityAvatar } from "@/components/media/EntityAvatar";
import { PartyLogo } from "@/components/media/PartyLogo";

interface RepDTO {
  id: string;
  name: string;
  designation: string;
  party: string;
  partyColor: string;
  photoUrl?: string | null;
  constituency: string;
  state: string;
  level: string;
  chamber: "lok_sabha" | "rajya_sabha" | "state_assembly" | null;
  contact: Record<string, string>;
  profile: Record<string, any>;
  socialLinks?: Record<string, string>;
  assets?: Record<string, any>;
  criminalCases?: Record<string, any>[];
}

type SearchMode = "pincode" | "gps" | "constituency" | "state";

interface Props {
  initialRepresentatives: RepDTO[];
  states: string[];
}

export function RepresentativeDiscovery({ initialRepresentatives, states }: Props) {
  const [searchMode, setSearchMode] = useState<SearchMode>("state");
  const [searchValue, setSearchValue] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [reps, setReps] = useState<RepDTO[]>(initialRepresentatives);
  const [isLoading, setIsLoading] = useState(false);
  
  const [selectedRepId, setSelectedRepId] = useState<string | null>(null);
  const [selectedRepData, setSelectedRepData] = useState<RepDTO | null>(null);
  const [isRepLoading, setIsRepLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    let url = "/api/representatives/discover?";

    try {
      if (searchMode === "gps") {
        navigator.geolocation.getCurrentPosition(async (position) => {
          url += `lat=${position.coords.latitude}&lng=${position.coords.longitude}`;
          const res = await fetch(url);
          const json = await res.json();
          setReps(json.data || []);
          setIsLoading(false);
        }, (err) => {
          alert("Location access denied or unavailable.");
          setIsLoading(false);
        });
        return; // wait for callback
      } else if (searchMode === "pincode" && searchValue) {
        url += `pincode=${encodeURIComponent(searchValue)}`;
      } else if (searchMode === "constituency" && searchValue) {
        url += `constituency=${encodeURIComponent(searchValue)}`;
      } else if (searchMode === "state" && selectedState) {
        url += `state=${encodeURIComponent(selectedState)}`;
      } else {
        // Fallback or empty search
        setIsLoading(false);
        return;
      }

      const res = await fetch(url);
      const json = await res.json();
      setReps(json.data || []);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRep = async (rep: RepDTO) => {
    if (selectedRepId === rep.id) {
      setSelectedRepId(null);
      setSelectedRepData(null);
      return;
    }
    
    setSelectedRepId(rep.id);
    setIsRepLoading(true);
    // Optimistic set
    setSelectedRepData(rep);

    try {
      const res = await fetch(`/api/representatives/${rep.id}`);
      const json = await res.json();
      if (json.data) {
        setSelectedRepData(json.data);
      }
    } catch (e) {
      console.error("Failed to fetch full profile", e);
    } finally {
      setIsRepLoading(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
      {/* Search Controls */}
      <div className="card p-6 mb-8">
        <h3 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100 mb-4">
          How would you like to search?
        </h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {(["pincode", "gps", "constituency", "state"] as SearchMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setSearchMode(mode);
                if (mode === "gps") handleSearch();
              }}
              className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${
                searchMode === mode
                  ? "bg-saffron-500 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              By {mode === "pincode" ? "PIN Code" : mode === "gps" ? "Current Location (GPS)" : mode}
            </button>
          ))}
        </div>

        {searchMode !== "gps" && (
          <div className="flex flex-col sm:flex-row gap-3">
            {searchMode === "state" ? (
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-saffron-400"
              >
                <option value="">Select a State</option>
                {states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={
                  searchMode === "pincode"
                    ? "Enter your PIN code (e.g., 110001)"
                    : "Enter constituency name"
                }
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-saffron-400"
              />
            )}
            <button 
              onClick={handleSearch}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-saffron-500 text-white font-medium text-sm hover:bg-saffron-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* List */}
        <div className="flex-1 space-y-3">
          <p className="text-sm text-slate-500 mb-2">
            {reps.length} representative{reps.length !== 1 ? "s" : ""} found
          </p>

          {reps.map((rep) => (
            <button
              key={rep.id}
              onClick={() => handleSelectRep(rep)}
              className={`w-full text-left card p-4 transition-all ${
                selectedRepId === rep.id ? "border-saffron-400 dark:border-saffron-500 shadow-md" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <EntityAvatar
                  name={rep.name}
                  photoUrl={rep.photoUrl}
                  color={getPartyColor(rep.party)}
                  size="lg"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-bold text-slate-900 dark:text-slate-100">
                      {rep.name}
                    </h4>
                    <span
                      className="badge text-[10px]"
                      style={{ backgroundColor: `${getPartyColor(rep.party)}20`, color: getPartyColor(rep.party) }}
                    >
                      {rep.party}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {rep.designation} &middot; {rep.constituency}
                  </p>
                  <p className="text-xs text-slate-500">{rep.state}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="lg:w-[450px] lg:sticky lg:top-24 lg:self-start">
          {selectedRepData ? (
            <RepDetailPanel rep={selectedRepData} isLoading={isRepLoading} />
          ) : (
            <div className="card p-8 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-500">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">
                Select a Representative
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Click on any representative to see their full profile, contact information, and performance metrics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RepDetailPanel({ rep, isLoading }: { rep: RepDTO; isLoading: boolean }) {
  const formatMoney = (val?: number) => {
    if (!val) return "N/A";
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString()}`;
  };

  return (
    <div className={`card overflow-hidden transition-opacity ${isLoading ? 'opacity-70' : 'opacity-100'}`}>
      {/* Header */}
      <div className="p-6" style={{ background: `linear-gradient(135deg, ${getPartyColor(rep.party)}15, transparent)` }}>
        <div className="flex items-center gap-4">
          <EntityAvatar
            name={rep.name}
            photoUrl={rep.photoUrl}
            color={getPartyColor(rep.party)}
            size="xl"
            priority
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-slate-100 truncate">
              {rep.name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {rep.designation}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <div className="flex items-center gap-1.5">
                <PartyLogo
                  abbreviation={rep.party}
                  color={getPartyColor(rep.party)}
                  size="xs"
                  shape="circle"
                />
                <span
                  className="badge text-xs"
                  style={{ backgroundColor: `${getPartyColor(rep.party)}20`, color: getPartyColor(rep.party) }}
                >
                  {rep.party}
                </span>
              </div>
              <span className="text-xs text-slate-500 truncate">{rep.constituency}, {rep.state}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Assets & Background (New) */}
        {(rep.assets || (rep.criminalCases && rep.criminalCases.length > 0)) && (
          <div>
             <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Background & Declaration
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {rep.assets && (
                <>
                  <StatBox label="Declared Assets" value={formatMoney(rep.assets.totalAssets)} color="green" />
                  <StatBox label="Liabilities" value={formatMoney(rep.assets.liabilities)} color="red" />
                </>
              )}
              {rep.criminalCases !== undefined && (
                <StatBox 
                  label="Criminal Cases" 
                  value={rep.criminalCases.length.toString()} 
                  color={rep.criminalCases.length > 0 ? "red" : "green"} 
                />
              )}
            </div>
          </div>
        )}

        {/* Profile Stats */}
        {rep.profile && Object.keys(rep.profile).length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Performance
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {rep.profile.attendance != null && (
                <StatBox label="Attendance" value={`${rep.profile.attendance}%`} />
              )}
              {rep.profile.questionsAsked != null && (
                <StatBox label="Questions Asked" value={rep.profile.questionsAsked.toString()} />
              )}
              {rep.profile.debatesParticipated != null && (
                <StatBox label="Debates" value={rep.profile.debatesParticipated.toString()} />
              )}
              {rep.profile.billsIntroduced != null && (
                <StatBox label="Bills Introduced" value={rep.profile.billsIntroduced.toString()} />
              )}
            </div>
          </div>
        )}

        {/* Contact */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Contact Information
          </h4>
          <div className="space-y-2">
            {rep.contact?.email ? (
              <ContactRow icon="mail" label="Email" value={rep.contact.email} />
            ) : <span className="text-xs text-slate-400 italic">Email not available</span>}
            {rep.contact?.phone && (
              <ContactRow icon="phone" label="Phone" value={rep.contact.phone} />
            )}
            {rep.contact?.address && (
              <ContactRow icon="home" label="Address" value={rep.contact.address} />
            )}
          </div>
        </div>

        {/* Social Links */}
        {rep.socialLinks && Object.keys(rep.socialLinks).length > 0 && (
           <div>
             <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
               Social Links
             </h4>
             <div className="flex gap-2">
                {rep.socialLinks.twitter && (
                  <a href={rep.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-sm">Twitter/X</a>
                )}
                {rep.socialLinks.facebook && (
                  <a href={rep.socialLinks.facebook} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline text-sm">Facebook</a>
                )}
             </div>
           </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color?: "red"|"green" }) {
  const colorClass = color === "red" ? "text-red-600 dark:text-red-400" : color === "green" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-slate-100";
  return (
    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center border border-slate-100 dark:border-slate-800">
      <div className={`text-lg font-bold ${colorClass}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-slate-500 mt-1">{label}</div>
    </div>
  );
}

function ContactRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-slate-400 w-12 text-xs text-right uppercase tracking-wider">{label}</span>
      <span className="text-slate-700 dark:text-slate-300 truncate">{value}</span>
    </div>
  );
}
