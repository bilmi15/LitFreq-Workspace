/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import CorpusAnalyzer from "./components/CorpusAnalyzer";
import { PreloadedPoem, WordFrequency, ConcordanceLine } from "./types";
import { Activity, Layers, Award, GraduationCap } from "lucide-react";

export default function App() {
  // State synchronized from CorpusAnalyzer
  const [selectedPoem, setSelectedPoem] = useState<PreloadedPoem | null>(null);
  const [tokensCount, setTokensCount] = useState<number>(0);
  const [vocabDistinct, setVocabDistinct] = useState<number>(0);
  const [wordFrequencies, setWordFrequencies] = useState<WordFrequency[]>([]);
  const [sentimentLabel, setSentimentLabel] = useState<string>("Neutral");
  const [concordanceWord, setConcordanceWord] = useState<string>("hope");
  const [concordanceLines, setConcordanceLines] = useState<ConcordanceLine[]>([]);

  // Callback to sync NLP calculation pipeline state
  const handleAnalysisChange = (data: {
    selectedPoem: PreloadedPoem | null;
    tokensCount: number;
    vocabularyDistinct: number;
    wordFrequencies: WordFrequency[];
    sentimentLabel: string;
    concordanceWord: string;
    concordanceLines: ConcordanceLine[];
  }) => {
    setSelectedPoem(data.selectedPoem);
    setTokensCount(data.tokensCount);
    setVocabDistinct(data.vocabularyDistinct);
    setWordFrequencies(data.wordFrequencies);
    setSentimentLabel(data.sentimentLabel);
    setConcordanceWord(data.concordanceWord);
    setConcordanceLines(data.concordanceLines);
  };

  return (
    <div id="main_app_shell" className="min-h-screen bg-natural-cream text-natural-charcoal flex flex-col font-sans">
      
      {/* PROFESSIONAL UNIMED CAMPUS HEADER BANNER */}
      <header id="unimed_header" className="bg-natural-warm border-b border-natural-border text-natural-charcoal shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          <div className="flex items-center space-x-3.5">
            <div className="relative bg-white p-1 rounded-xl border border-natural-border shadow-sm flex items-center justify-center w-14 h-14 shrink-0 overflow-hidden">
              {/* Try loading official UNIMED logo */}
              <img 
                id="unimed_official_logo"
                src="https://unimed.ac.id/themes/unimed-template/assets/logo_unimed.png"
                alt="UNIMED Logo"
                className="w-12 h-12 object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  // Reveal the fallback icon beautifully
                  const fallback = document.getElementById("unimed_icon_fallback");
                  if (fallback) {
                    fallback.classList.remove("hidden");
                    fallback.classList.add("flex");
                  }
                }}
              />
              {/* Elegant fallback icon if image fails or is blocked */}
              <div 
                id="unimed_icon_fallback" 
                className="hidden absolute inset-0 bg-natural-olive text-natural-cream items-center justify-center w-full h-full"
              >
                <GraduationCap className="w-6 h-6 text-natural-cream" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-black bg-natural-olive/10 text-natural-olive py-0.5 px-2 rounded-full tracking-widest border border-natural-olive/30">
                  UAS Project VI-A
                </span>
                <span className="text-[10px] text-natural-charcoal/60">Semester VI Academic Year 2026</span>
              </div>
              <h1 className="text-base font-extrabold tracking-tight md:text-lg text-[#2C2A26] font-serif">
                UNIVERSITAS NEGERI MEDAN (UNIMED)
              </h1>
              <p className="text-[11px] text-[#8A8471] font-medium font-sans">
                Faculty of Languages and Arts &bull; English Literature Study Program
              </p>
            </div>
          </div>

          <div className="bg-white border border-natural-border p-3 rounded-xl max-w-sm flex items-start space-x-2.5 text-xs">
            <Award className="w-5 h-5 text-natural-terracotta shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-natural-charcoal leading-normal">
              <span className="font-bold text-[#2C2A26]">Course Assignment:</span>
              <p className="text-[11px] text-[#8A8471]">Artificial Intelligence for English Language &amp; Literary Works</p>
            </div>
          </div>

        </div>
      </header>

      {/* CORE WORKSPACE NAVIGATION & STATUS INDICATOR */}
      <div id="tab_navigation_bar" className="bg-natural-warm border-b border-natural-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-14">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-natural-olive" />
            <span className="text-xs font-extrabold tracking-wider uppercase text-natural-charcoal">Corpus Analysis Workspace</span>
          </div>

          {/* Quick Realtime Corpus Stats pill on far edge of Tab bar */}
          {selectedPoem && (
            <div id="quick_statusBar" className="hidden border border-natural-border sm:flex items-center space-x-2 bg-white py-1.5 px-3 rounded-full text-[10px] font-mono text-[#8A8471]">
              <Activity className="w-3.5 h-3.5 text-natural-olive animate-pulse" />
              <span>Active: <span className="font-bold text-[#2C2A26]">{selectedPoem.title.split(":")[0]}</span></span>
              <span>&bull;</span>
              <span>Tokens: <span className="font-bold text-[#2C2A26]">{tokensCount}</span></span>
              <span>&bull;</span>
              <span>Mood: <span className="font-bold text-natural-terracotta uppercase">{sentimentLabel}</span></span>
            </div>
          )}
        </div>
      </div>

      {/* MAIN RENDER AREA FRAME */}
      <main id="workspace_viewport" className="flex-grow max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full">
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-sm space-y-1.5 mb-2">
            <h2 className="text-base font-extrabold text-[#2C2A26] font-serif">LitFreq Workspace</h2>
            <p className="text-xs text-[#8A8471] leading-relaxed">
              Analyze and inspect word counts, suffix stem variations, and Keyword-in-Context concordance alignments of standard poetry, short stories (cerpen), and classical novel excerpts.
            </p>
          </div>
          <CorpusAnalyzer onAnalysisChange={handleAnalysisChange} />
        </div>
      </main>

      {/* FOOTER METADATA (Quiet and Professional) */}
      <footer id="simple_workspace_footer" className="bg-natural-warm border-t border-natural-border py-6 text-center text-xs text-[#8A8471]">
        <div className="max-w-7xl mx-auto px-4">
          <p>&copy; 2026 Universitas Negeri Medan English Literature Department &bull; Literary Corpus Analysis Studio</p>
          <p className="text-[10px] text-[#A8A28E] mt-1">
            Engineered aligned with terminal final semester examination (UAS) specifications. AI Studio dev container workspace.
          </p>
        </div>
      </footer>

    </div>
  );
}
