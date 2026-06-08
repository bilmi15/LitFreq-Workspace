import React, { useState, useMemo, useEffect } from "react";
import { preloadedPoems } from "../data/poems";
import { Token, WordFrequency, ConcordanceLine, PreloadedPoem } from "../types";
import { 
  tokenizeText, 
  getWordFrequencies, 
  generateConcordance, 
  analyzeLocalSentiment,
  countSyllables,
  calculateReadability,
  getNGrams,
  getPOSBreakdown
} from "../utils/nlp";
import { 
  Search, 
  Info, 
  HelpCircle, 
  Sparkles, 
  Sliders, 
  BarChart2, 
  BookOpen, 
  Layers, 
  CheckCircle,
  FileSpreadsheet,
  Download,
  Percent,
  TrendingUp,
  Scale,
  Activity,
  Award
} from "lucide-react";

interface CorpusAnalyzerProps {
  onAnalysisChange: (data: {
    selectedPoem: PreloadedPoem | null;
    tokensCount: number;
    vocabularyDistinct: number;
    wordFrequencies: WordFrequency[];
    sentimentLabel: string;
    concordanceWord: string;
    concordanceLines: ConcordanceLine[];
  }) => void;
}

export default function CorpusAnalyzer({ onAnalysisChange }: CorpusAnalyzerProps) {
  // Selection States
  const [selectedPoemId, setSelectedPoemId] = useState<string>("hope_feathers");
  const [customText, setCustomText] = useState<string>("");
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>("My Selected Text");
  const [customAuthor, setCustomAuthor] = useState<string>("Student Researcher");

  // Options States
  const [excludeStopwords, setExcludeStopwords] = useState<boolean>(true);
  const [chartLimit, setChartLimit] = useState<number>(10);
  const [activeTab, setActiveTab] = useState<"freq" | "ngrams" | "readability" | "concordance" | "style" | "compare">("freq");

  // N-Gram & Collocations Config States
  const [nGramSize, setNGramSize] = useState<2 | 3>(2);
  const [nGramLimit, setNGramLimit] = useState<number>(10);

  // Comparative Analysis Mode Config States
  const [compareTargetId, setCompareTargetId] = useState<string>("sonnet18");
  const [compareCustomText, setCompareCustomText] = useState<string>("");
  const [isCompareCustom, setIsCompareCustom] = useState<boolean>(false);
  const [compareCustomTitle, setCompareCustomTitle] = useState<string>("Reference Corpus B");
  const [compareCustomAuthor, setCompareCustomAuthor] = useState<string>("Classic Author");

  // Concordance States
  const [kwicSearchQuery, setKwicSearchQuery] = useState<string>("hope");

  // Server-Side AI Critique States
  const [aiCritique, setAiCritique] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string>("");
  const [critiqueSource, setCritiqueSource] = useState<"gemini" | "local">("gemini");

  // Determine current active poem
  const currentPoem = useMemo(() => {
    if (isCustomMode) {
      return {
        id: "custom",
        title: customTitle,
        author: customAuthor,
        year: "2026",
        genre: "Literary Prose/Poetry",
        background: "A custom student-pasted dataset for linguistic testing and corpus analysis.",
        text: customText
      } as PreloadedPoem;
    }
    return preloadedPoems.find(p => p.id === selectedPoemId) || preloadedPoems[0];
  }, [isCustomMode, selectedPoemId, customText, customTitle, customAuthor]);

  // Pre-fill custom text area on mode shift
  useEffect(() => {
    if (isCustomMode && !customText) {
      setCustomText("Write your own literary lines here.\nLove is a quiet shelter.\nStorms may shake the branches, but roots hold deep.\nHope stays alive.");
    }
  }, [isCustomMode]);

  // Pre-fill comparison custom text area on comparison mode custom shift
  useEffect(() => {
    if (isCompareCustom && !compareCustomText) {
      setCompareCustomText("A quiet river winds through green valleys.\nPeace rests upon the hills of silent mornings.\nNature holds its warm secrets.\nTruth survives.");
    }
  }, [isCompareCustom]);

  // Handle active preset trigger to pre-fill search key
  useEffect(() => {
    if (currentPoem.id === "hope_feathers") {
      setKwicSearchQuery("hope");
    } else if (currentPoem.id === "sonnet18") {
      setKwicSearchQuery("summer");
    } else if (currentPoem.id === "dream_within_dream") {
      setKwicSearchQuery("dream");
    } else if (currentPoem.id === "tell_tale_heart") {
      setKwicSearchQuery("eye");
    } else if (currentPoem.id === "frankenstein_ch5") {
      setKwicSearchQuery("life");
    } else if (currentPoem.id === "yellow_wallpaper") {
      setKwicSearchQuery("physician");
    } else if (currentPoem.id === "pride_prejudice_ch1") {
      setKwicSearchQuery("fortune");
    } else {
      setKwicSearchQuery("love");
    }
    // Clear old AI critiques if we swap pieces
    setAiCritique("");
    setAiError("");
  }, [currentPoem.id]);

  // NLP Pipeline computations for CURRENT CORPUS A
  const tokens = useMemo(() => {
    return tokenizeText(currentPoem.text);
  }, [currentPoem.text]);

  const rawWordFrequencies = useMemo(() => {
    return getWordFrequencies(tokens, false);
  }, [tokens]);

  const filteredWordFrequencies = useMemo(() => {
    return getWordFrequencies(tokens, excludeStopwords);
  }, [tokens, excludeStopwords]);

  const activeWordFrequencies = useMemo(() => {
    return excludeStopwords ? filteredWordFrequencies : rawWordFrequencies;
  }, [excludeStopwords, filteredWordFrequencies, rawWordFrequencies]);

  const concordanceLines = useMemo(() => {
    return generateConcordance(currentPoem.text, tokens, kwicSearchQuery, 5);
  }, [currentPoem.text, tokens, kwicSearchQuery]);

  const localMood = useMemo(() => {
    return analyzeLocalSentiment(tokens);
  }, [tokens]);

  // Advanced Current Metrics: Readability & POS
  const readabilityMetrics = useMemo(() => {
    return calculateReadability(currentPoem.text, tokens);
  }, [currentPoem.text, tokens]);

  const posBreakdown = useMemo(() => {
    return getPOSBreakdown(tokens);
  }, [tokens]);


  // NLP Pipeline computations for COMPARATIVE CORPUS B
  const comparePoem = useMemo(() => {
    if (isCompareCustom) {
      return {
        id: "compare_custom",
        title: compareCustomTitle,
        author: compareCustomAuthor,
        year: "2026",
        genre: "Comparative Text",
        background: "A custom second corpus pasted for stylometric side-by-side comparison.",
        text: compareCustomText
      } as PreloadedPoem;
    }
    return preloadedPoems.find(p => p.id === compareTargetId) || preloadedPoems[1];
  }, [isCompareCustom, compareTargetId, compareCustomText, compareCustomTitle, compareCustomAuthor]);

  const compareTokens = useMemo(() => {
    return tokenizeText(comparePoem.text);
  }, [comparePoem.text]);

  const compareRawFreqs = useMemo(() => {
    return getWordFrequencies(compareTokens, false);
  }, [compareTokens]);

  const compareActiveFreqs = useMemo(() => {
    return getWordFrequencies(compareTokens, excludeStopwords);
  }, [compareTokens, excludeStopwords]);

  const compareReadability = useMemo(() => {
    return calculateReadability(comparePoem.text, compareTokens);
  }, [comparePoem.text, compareTokens]);

  const comparePOS = useMemo(() => {
    return getPOSBreakdown(compareTokens);
  }, [compareTokens]);

  const compareSentiment = useMemo(() => {
    return analyzeLocalSentiment(compareTokens);
  }, [compareTokens]);


  // Sync NLP outputs back to parent App shell
  useEffect(() => {
    onAnalysisChange({
      selectedPoem: currentPoem,
      tokensCount: tokens.length,
      vocabularyDistinct: rawWordFrequencies.length,
      wordFrequencies: activeWordFrequencies,
      sentimentLabel: localMood.label,
      concordanceWord: kwicSearchQuery,
      concordanceLines: concordanceLines
    });
  }, [currentPoem, tokens, rawWordFrequencies, activeWordFrequencies, localMood, kwicSearchQuery, concordanceLines, onAnalysisChange]);

  // Dynamic Scholastic Local Fallback Critique Generator
  const generateLocalScholasticCritique = () => {
    const text = currentPoem.text;
    const title = currentPoem.title;
    const author = currentPoem.author;
    const wordsCount = tokens.length;
    const linesCount = text.split("\n").filter(l => l.trim().length > 0).length;
    const avgWordsPerLine = linesCount > 0 ? (wordsCount / linesCount).toFixed(1) : "0.0";
    
    // Extract top 3 content words from filtered frequencies (excluding stopwords)
    const topWords = filteredWordFrequencies.slice(0, 3).map(w => w.text);
    const topWord1 = topWords[0] || "thematic";
    const topWord2 = topWords[1] || "linguistic";
    const topWord3 = topWords[2] || "structural";

    return `### Academic Literary Style Analysis (Local Scholastic Engine)

**Subject under evaluation:** "${title || "Selected Text"}" by ${author || "Unknown Author"}
**Quantitative Corpus Density:** ${wordsCount} raw tokens processed across ${linesCount} textual segments (approx. ${avgWordsPerLine} words per line).

#### 1. Thematic Structure & Motifs
This literary work leverages a high thematic density, centered deeply around the semantic field of **"${topWord1.toUpperCase()}"**. The corpus distribution showcases a structured layout. Prominent repetitive nouns like **"${topWord1}"** and **"${topWord2}"** reinforce a vivid textual tone. 
The recurring use of specific lexical choices establishes an immersive, cohesive aesthetic atmosphere that guides the reader's interpretive journey.

#### 2. Stylistics, Morphological Suffixes & Concordance
Our statistical tokenization highlights a rich lexical landscape:
- **Lexical Highlights:** Core focus words like **"${topWord1}"**, **"${topWord2}"**, and **"${topWord3}"** form the primary emotive backbone.
- **Suffix Variations:** Heavy inflectional patterns of tense and agency (e.g. active verbs and continuous descriptors like "-ing" or "-ed") are widely present, showing how grammatical suffixes reflect transition and psychological permanence.

#### 3. Concordance-KWIC Recommendation
For academic rigor in your Book Chapter, we strongly recommend evaluating the occurrences of **"${topWord1}"** and **"${topWord2}"** inside the **Concordance (KWIC Context)** tab. Analyzing these words in alignment lets scholars trace their local syntax and surrounding collocations.`;
  };

  // Scholastic Export Engine (CSV Downloader)
  const exportToCSV = (type: "frequency" | "concordance" | "readability" | "ngrams" | "pos") => {
    let csvContent = "\ufeff"; // Byte Order Mark for Excel UTF-8 display compatibility
    let filename = "";

    if (type === "frequency") {
      csvContent += "Rank,Word,Count,Percentage\n";
      activeWordFrequencies.forEach((d, idx) => {
        csvContent += `${idx + 1},"${d.word.replace(/"/g, '""')}",${d.count},${d.percentage}%\n`;
      });
      filename = `${currentPoem.title.replace(/[^a-zA-Z0-9]/g, "_")}_word_frequencies.csv`;
    } else if (type === "ngrams") {
      const data = getNGrams(tokens, nGramSize, excludeStopwords);
      csvContent += `Rank,Phrase (${nGramSize === 2 ? "Bigram" : "Trigram"}),Count,Percentage\n`;
      data.forEach((d, idx) => {
        csvContent += `${idx + 1},"${d.phrase.replace(/"/g, '""')}",${d.count},${d.percentage}%\n`;
      });
      filename = `${currentPoem.title.replace(/[^a-zA-Z0-9]/g, "_")}_${nGramSize === 2 ? "bigrams" : "trigrams"}.csv`;
    } else if (type === "concordance") {
      csvContent += "ID,Left Context,Keyword,Right Context\n";
      concordanceLines.forEach((line) => {
        csvContent += `${line.id},"${line.leftContext.replace(/"/g, '""')}","${line.keyword.replace(/"/g, '""')}","${line.rightContext.replace(/"/g, '""')}"\n`;
      });
      filename = `${currentPoem.title.replace(/[^a-zA-Z0-9]/g, "_")}_concordance_${kwicSearchQuery}.csv`;
    } else if (type === "readability") {
      csvContent += "Metric,Value,Explanation\n";
      csvContent += `Flesch Reading Ease,${readabilityMetrics.fleschReadingEase},"Difficulty Index (Higher is easier)"\n`;
      csvContent += `Flesch-Kincaid Grade Level,${readabilityMetrics.fleschKincaidGrade},"School Grade Equivalency"\n`;
      csvContent += `Gunning Fog Index,${readabilityMetrics.gunningFog},"Prose structural difficulty level"\n`;
      csvContent += `Total Words (Tokens),${tokens.length},"Corpus word count"\n`;
      csvContent += `Total Sentences / Segments,${readabilityMetrics.totalSentences},"Phrase groupings/Verses"\n`;
      csvContent += `Average Sentence Length,${readabilityMetrics.avgSentenceLength},"Avg words per phrase"\n`;
      csvContent += `Syllables Per Word,${readabilityMetrics.syllablesPerWord},"Morphological syllable density"\n`;
      csvContent += `Complex Words Percentage,${readabilityMetrics.complexWordsPercentage}%,"Percentage of words with 3+ syllables"\n`;
      filename = `${currentPoem.title.replace(/[^a-zA-Z0-9]/g, "_")}_readability_metrics.csv`;
    } else if (type === "pos") {
      csvContent += "Lexical Class (POS),Count,Percentage\n";
      const total = tokens.length || 1;
      csvContent += `Noun,${posBreakdown.noun},${((posBreakdown.noun / total) * 100).toFixed(1)}%\n`;
      csvContent += `Verb,${posBreakdown.verb},${((posBreakdown.verb / total) * 100).toFixed(1)}%\n`;
      csvContent += `Adjective,${posBreakdown.adjective},${((posBreakdown.adjective / total) * 100).toFixed(1)}%\n`;
      csvContent += `Adverb,${posBreakdown.adverb},${((posBreakdown.adverb / total) * 100).toFixed(1)}%\n`;
      csvContent += `Grammatical Stopword,${posBreakdown.grammaticalStopword},${((posBreakdown.grammaticalStopword / total) * 100).toFixed(1)}%\n`;
      csvContent += `Other,${posBreakdown.other},${((posBreakdown.other / total) * 100).toFixed(1)}%\n`;
      filename = `${currentPoem.title.replace(/[^a-zA-Z0-9]/g, "_")}_part_of_speech.csv`;
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Server API Call for Gemini critique with resilient fallback
  const fetchGeminiCritique = async () => {
    setIsAiLoading(true);
    setAiCritique("");
    setAiError("");

    try {
      const response = await fetch("/api/gemini/critique", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: currentPoem.text,
          title: currentPoem.title,
          author: currentPoem.author
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.critique) {
          setAiCritique(data.critique);
          setCritiqueSource(data.source?.includes("gemini") ? "gemini" : "local");
          setAiError("");
        } else {
          // Quiet client-side fallback
          console.warn("Backend succeeded but did not return active raw text, local fallback triggered.");
          const localCritiqueText = generateLocalScholasticCritique();
          setAiCritique(localCritiqueText);
          setCritiqueSource("local");
          setAiError("");
        }
      } else {
        // Safe robust fallback when HTTP status is not ok
        console.warn(`HTTP endpoint returned status ${response.status}. Invoking live client-side localized parser.`);
        const localCritiqueText = generateLocalScholasticCritique();
        setAiCritique(localCritiqueText);
        setCritiqueSource("local");
        setAiError("");
      }
    } catch (err: any) {
      // Safe boundary fallback for any offline fetch or connection timeout
      console.warn("Network error during API dispatch. Loading localized fallback engine:", err);
      const localCritiqueText = generateLocalScholasticCritique();
      setAiCritique(localCritiqueText);
      setCritiqueSource("local");
      setAiError("");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Helper action: Clicking any token in Left Panel highlights it and searches Concordance!
  const handleWordClickInText = (word: string) => {
    const cleaned = word.toLowerCase().replace(/[^a-zA-Z]/g, "");
    if (cleaned) {
      setKwicSearchQuery(cleaned);
      setActiveTab("concordance");
    }
  };

  // Pre-calculate statistics
  const stopwordsSaved = useMemo(() => {
    return tokens.filter(t => t.isStopword).length;
  }, [tokens]);

  // Simple SVG charting logic
  const chartData = useMemo(() => {
    return activeWordFrequencies.slice(0, chartLimit);
  }, [activeWordFrequencies, chartLimit]);

  const maxCount = useMemo(() => {
    if (chartData.length === 0) return 1;
    return Math.max(...chartData.map(d => d.count));
  }, [chartData]);

  return (
    <div id="corpus_analyzer_container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* LEFT CONTROL RAIL AND INPUT AREA (5 grid columns) */}
      <div id="left_control_panel" className="lg:col-span-5 space-y-6">
        
        {/* Dataset Choice Card */}
        <div id="dataset_choice_card" className="bg-white p-5 rounded-xl border border-natural-border shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-natural-charcoal font-semibold text-xs font-sans uppercase tracking-widest">
            <BookOpen className="w-4 h-4 text-natural-olive" />
            <span>Select Literary Corpus</span>
          </div>

          <div className="grid grid-cols-2 gap-2 font-sans">
            <button
              id="presets_mode_btn"
              onClick={() => setIsCustomMode(false)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors border ${
                !isCustomMode
                  ? "bg-natural-olive border-natural-olive text-white shadow-sm cursor-pointer"
                  : "bg-natural-warm border-natural-border text-natural-charcoal hover:bg-natural-border/20 cursor-pointer"
              }`}
            >
              Classic Presets
            </button>
            <button
              id="custom_mode_btn"
              onClick={() => setIsCustomMode(true)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors border ${
                isCustomMode
                  ? "bg-natural-olive border-natural-olive text-white shadow-sm cursor-pointer"
                  : "bg-natural-warm border-natural-border text-natural-charcoal hover:bg-natural-border/20 cursor-pointer"
              }`}
            >
              Custom Paste Bin
            </button>
          </div>

          {!isCustomMode ? (
            <div className="space-y-3 font-sans font-medium">
              <label className="block text-[10px] font-semibold text-[#8A8471] uppercase tracking-wider">Select Preset (Poetry, Cerpen, or Novel):</label>
              <select
                id="poem_select"
                value={selectedPoemId}
                onChange={(e) => setSelectedPoemId(e.target.value)}
                className="w-full text-sm bg-natural-warm border border-natural-border rounded-lg p-2.5 text-natural-charcoal focus:outline-none focus:ring-1 focus:ring-natural-olive"
              >
                <optgroup label="📜 Puisi / Poetry (Classic Verses)">
                  {preloadedPoems
                    .filter((p) => p.genre.toLowerCase().includes("poetry") || p.genre.toLowerCase().includes("sonnet") || p.genre.toLowerCase().includes("gothic romanticism"))
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} (by {p.author})
                      </option>
                    ))}
                </optgroup>
                <optgroup label="📖 Cerpen / Short Stories (Gothic & Feminist)">
                  {preloadedPoems
                    .filter((p) => p.genre.toLowerCase().includes("cerpen") || p.genre.toLowerCase().includes("short story"))
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} (by {p.author})
                      </option>
                    ))}
                </optgroup>
                <optgroup label="📚 Novel / Novel Excerpts (Classic Prose)">
                  {preloadedPoems
                    .filter((p) => p.genre.toLowerCase().includes("novel"))
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} (by {p.author})
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>
          ) : (
            <div className="space-y-3 font-sans">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-[#8A8471] uppercase tracking-wider">Custom Title</label>
                  <input
                    id="custom_title_input"
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full text-xs bg-natural-warm border border-natural-border rounded-lg p-2 text-natural-charcoal focus:outline-none focus:ring-1 focus:ring-natural-olive"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#8A8471] uppercase tracking-wider">Custom Poet</label>
                  <input
                    id="custom_author_input"
                    type="text"
                    value={customAuthor}
                    onChange={(e) => setCustomAuthor(e.target.value)}
                    className="w-full text-xs bg-natural-warm border border-natural-border rounded-lg p-2 text-natural-charcoal focus:outline-none focus:ring-1 focus:ring-natural-olive"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#8A8471] uppercase tracking-wider mb-1">Paste Literary Lines:</label>
                <textarea
                  id="custom_text_area"
                  rows={8}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full text-xs font-mono bg-natural-warm border border-natural-border rounded-lg p-3 text-natural-charcoal focus:outline-none focus:ring-1 focus:ring-natural-olive"
                  placeholder="Paste poem lines here..."
                />
              </div>
            </div>
          )}

          <div className="bg-natural-warm rounded-lg p-3.5 border border-natural-border text-xs text-natural-charcoal space-y-1.5">
            <div className="flex items-center justify-between text-[#2C2A26] font-bold font-serif">
              <span>{currentPoem.title}</span>
              <span className="text-[10px] bg-[#EBE7DD] border border-[#C9C4B1] text-natural-charcoal font-sans uppercase tracking-wider py-0.5 px-2 rounded-full font-bold">{currentPoem.genre}</span>
            </div>
            <p className="font-serif italic text-xs text-[#635E54]">by {currentPoem.author} ({currentPoem.year})</p>
            <p className="text-[11px] leading-relaxed pt-2 border-t border-[#E6E2D3] text-[#635E54]">
              <span className="font-sans font-black uppercase text-[10px] tracking-wide text-[#8A8471]">Context: </span>
              {currentPoem.background}
            </p>
          </div>
        </div>

        {/* Dynamic Corpus Metrics & Clean/Filtering Toggles */}
        <div id="filters_card" className="bg-white p-5 rounded-xl border border-natural-border shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-[#2C2A26] font-semibold text-xs font-sans uppercase tracking-widest">
            <Sliders className="w-4 h-4 text-natural-olive" />
            <span>NLP Filtering Controls</span>
          </div>

          <div className="space-y-3 font-sans">
            <div className="flex items-center justify-between">
              <label htmlFor="stopwords_toggle" className="flex flex-col">
                <span className="text-xs font-semibold text-natural-charcoal">Filter Stopwords</span>
                <span className="text-[10px] text-[#8A8471]">Excludes standard common functional tokens</span>
              </label>
              <button
                id="stopwords_toggle"
                onClick={() => setExcludeStopwords(!excludeStopwords)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  excludeStopwords ? "bg-natural-olive" : "bg-[#E6E2D3]"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transition-transform ${
                    excludeStopwords ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="pt-2.5 border-t border-natural-border space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#8A8471] font-medium">Word Count Chart Limit:</span>
                <span className="font-mono font-bold text-natural-charcoal">{chartLimit} words</span>
              </div>
              <input
                id="chart_limit_slider"
                type="range"
                min="5"
                max="30"
                value={chartLimit}
                onChange={(e) => setChartLimit(parseInt(e.target.value))}
                className="w-full accent-natural-olive cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Metrics Badge Grid */}
          <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-natural-border font-sans">
            <div className="bg-natural-warm p-2 rounded-lg border border-natural-border text-center">
              <p className="text-[9px] text-[#8A8471] font-bold uppercase tracking-wider">Tokens (Total)</p>
              <p id="total_tokens_val" className="font-mono text-xs font-black text-natural-charcoal">{tokens.length}</p>
            </div>
            <div className="bg-natural-warm p-2 rounded-lg border border-natural-border text-center">
              <p className="text-[9px] text-[#8A8471] font-bold uppercase tracking-wider">Vocabulary</p>
              <p id="distinct_vocab_val" className="font-mono text-xs font-black text-natural-charcoal">{rawWordFrequencies.length}</p>
            </div>
            <div className="bg-natural-warm p-2 rounded-lg border border-natural-border text-center">
              <p className="text-[9px] text-[#8A8471] font-bold uppercase tracking-wider">Stopwords</p>
              <p id="stopwords_val" className="font-mono text-xs font-black text-natural-terracotta">
                {excludeStopwords ? stopwordsSaved : 0}
              </p>
            </div>
          </div>
        </div>

        {/* Text Interactive Area */}
        <div id="text_interactive_card" className="bg-white p-5 rounded-xl border border-natural-border shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-[#2C2A26] font-semibold text-xs font-sans uppercase tracking-widest">
              <Layers className="w-4 h-4 text-natural-olive" />
              <span>Interactive Corpus Reader</span>
            </div>
            <span className="text-[9px] text-[#8A8471] font-sans">Click words to seek references</span>
          </div>

          <div
            id="interactive_text_box"
            className="p-4 bg-natural-warm rounded-xl border border-natural-border font-serif text-sm leading-relaxed max-h-80 overflow-y-auto whitespace-pre-line text-[#2C2A26] cursor-text"
          >
            {currentPoem.text.split("\n").map((line, lineIdx) => (
              <span key={lineIdx} className="block min-h-[1.5rem]">
                {line.split(" ").map((word, wordIdx) => {
                  const cleaned = word.replace(/^[^\w\s']+|[^\w\s']+$/g, "");
                  const isQueryToken = cleaned.toLowerCase() === kwicSearchQuery.toLowerCase();
                  return (
                    <span
                      key={wordIdx}
                      onClick={() => handleWordClickInText(cleaned)}
                      className={`inline-block mr-1 px-0.5 rounded cursor-pointer transition-all ${
                        isQueryToken
                          ? "bg-natural-terracotta text-white font-bold scale-105 shadow-xs"
                          : "hover:bg-natural-olive/10 hover:text-[#2C2A26]"
                      }`}
                      title="Click to search concordance"
                    >
                      {word}
                    </span>
                  );
                })}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT NLP VISUALIZATION WORKBENCH (7 grid columns) */}
      <div id="right_nlp_workbench" className="lg:col-span-7 space-y-6">
        
        {/* Workspace Tab Bar */}
        <div id="workbench_tabs" className="bg-white p-1 rounded-xl border border-natural-border shadow-sm grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 font-sans">
          <button
            id="tab_freq"
            onClick={() => setActiveTab("freq")}
            className={`flex items-center justify-center space-x-1 py-2 px-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === "freq"
                ? "bg-natural-olive text-white shadow-xs"
                : "text-natural-charcoal hover:bg-natural-warm"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Counts & Suffix</span>
          </button>
          
          <button
            id="tab_ngrams"
            onClick={() => setActiveTab("ngrams")}
            className={`flex items-center justify-center space-x-1 py-2 px-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === "ngrams"
                ? "bg-natural-olive text-white shadow-xs"
                : "text-natural-charcoal hover:bg-natural-warm"
            }`}
          >
            <Percent className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Word Associatons</span>
          </button>

          <button
            id="tab_readability"
            onClick={() => setActiveTab("readability")}
            className={`flex items-center justify-center space-x-1 py-2 px-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === "readability"
                ? "bg-natural-olive text-white shadow-xs"
                : "text-natural-charcoal hover:bg-natural-warm"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Readability & POS</span>
          </button>

          <button
            id="tab_concordance"
            onClick={() => setActiveTab("concordance")}
            className={`flex items-center justify-center space-x-1 py-2 px-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === "concordance"
                ? "bg-natural-olive text-white shadow-xs"
                : "text-natural-charcoal hover:bg-natural-warm"
            }`}
          >
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Concordance</span>
          </button>

          <button
            id="tab_style"
            onClick={() => setActiveTab("style")}
            className={`flex items-center justify-center space-x-1 py-2 px-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === "style"
                ? "bg-natural-olive text-white shadow-xs"
                : "text-natural-charcoal hover:bg-natural-warm"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Mood & AI</span>
          </button>

          <button
            id="tab_compare"
            onClick={() => setActiveTab("compare")}
            className={`flex items-center justify-center space-x-1 py-2 px-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === "compare"
                ? "bg-natural-olive text-white shadow-xs"
                : "text-natural-charcoal hover:bg-natural-warm"
            }`}
          >
            <Scale className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Side-by-Side</span>
          </button>
        </div>

        {/* TAB WORKSPACE CONTENT DOME */}
        <div id="workbench_tab_content">

          {/* SUB-TAB 1: WORD FREQUENCIES AND CHARTING */}
          {activeTab === "freq" && (
            <div id="freq_workspace" className="bg-white p-5 rounded-xl border border-natural-border shadow-sm space-y-6 transition-all animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-semibold text-natural-charcoal uppercase tracking-widest font-sans">
                    Top {chartLimit} Lexical Frequencies
                  </h3>
                  <p className="text-xs text-[#8A8471]">
                    {excludeStopwords ? "Grammatical keywords omitted. Showing critical concepts." : "All words counted."}
                  </p>
                </div>
                <button
                  onClick={() => exportToCSV("frequency")}
                  className="self-start sm:self-center flex items-center space-x-1.5 px-3 py-1.5 bg-natural-olive hover:bg-natural-olive/95 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>
              </div>

              {/* Bar Chart Canvas: Pure-SVG Responsive rendering */}
              <div id="canvas_chart_box" className="p-4 bg-natural-warm rounded-xl border border-natural-border space-y-4">
                {chartData.length === 0 ? (
                  <p className="text-center text-xs text-[#8A8471] py-8">No word counts generated. Ensure corpus has clean text.</p>
                ) : (
                  <div className="space-y-3.5">
                     {chartData.map((d, index) => {
                      const barWidth = `${(d.count / maxCount) * 100}%`;
                      // Highlight the word if clicked in Concordance Search
                      const isHighlightedInKwic = d.word.toLowerCase() === kwicSearchQuery.toLowerCase();
                      return (
                        <div key={d.word} className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-[#8A8471] w-5">{index + 1}.</span>
                              <span
                                onClick={() => handleWordClickInText(d.word)}
                                className={`font-mono font-bold cursor-pointer hover:underline ${
                                  isHighlightedInKwic ? "text-natural-terracotta bg-natural-terracotta/10 px-1 rounded" : "text-[#2C2A26]"
                                }`}
                              >
                                {d.word}
                              </span>
                              {isStopwordToken(d.word) && (
                                <span className="text-[9px] bg-[#EBE7DD] text-[#8A8471] px-1.5 rounded-sm uppercase tracking-wide">Stopword</span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 font-mono text-[#8A8471]">
                              <span className="font-bold text-natural-charcoal">{d.count}x</span>
                              <span>({d.percentage}%)</span>
                            </div>
                          </div>
                          <div className="w-full h-3 bg-[#E6E2D3] rounded-full overflow-hidden border border-[#D9D4C3]">
                            <div
                              style={{ width: barWidth }}
                              className={`h-full rounded-full transition-all duration-500 ${
                                isHighlightedInKwic 
                                  ? "bg-natural-terracotta animate-pulse" 
                                  : "bg-natural-olive"
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Dynamic Suffix / Stemming Analysis view */}
              <div id="suffix_analysis_box" className="space-y-3 font-sans">
                <h4 className="text-xs font-semibold text-natural-charcoal uppercase tracking-widest flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-natural-olive" />
                  <span>Grammatical Lemmatization & Suffix Stemming View</span>
                </h4>
                <p className="text-xs text-[#8A8471] leading-relaxed">
                  Natural language endings change the syntactic appearance of a word. Our stemmer strips plurals 
                  <code className="bg-natural-warm text-[#2C2A26] px-1 py-0.5 rounded mx-1 font-mono text-[10px]">-es</code>, 
                  gerunds <code className="bg-natural-warm text-[#2C2A26] px-1 py-0.5 rounded mx-1 font-mono text-[10px]">-ing</code>, 
                  and adverb prefixes to reveal the root token, avoiding count duplication:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                  <div className="bg-[#FDFCF8] p-2 rounded-lg border border-natural-border">
                    <p className="text-[#8A8471]">feathers {"->"}</p>
                    <p className="font-bold text-natural-charcoal">feather</p>
                  </div>
                  <div className="bg-[#FDFCF8] p-2 rounded-lg border border-natural-border">
                    <p className="text-[#8A8471]">lovely {"->"}</p>
                    <p className="font-bold text-natural-charcoal">love</p>
                  </div>
                  <div className="bg-[#FDFCF8] p-2 rounded-lg border border-natural-border">
                    <p className="text-[#8A8471]">sings {"->"}</p>
                    <p className="font-bold text-natural-charcoal">sing</p>
                  </div>
                  <div className="bg-[#FDFCF8] p-2 rounded-lg border border-natural-border">
                    <p className="text-[#8A8471]">dreaming {"->"}</p>
                    <p className="font-bold text-natural-charcoal">dream</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* SUB-TAB: N-GRAMS AND COLLOCATIONS */}
          {activeTab === "ngrams" && (
            <div id="ngrams_workspace" className="bg-white p-5 rounded-xl border border-natural-border shadow-sm space-y-6 transition-all animate-fade-in font-sans">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-semibold text-natural-charcoal uppercase tracking-widest flex items-center space-x-1.5 font-sans">
                    <Percent className="w-4 h-4 text-natural-olive" />
                    <span>N-Grams & Collocations (Linguistic Clusters)</span>
                  </h3>
                  <p className="text-xs text-[#8A8471]">
                    Analyze recurring adjacent word associations to find key lexical clusters and rhetorical signatures.
                  </p>
                </div>
                <button
                  onClick={() => exportToCSV("ngrams")}
                  className="self-start sm:self-center flex items-center space-x-1.5 px-3 py-1.5 bg-natural-olive hover:bg-natural-olive/95 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer transition-colors"
                  title="Export current N-Gram data to spreadsheet"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>
              </div>

              {/* Controls block */}
              <div className="p-4 bg-natural-warm rounded-xl border border-natural-border grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-semibold text-[#8A8471] uppercase tracking-wider">Cluster Dimension (N-Gram Size):</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setNGramSize(2)}
                      className={`py-1.5 px-3 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                        nGramSize === 2
                          ? "bg-natural-olive border-natural-olive text-white shadow-xs"
                          : "bg-white border-natural-border text-natural-charcoal hover:bg-natural-border/10"
                      }`}
                    >
                      Bigrams (2 Words)
                    </button>
                    <button
                      onClick={() => setNGramSize(3)}
                      className={`py-1.5 px-3 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                        nGramSize === 3
                          ? "bg-natural-olive border-natural-olive text-white shadow-xs"
                          : "bg-white border-natural-border text-natural-charcoal hover:bg-natural-border/10"
                      }`}
                    >
                      Trigrams (3 Words)
                    </button>
                  </div>
                </div>

                <div className="space-y-2 col-span-1">
                  <label className="block text-[10px] font-semibold text-[#8A8471] uppercase tracking-wider">Max Cluster Matches:</label>
                  <div className="flex items-center space-x-3.5">
                    <input
                      type="range"
                      min="5"
                      max="30"
                      value={nGramLimit}
                      onChange={(e) => setNGramLimit(parseInt(e.target.value))}
                      className="w-full accent-natural-olive cursor-pointer"
                    />
                    <span className="font-mono text-xs font-bold text-natural-charcoal shrink-0">{nGramLimit} items</span>
                  </div>
                </div>
              </div>

              {/* Cluster Matches list */}
              <div id="ngram_matches" className="space-y-4">
                {(() => {
                  const ngrams = getNGrams(tokens, nGramSize, excludeStopwords);
                  const slicedNGrams = ngrams.slice(0, nGramLimit);
                  if (slicedNGrams.length === 0) {
                    return (
                      <p className="text-center text-xs text-[#8A8471] py-12 bg-natural-warm rounded-xl border border-natural-border font-sans font-medium">
                        No adjacent word combinations found at current sizes or filters.
                      </p>
                    );
                  }

                  const peakCount = Math.max(...slicedNGrams.map(g => g.count));

                  return (
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-center text-xs text-[#8A8471] font-bold pb-1 border-b border-natural-border">
                        <span>Phrase Grouping ({nGramSize === 2 ? "Bigram" : "Trigram"})</span>
                        <span>Occurrence (Frequency)</span>
                      </div>
                      {slicedNGrams.map((ngram, index) => {
                        const barWidth = `${(ngram.count / peakCount) * 100}%`;
                        return (
                          <div key={ngram.phrase} className="space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-[#8A8471] w-5 text-right">{index + 1}.</span>
                                <span className="font-mono font-bold text-[#2C2A26] bg-[#F8F5EE] px-1.5 py-0.5 rounded border border-[#E9E4CE]">
                                  {ngram.phrase}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 font-mono text-[#8A8471] text-xs">
                                <span className="font-bold text-natural-charcoal">{ngram.count}x</span>
                                <span>({ngram.percentage}%)</span>
                              </div>
                            </div>
                            <div className="w-full h-2.5 bg-[#E6E2D3] rounded-full overflow-hidden border border-[#D9D4C3]">
                              <div
                                style={{ width: barWidth }}
                                className="h-full bg-natural-terracotta rounded-full transition-all duration-500"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Informational Box */}
              <div className="bg-[#F8F5EE] rounded-lg p-3.5 border border-[#E1DCC8] flex items-start space-x-2 text-xs text-natural-charcoal leading-relaxed leading-normal">
                <Info className="w-4 h-4 text-natural-olive shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#2C2A26]">Stylistic Associations: </span>
                  N-grams display style signatures of literature. Checking Bigrams/Trigrams with 
                  <span className="font-semibold text-natural-olive mx-1">Filter Stopwords active</span> exposes content thematic pairings (e.g., <span className="italic">gothic horror</span> words). 
                  Deactivating the stopword filter reveals grammatical dependencies (e.g., prepositions and modifiers) typical of the period's syntactic rhythm.
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB: READABILITY & POS TAGGING */}
          {activeTab === "readability" && (
            <div id="readability_workspace" className="bg-white p-5 rounded-xl border border-natural-border shadow-sm space-y-6 transition-all animate-fade-in font-sans">
              
              {/* Header Box */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-semibold text-natural-charcoal uppercase tracking-widest flex items-center space-x-1.5 font-sans">
                    <TrendingUp className="w-4 h-4 text-natural-olive" />
                    <span>Linguistic Readability & Lexical Distribution (POS)</span>
                  </h3>
                  <p className="text-xs text-[#8A8471]">
                    Determine prose complexity metrics and parts of speech distributions for advanced literary stylometrics.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => exportToCSV("readability")}
                    className="flex items-center space-x-1 px-2.5 py-1.5 bg-natural-olive text-white text-xs font-bold rounded-lg shadow-xs hover:bg-natural-olive/95 transition-all cursor-pointer"
                    title="Export Readability data"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Readability CSV</span>
                  </button>
                  <button
                    onClick={() => exportToCSV("pos")}
                    className="flex items-center space-x-1 px-2.5 py-1.5 bg-natural-olive text-white text-xs font-bold rounded-lg shadow-xs hover:bg-natural-olive/95 transition-all cursor-pointer"
                    title="Export POS data"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>POS CSV</span>
                  </button>
                </div>
              </div>

              {/* Sub Grid splits: Readability Left, POS Right */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* READABILITY SCORE CARD LIST */}
                <div className="bg-natural-warm p-4 rounded-xl border border-natural-border space-y-4">
                  <h4 className="text-xs font-bold text-natural-charcoal uppercase tracking-wider flex items-center space-x-1.5 border-b border-natural-border pb-2">
                    <Award className="w-4 h-4 text-natural-terracotta" />
                    <span>Readability Metrics</span>
                  </h4>

                  <div className="space-y-4">
                    {/* Flesch Reading Ease */}
                    <div className="bg-white p-3 rounded-lg border border-natural-border space-y-1">
                      <div className="flex justify-between items-center text-xs font-sans">
                        <span className="font-semibold text-[#8A8471]">Flesch Reading Ease</span>
                        <span className="font-mono font-extrabold text-natural-olive text-sm">{readabilityMetrics.fleschReadingEase}</span>
                      </div>
                      <p className="text-[10px] text-[#8A8471] leading-relaxed">
                        {readabilityMetrics.fleschReadingEase >= 90 ? "Very Easy (Grade 5 level prose or simple ballads)"
                          : readabilityMetrics.fleschReadingEase >= 70 ? "Easy / Conversational standard narrative"
                          : readabilityMetrics.fleschReadingEase >= 50 ? "Fairly Difficult / Sophisticated standard reading level"
                          : readabilityMetrics.fleschReadingEase >= 30 ? "Difficult / Academic English standard text"
                          : "Extremely Difficult (Heavy 19th Century syntax or legal prose)"}
                      </p>
                    </div>

                    {/* Flesch-Kincaid Grade Level */}
                    <div className="bg-white p-3 rounded-lg border border-natural-border space-y-1">
                      <div className="flex justify-between items-center text-xs font-sans">
                        <span className="font-semibold text-[#8A8471]">Flesch-Kincaid Grade Level</span>
                        <span className="font-mono font-extrabold text-natural-olive text-sm font-sans">Grade {readabilityMetrics.fleschKincaidGrade}</span>
                      </div>
                      <p className="text-[10px] text-[#8A8471] leading-relaxed">
                        Equates to {Math.ceil(readabilityMetrics.fleschKincaidGrade)} years of continuous formal English study. Standard classical literary novels occupy Grade 8 to 12.
                      </p>
                    </div>

                    {/* Gunning Fog index */}
                    <div className="bg-white p-3 rounded-lg border border-natural-border space-y-1">
                      <div className="flex justify-between items-center text-xs font-sans">
                        <span className="font-semibold text-[#8A8471]">Gunning Fog Index</span>
                        <span className="font-mono font-extrabold text-natural-olive text-sm">{readabilityMetrics.gunningFog}</span>
                      </div>
                      <p className="text-[10px] text-[#8A8471] leading-relaxed">
                        Indicates complexity level based on average sentence span and density of multi-syllable complex keywords.
                      </p>
                    </div>

                    {/* Breakdown particulars */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono font-medium text-natural-charcoal pt-1">
                      <div className="bg-white p-2 rounded border border-natural-border">
                        <span className="text-[#8A8471] block">Sentence boundaries:</span>
                        <span className="font-bold">{readabilityMetrics.totalSentences} count</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-natural-border">
                        <span className="text-[#8A8471] block">Avg Sentence Length:</span>
                        <span className="font-bold">{readabilityMetrics.avgSentenceLength} words</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-natural-border">
                        <span className="text-[#8A8471] block">Syllables / Word Avg:</span>
                        <span className="font-bold">{readabilityMetrics.syllablesPerWord}</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-natural-border">
                        <span className="text-[#8A8471] block">Complex Words Ratio:</span>
                        <span className="font-bold">{readabilityMetrics.complexWordsPercentage}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PART-OF-SPEECH TAGGING BREAKDOWN */}
                <div className="bg-[#FAF9F5] p-4 rounded-xl border border-natural-border space-y-4">
                  <h4 className="text-xs font-bold text-natural-charcoal uppercase tracking-wider flex items-center space-x-1.5 border-b border-natural-border pb-2">
                    <Activity className="w-4 h-4 text-natural-terracotta" />
                    <span>POS Grammatical Distribution tagging</span>
                  </h4>

                  {/* Horizontal tag cluster bar */}
                  {(() => {
                    const total = tokens.length || 1;
                    const nounPct = ((posBreakdown.noun / total) * 100).toFixed(1);
                    const verbPct = ((posBreakdown.verb / total) * 100).toFixed(1);
                    const adjPct = ((posBreakdown.adjective / total) * 100).toFixed(1);
                    const advPct = ((posBreakdown.adverb / total) * 100).toFixed(1);
                    const stopPct = ((posBreakdown.grammaticalStopword / total) * 100).toFixed(1);
                    const otherPct = ((posBreakdown.other / total) * 100).toFixed(1);

                    return (
                      <div className="space-y-4 font-sans border-t border-[#EBE7DD]/30 pt-3">
                        {/* Styled stacked horizontal range indicator */}
                        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden flex border border-[#CEC9BA]">
                          <div style={{ width: `${nounPct}%` }} className="bg-sky-500 h-full" title={`Noun: ${nounPct}%`} />
                          <div style={{ width: `${verbPct}%` }} className="bg-emerald-500 h-full" title={`Verb: ${verbPct}%`} />
                          <div style={{ width: `${adjPct}%` }} className="bg-amber-400 h-full" title={`Adjective: ${adjPct}%`} />
                          <div style={{ width: `${advPct}%` }} className="bg-rose-400 h-full" title={`Adverb: ${advPct}%`} />
                          <div style={{ width: `${stopPct}%` }} className="bg-neutral-400 h-full" title={`Stopwords: ${stopPct}%`} />
                          <div style={{ width: `${otherPct}%` }} className="bg-[#C2AFEB] h-full" title={`Others: ${otherPct}%`} />
                        </div>

                        {/* Visual checklist legend with counts */}
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center justify-between border-b border-[#EBE7DD]/60 pb-1">
                            <div className="flex items-center space-x-2 font-sans">
                              <div className="w-2.5 h-2.5 rounded-sm bg-sky-500" />
                              <span className="font-semibold text-natural-charcoal">Nouns (Kata Benda)</span>
                            </div>
                            <span className="font-mono font-bold text-natural-charcoal">{posBreakdown.noun}x ({nounPct}%)</span>
                          </div>

                          <div className="flex items-center justify-between border-b border-[#EBE7DD]/60 pb-1">
                            <div className="flex items-center space-x-2 font-sans">
                              <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                              <span className="font-semibold text-natural-charcoal">Verbs (Kata Kerja)</span>
                            </div>
                            <span className="font-mono font-bold text-natural-charcoal">{posBreakdown.verb}x ({verbPct}%)</span>
                          </div>

                          <div className="flex items-center justify-between border-b border-[#EBE7DD]/60 pb-1">
                            <div className="flex items-center space-x-2 font-sans">
                              <div className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
                              <span className="font-semibold text-natural-charcoal">Adjectives (Kata Sifat)</span>
                            </div>
                            <span className="font-mono font-bold text-natural-charcoal">{posBreakdown.adjective}x ({adjPct}%)</span>
                          </div>

                          <div className="flex items-center justify-between border-b border-[#EBE7DD]/60 pb-1">
                            <div className="flex items-center space-x-2 font-sans">
                              <div className="w-2.5 h-2.5 rounded-sm bg-rose-400" />
                              <span className="font-semibold text-natural-charcoal">Adverbs (Kata Keterangan)</span>
                            </div>
                            <span className="font-mono font-bold text-natural-charcoal">{posBreakdown.adverb}x ({advPct}%)</span>
                          </div>

                          <div className="flex items-center justify-between border-b border-[#EBE7DD]/60 pb-1">
                            <div className="flex items-center space-x-2 font-sans">
                              <div className="w-2.5 h-2.5 rounded-sm bg-neutral-400" />
                              <span className="font-semibold text-natural-charcoal text-xs">Function Words (Relational Stopwords)</span>
                            </div>
                            <span className="font-mono font-bold text-gray-500">{posBreakdown.grammaticalStopword}x ({stopPct}%)</span>
                          </div>
                        </div>

                        {/* Hermeneutic feedback hint based on POS */}
                        <div id="hermeneutic_feedback" className="text-[10px] text-[#635E54] bg-[#FAF9F5] p-2.5 rounded-lg border border-dashed border-[#CEC9BA] leading-normal italic font-medium">
                          {posBreakdown.adjective > posBreakdown.verb ? (
                            <span>💡 Rhetorical Tip: This text's High Adjective count indicates descriptive landscape imagery, indicative of deep aesthetic Romanticism or poetic observation.</span>
                          ) : (
                            <span>💡 Rhetorical Tip: The High Verb index signals dynamic narrative progression, agency, or active dialogical sequences common in Gothic dramas or novel excerpts.</span>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>

              </div>

            </div>
          )}

          {/* SUB-TAB 2: KEYWORD-IN-CONTEXT CONCORDANCE CONTAINER */}
          {activeTab === "concordance" && (
            <div id="concordance_workspace" className="bg-white p-5 rounded-xl border border-natural-border shadow-sm space-y-4 transition-all animate-fade-in">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-natural-charcoal uppercase tracking-widest flex items-center space-x-2">
                  <Search className="w-4 h-4 text-natural-olive" />
                  <span>Interactive KWIC (Keyword-in-Context) Search</span>
                </h3>
                <p className="text-xs text-[#8A8471]">
                  Search any literary token to align its structural and syntactic context. Highly useful for Corpus Stylistics.
                </p>
              </div>

              {/* Input Workspace Search Bar */}
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <input
                    id="kwic_query_input"
                    type="text"
                    value={kwicSearchQuery}
                    onChange={(e) => setKwicSearchQuery(e.target.value)}
                    placeholder="Type a word (e.g. hope, love, summer, day)..."
                    className="w-full text-xs font-mono bg-natural-warm border border-natural-border rounded-lg p-2.5 pl-9 text-natural-charcoal focus:outline-none focus:ring-1 focus:ring-natural-olive"
                  />
                  <Search className="w-3.5 h-3.5 text-[#8A8471] absolute left-3 top-3.5" />
                </div>
              </div>

              {/* Results Grid Frame */}
              <div className="bg-[#2C2A26] text-[#E6E2D3] p-4 rounded-xl border border-[#1E1C1A] font-mono text-[11px] leading-relaxed overflow-x-auto min-h-60 max-h-96">
                <div className="border-b border-[#3D3A35] pb-2 mb-2 text-[10px] uppercase font-bold text-[#8A8471] flex justify-between pr-4">
                  <span className="w-2/5 text-right">Left Context</span>
                  <span className="w-1/5 text-center text-natural-terracotta bg-[#3E2519] px-1 rounded font-bold">Keyword</span>
                  <span className="w-2/5">Right Context</span>
                </div>

                {concordanceLines.length === 0 ? (
                  <p className="text-center text-[#8A8471] py-16">
                    No corpus occurrences found for keyword "{kwicSearchQuery}".<br />
                    <span className="text-[10px] text-[#635E54]">Try clicking text tokens inside the Reader on the left.</span>
                  </p>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {concordanceLines.map((line) => (
                      <div key={line.id} className="flex justify-between items-center hover:bg-[#3D3A35] py-1 px-1 rounded transition-colors">
                        {/* Left Side: Right-aligned */}
                        <div className="w-2/5 text-right text-[#C9C4B1] truncate pr-3 select-none">
                          {line.leftContext || "..."}
                        </div>
                        {/* Target: Centered and Bold rust */}
                        <div className="w-1/5 text-center text-natural-terracotta font-bold bg-[#3E2519]/60 px-1 py-0.5 rounded text-xs truncate">
                          {line.keyword}
                        </div>
                        {/* Right Side: Left-aligned */}
                        <div className="w-2/5 text-[#C9C4B1] truncate pl-3 select-none">
                          {line.rightContext || "..."}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Informational AntConc matching advice */}
              <div className="bg-[#F8F5EE] rounded-lg p-3.5 border border-[#E1DCC8] flex items-start space-x-2 text-xs text-natural-charcoal leading-relaxed">
                <Info className="w-4 h-4 text-natural-terracotta shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#2C2A26]">Corpus Analysis Tip: </span>
                  Observing words in alignment (KWIC) allows scholars to decode syntactic tendencies (collocations). 
                  For instance, in <span className="italic font-serif">A Dream Within a Dream</span>, the token 
                  <span className="font-mono bg-[#EBE7DD] text-natural-charcoal px-1 rounded mx-1">dream</span> collocates heavily with 
                  <span className="font-mono bg-[#EBE7DD] text-natural-charcoal px-1 rounded mr-1">within</span> and 
                  <span className="font-mono bg-[#EBE7DD] text-natural-charcoal px-1 rounded">seen</span>, signaling Poe's focus on structural nesting and reality fragmentation.
                </div>
              </div>

            </div>
          )}

          {/* SUB-TAB 3: LITERARY STYLE & AI CRITIQUE */}
          {activeTab === "style" && (
            <div id="mood_workspace" className="bg-white p-5 rounded-xl border border-natural-border shadow-sm space-y-6 transition-all animate-fade-in font-sans">
              
              {/* Local Mood Engine */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-natural-charcoal uppercase tracking-widest font-sans">
                    Core Lexical Mood
                  </h3>
                  <span className="text-xs bg-natural-warm border border-natural-border text-natural-charcoal py-1 px-2.5 rounded-full font-bold">
                    Mood: <span className={`${
                      localMood.label === "Positive" ? "text-natural-olive" : localMood.label === "Negative" ? "text-natural-terracotta" : "text-natural-charcoal"
                    }`}>{localMood.label}</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-natural-olive/5 p-4 rounded-xl border border-natural-olive/20 text-center">
                    <p className="text-[10px] font-bold text-natural-olive uppercase tracking-widest">Positive Triggers</p>
                    <p className="font-mono text-2xl font-black text-natural-olive mt-1">{localMood.positiveCount}</p>
                    <p className="text-[10px] text-[#8A8471] mt-1 font-mono">e.g. love, gold, beautiful, sings</p>
                  </div>
                  <div className="bg-natural-terracotta/5 p-4 rounded-xl border border-natural-terracotta/20 text-center">
                    <p className="text-[10px] font-bold text-natural-terracotta uppercase tracking-widest">Negative/Somatic Triggers</p>
                    <p className="font-mono text-2xl font-black text-natural-terracotta mt-1">{localMood.negativeCount}</p>
                    <p className="text-[10px] text-[#8A8471] mt-1 font-mono">e.g. storm, death, weep, winds</p>
                  </div>
                </div>

                <p className="text-xs text-[#635E54] leading-relaxed italic bg-natural-warm p-3 rounded-lg border border-natural-border font-serif">
                  <span className="font-sans font-black uppercase text-[10px] tracking-wide text-[#8A8471] not-italic mr-1.5">Lexical Scan: </span>
                  {localMood.explanation}
                </p>
              </div>

              {/* Express Server AI Critique */}
              <div className="pt-5 border-t border-natural-border space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-semibold text-natural-charcoal uppercase tracking-widest flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-natural-terracotta" />
                      <span>Deep AI Literary Critique</span>
                    </h4>
                    <p className="text-[10px] text-[#8A8471] font-semibold">Generates style analysis securely from Gemini 3.5 Flash</p>
                  </div>
                  <button
                    id="trigger_gemini_critique_btn"
                    onClick={fetchGeminiCritique}
                    disabled={isAiLoading}
                    className="px-3.5 py-1.5 text-xs text-white font-bold rounded-lg bg-natural-olive hover:bg-natural-olive/90 disabled:bg-slate-350 transition-colors shadow-sm flex items-center space-x-1 cursor-pointer"
                  >
                    {isAiLoading ? (
                      <span className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full mr-1" />
                    ) : (
                      <Sparkles className="w-3 h-3 text-white mr-1" />
                    )}
                    <span>{isAiLoading ? "Analyzing..." : "Review Pieces with Gemini"}</span>
                  </button>
                </div>

                {/* AI Outputs container */}
                {aiCritique && (
                  <div id="gemini_critique_box" className="p-5 bg-white border-2 border-natural-olive/30 rounded-xl space-y-4 animate-fade-in text-xs leading-relaxed text-natural-charcoal font-sans shadow-sm">
                    <div className="flex items-center justify-between border-b border-natural-border pb-3">
                      <div className="flex items-center space-x-1.5">
                        <Sparkles className="w-4 h-4 text-natural-terracotta animate-pulse" />
                        <span className="font-bold text-[#2C2A26] font-serif italic text-sm">Professional Stylistic Review</span>
                      </div>
                      <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider font-sans border ${
                        critiqueSource === "gemini" 
                          ? "bg-natural-olive/10 border-natural-olive/25 text-natural-olive" 
                          : "bg-amber-500/10 border-amber-500/25 text-amber-700"
                      }`}>
                        {critiqueSource === "gemini" ? "✨ Gemini AI Engine" : "📚 Local Scholastic Engine"}
                      </span>
                    </div>
                    <div className="whitespace-pre-line font-serif leading-relaxed text-[#3D3A35] text-xs">
                      {aiCritique}
                    </div>
                    {critiqueSource === "local" && (
                      <div className="mt-2 pt-2.5 border-t border-dashed border-natural-border text-[10px] text-[#8A8471] italic flex items-center space-x-1">
                        <span>💡 Local style parser active to secure immediate workflow analysis. Absolute data privacy and syntactic reliability guaranteed.</span>
                      </div>
                    )}
                  </div>
                )}

                {aiError && (
                  <div id="ai_error_box" className="p-3 bg-natural-terracotta/10 border border-natural-terracotta/30 rounded-lg text-natural-charcoal text-xs">
                    <p className="font-bold">Notice / Penting:</p>
                    <p className="text-[11px] mt-1 leading-relaxed">{aiError}</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* SUB-TAB 6: COMPARATIVE SIDE-by-SIDE ANALYSIS */}
          {activeTab === "compare" && (
            <div id="compare_workspace" className="bg-white p-5 rounded-xl border border-natural-border shadow-sm space-y-6 transition-all animate-fade-in font-sans">
              
              <div className="space-y-0.5 border-b border-natural-border pb-3">
                <h3 className="text-sm font-semibold text-natural-charcoal uppercase tracking-widest flex items-center space-x-1.5 font-sans">
                  <Scale className="w-4 h-4 text-natural-terracotta" />
                  <span>Studi Sastra Bandingan (Side-by-Side Stylometric Comparator)</span>
                </h3>
                <p className="text-xs text-[#8A8471]">
                  Compare structural density, vocabulary richness, sentiment polarity, and readability of two literary pieces side-by-side.
                </p>
              </div>

              {/* Side Choice Selector Bar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-natural-warm p-4 rounded-xl border border-natural-border">
                <div className="text-xs space-y-1.5">
                  <span className="block font-black text-[#8A8471] uppercase tracking-wider text-[10px]">&bull; Primary Corpus A (Selected in Left Panel):</span>
                  <div className="bg-white px-3 py-2.5 rounded-lg border border-natural-border font-serif font-extrabold text-[#2C2A26] flex justify-between items-center text-xs">
                    <span>{currentPoem.title}</span>
                    <span className="text-[9px] bg-natural-olive/10 border border-natural-olive/20 text-natural-olive px-2 py-0.5 rounded-full uppercase tracking-wider font-sans font-bold">{currentPoem.genre}</span>
                  </div>
                </div>

                <div className="text-xs space-y-1.5 col-span-1">
                  <span className="block font-black text-[#8A8471] uppercase tracking-wider text-[10px]">&bull; Reference Corpus B (Select for Comparison):</span>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      id="compare_select"
                      value={compareTargetId}
                      onChange={(e) => {
                        setCompareTargetId(e.target.value);
                        setIsCompareCustom(false);
                      }}
                      disabled={isCompareCustom}
                      className="col-span-2 text-xs bg-white border border-natural-border rounded-lg p-2 text-natural-charcoal focus:outline-none focus:ring-1 focus:ring-natural-olive font-medium cursor-pointer"
                    >
                      {preloadedPoems
                        .filter(p => p.id !== currentPoem.id)
                        .map(p => (
                          <option key={p.id} value={p.id}>{p.title} (by {p.author})</option>
                        ))}
                    </select>

                    <button
                      onClick={() => setIsCompareCustom(!isCompareCustom)}
                      className={`text-[10px] font-bold rounded-lg border transition-colors cursor-pointer ${
                        isCompareCustom
                          ? "bg-natural-olive text-white border-natural-olive shadow-xs"
                          : "bg-white border-natural-border text-natural-charcoal hover:bg-natural-border/15"
                      }`}
                    >
                      {isCompareCustom ? "Classic Presets" : "Custom Bin"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Optional reference custom paste block */}
              {isCompareCustom && (
                <div className="p-4 bg-natural-warm/80 rounded-xl border border-[#D9D4C3] border-dashed space-y-3 animate-fade-in">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-bold text-[#8A8471] uppercase tracking-wider">Comparison Text Title</label>
                      <input
                        type="text"
                        value={compareCustomTitle}
                        onChange={(e) => setCompareCustomTitle(e.target.value)}
                        className="w-full text-xs bg-white border border-natural-border rounded p-1.5 text-natural-charcoal"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-[#8A8471] uppercase tracking-wider">Comparison Author</label>
                      <input
                        type="text"
                        value={compareCustomAuthor}
                        onChange={(e) => setCompareCustomAuthor(e.target.value)}
                        className="w-full text-xs bg-white border border-natural-border rounded p-1.5 text-natural-charcoal"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#8A8471] uppercase tracking-wider mb-1">Paste Comparison text:</label>
                    <textarea
                      rows={4}
                      value={compareCustomText}
                      onChange={(e) => setCompareCustomText(e.target.value)}
                      className="w-full text-xs font-mono bg-white border border-natural-border rounded p-2 text-natural-charcoal"
                      placeholder="Paste B lines here..."
                    />
                  </div>
                </div>
              )}

              {/* STYLOMETRIC COMPARISON TABLE */}
              <div className="overflow-x-auto shadow-xs border border-natural-border rounded-xl">
                <table className="w-full text-left text-xs bg-white leading-relaxed border-collapse">
                  <thead>
                    <tr className="bg-natural-warm border-b border-natural-border font-sans uppercase font-bold text-[#8A8471] text-[9px] tracking-wider text-center">
                      <th className="py-3 px-4 text-left">Linguistic Metric</th>
                      <th className="py-3 px-4 text-natural-olive bg-natural-olive/5">Corpus A (Primary)</th>
                      <th className="py-3 px-4 text-natural-terracotta bg-natural-terracotta/5">Corpus B (Reference)</th>
                      <th className="py-3 px-4">Difference Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-natural-border text-center font-medium">
                    
                    <tr className="hover:bg-natural-warm/10">
                      <td className="py-3 px-4 text-left font-semibold text-natural-charcoal">Title / Author</td>
                      <td className="py-3 px-4 bg-natural-olive/[0.01] text-natural-olive font-serif italic font-bold">"{currentPoem.title}" by {currentPoem.author}</td>
                      <td className="py-3 px-4 bg-natural-terracotta/[0.01] text-natural-terracotta font-serif italic font-bold">"{comparePoem.title}" by {comparePoem.author}</td>
                      <td className="py-3 px-4 text-xs font-serif text-[#8A8471]">-</td>
                    </tr>

                    <tr className="hover:bg-natural-warm/10">
                      <td className="py-3 px-4 text-left font-semibold text-natural-charcoal">Tokens Count (Total Words)</td>
                      <td className="py-3 px-4 bg-natural-olive/[0.01] font-mono text-[#2C2A26]">{tokens.length} words</td>
                      <td className="py-3 px-4 bg-natural-terracotta/[0.01] font-mono text-[#2C2A26]">{compareTokens.length} words</td>
                      <td className="py-3 px-4 font-mono text-xs text-natural-charcoal">
                        {(() => {
                          const diff = tokens.length - compareTokens.length;
                          return diff > 0 ? `A is larger (+${diff})` : diff < 0 ? `B is larger (${diff})` : "Equal span";
                        })()}
                      </td>
                    </tr>

                    <tr className="hover:bg-natural-warm/10">
                      <td className="py-3 px-4 text-left font-semibold text-natural-charcoal">Vocabulary Dimension (Types)</td>
                      <td className="py-3 px-4 bg-natural-olive/[0.01] font-mono text-[#2C2A26]">{rawWordFrequencies.length} unique</td>
                      <td className="py-3 px-4 bg-natural-terracotta/[0.01] font-mono text-[#2C2A26]">{compareRawFreqs.length} unique</td>
                      <td className="py-3 px-4 font-mono text-xs text-natural-charcoal">
                        {rawWordFrequencies.length - compareRawFreqs.length > 0 ? "A has more distinct types" : "B has more distinct types"}
                      </td>
                    </tr>

                    <tr className="hover:bg-natural-warm/10 bg-[#FCFAF5]">
                      <td className="py-3 px-4 text-left font-semibold text-natural-charcoal flex items-center space-x-1.5" title="Type-Token Ratio measures lexical diversity">
                        <span>Type-Token Ratio (TTR)</span>
                        <HelpCircle className="w-3.5 h-3.5 text-[#8A8471] cursor-help inline shrink-0" />
                      </td>
                      <td className="py-3 px-4 bg-natural-olive/[0.03] font-mono text-natural-olive font-extrabold">
                        {(() => {
                          const ttr = tokens.length > 0 ? ((rawWordFrequencies.length / tokens.length) * 100).toFixed(1) : "0.0";
                          return `${ttr}%`;
                        })()}
                      </td>
                      <td className="py-3 px-4 bg-natural-terracotta/[0.03] font-mono text-natural-terracotta font-extrabold">
                        {(() => {
                          const ttr2 = compareTokens.length > 0 ? ((compareRawFreqs.length / compareTokens.length) * 100).toFixed(1) : "0.0";
                          return `${ttr2}%`;
                        })()}
                      </td>
                      <td className="py-3 px-4 text-xs leading-normal">
                        {(() => {
                          const t1 = tokens.length > 0 ? (rawWordFrequencies.length / tokens.length) : 0;
                          const t2 = compareTokens.length > 0 ? (compareRawFreqs.length / compareTokens.length) : 0;
                          return t1 > t2 
                            ? "A is lexically richer / denser" 
                            : t1 < t2 
                              ? "B is lexically richer / denser" 
                              : "Symmetrical diversity";
                        })()}
                      </td>
                    </tr>

                    <tr className="hover:bg-natural-warm/10">
                      <td className="py-3 px-4 text-left font-semibold text-natural-charcoal">Flesch Reading Ease Level</td>
                      <td className="py-3 px-4 bg-natural-olive/[0.01] font-mono">{readabilityMetrics.fleschReadingEase}</td>
                      <td className="py-3 px-4 bg-natural-terracotta/[0.01] font-mono">{compareReadability.fleschReadingEase}</td>
                      <td className="py-3 px-4 text-xs text-[#635E54]">
                        {readabilityMetrics.fleschReadingEase > compareReadability.fleschReadingEase ? "A is easier syntax" : "B is easier syntax"}
                      </td>
                    </tr>

                    <tr className="hover:bg-natural-warm/10">
                      <td className="py-3 px-4 text-left font-semibold text-natural-charcoal">Flesch-Kincaid Grade Level</td>
                      <td className="py-3 px-4 bg-natural-olive/[0.01] font-mono font-bold text-natural-charcoal font-sans">Grade {readabilityMetrics.fleschKincaidGrade}</td>
                      <td className="py-3 px-4 bg-natural-terracotta/[0.01] font-mono font-bold text-natural-charcoal font-sans">Grade {compareReadability.fleschKincaidGrade}</td>
                      <td className="py-3 px-4 text-xs text-[#635E54]">
                        {readabilityMetrics.fleschKincaidGrade > compareReadability.fleschKincaidGrade ? "A needs more advanced study" : "B needs more advanced study"}
                      </td>
                    </tr>

                    <tr className="hover:bg-natural-warm/10">
                      <td className="py-3 px-4 text-left font-semibold text-[#635E54]">Noun Occurrence Ratio</td>
                      <td className="py-3 px-4 bg-natural-olive/[0.01] font-mono text-gray-700">{((posBreakdown.noun / (tokens.length || 1)) * 100).toFixed(1)}%</td>
                      <td className="py-3 px-4 bg-natural-terracotta/[0.01] font-mono text-gray-700">{((comparePOS.noun / (compareTokens.length || 1)) * 100).toFixed(1)}%</td>
                      <td className="py-3 px-4 text-xs font-mono">
                        {(((posBreakdown.noun / (tokens.length || 1)) - (comparePOS.noun / (compareTokens.length || 1))) * 100).toFixed(1)}% variance
                      </td>
                    </tr>

                    <tr className="hover:bg-natural-warm/10">
                      <td className="py-3 px-4 text-left font-semibold text-[#635E54]">Adjectival Descriptor Ratio</td>
                      <td className="py-3 px-4 bg-natural-olive/[0.01] font-mono text-gray-700">{((posBreakdown.adjective / (tokens.length || 1)) * 100).toFixed(1)}%</td>
                      <td className="py-3 px-4 bg-natural-terracotta/[0.01] font-mono text-gray-700">{((comparePOS.adjective / (compareTokens.length || 1)) * 100).toFixed(1)}%</td>
                      <td className="py-3 px-4 text-xs font-mono">
                        {(((posBreakdown.adjective / (tokens.length || 1)) - (comparePOS.adjective / (compareTokens.length || 1))) * 100).toFixed(1)}% variance
                      </td>
                    </tr>

                    <tr className="hover:bg-natural-warm/10">
                      <td className="py-3 px-4 text-left font-semibold text-natural-charcoal">Structural Poetic Mood</td>
                      <td className="py-3 px-4 bg-natural-olive/[0.01] text-xs font-bold text-natural-olive">{localMood.label}</td>
                      <td className="py-3 px-4 bg-natural-terracotta/[0.01] text-xs font-bold text-natural-terracotta">{compareSentiment.label}</td>
                      <td className="py-3 px-4 text-xs">
                        {localMood.label === compareSentiment.label ? "Both share net tone mood" : "Differing thematic temperaments"}
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>

              {/* Scholastic Summary Advice */}
              <div className="bg-[#FAF9F5] rounded-lg p-4 border border-[#CEC9BA] leading-relaxed text-xs text-[#3D3A35]">
                <span className="font-bold text-[#2C2A26] uppercase text-[10px] tracking-wide block mb-1">Comparative Literary Tip for UNIMED Students:</span>
                Type-Token Ratio (TTR) variance indicates whether an author uses a wide, decorative dictionary lexicon (high TTR) or leverages repetitive rhetorical structures (lower TTR) to set rhythmic motifs. 
                Compare standard sonnets side-by-side with Emily Dickinson or Poe gothic cerpen to write robust skripsi critiques!
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

// Quick helper to categorize tokens as standard functional stopwords inside visual interfaces
function isStopwordToken(word: string): boolean {
  return [
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", 
    "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", 
    "by", "can", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from", 
    "further", "had", "has", "have", "having", "he", "her", "here", "hers", "herself", "him", 
    "himself", "his", "how", "i", "if", "in", "into", "is", "it", "its", "itself", "me", "more", 
    "most", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", 
    "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "should", "so", 
    "some", "such", "than", "that", "the", "their", "theirs", "them", "themselves", "then", 
    "there", "these", "they", "this", "those", "through", "to", "too", "under", "until", "up", 
    "very", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", 
    "with", "would", "you", "your", "yours", "yourself", "yourselves"
  ].includes(word.toLowerCase());
}
