import React, { createContext, useContext, useState, useEffect } from "react";

export type ReaderFontSize = "normal" | "large" | "xlarge";
export type ReaderFontFamily = "sans" | "study";
export type ReaderLineSpacing = "normal" | "relaxed";

export interface ReaderSettings {
  fontSize: ReaderFontSize;
  fontFamily: ReaderFontFamily;
  lineSpacing: ReaderLineSpacing;
  highlightKeyTerms: boolean;
}

interface ReaderContextType extends ReaderSettings {
  setFontSize: (size: ReaderFontSize) => void;
  setFontFamily: (family: ReaderFontFamily) => void;
  setLineSpacing: (spacing: ReaderLineSpacing) => void;
  setHighlightKeyTerms: (highlight: boolean) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: ReaderSettings = {
  fontSize: "normal",
  fontFamily: "study", // Default to high-legibility study font for educational material
  lineSpacing: "relaxed", // Optimal 1.65 line-height for student comprehension
  highlightKeyTerms: true,
};

const ReaderContext = createContext<ReaderContextType | undefined>(undefined);

export function ReaderProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ReaderSettings>(() => {
    try {
      const saved = localStorage.getItem("hse_reader_settings");
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem("hse_reader_settings", JSON.stringify(settings));
    } catch {
      // ignore
    }

    // Apply attributes to document root for global CSS rules
    const root = document.documentElement;
    root.setAttribute("data-font-style", settings.fontFamily);
    root.setAttribute("data-reader-size", settings.fontSize);
    root.setAttribute("data-line-spacing", settings.lineSpacing);
  }, [settings]);

  const setFontSize = (fontSize: ReaderFontSize) => {
    setSettings((prev) => ({ ...prev, fontSize }));
  };

  const setFontFamily = (fontFamily: ReaderFontFamily) => {
    setSettings((prev) => ({ ...prev, fontFamily }));
  };

  const setLineSpacing = (lineSpacing: ReaderLineSpacing) => {
    setSettings((prev) => ({ ...prev, lineSpacing }));
  };

  const setHighlightKeyTerms = (highlightKeyTerms: boolean) => {
    setSettings((prev) => ({ ...prev, highlightKeyTerms }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <ReaderContext.Provider
      value={{
        ...settings,
        setFontSize,
        setFontFamily,
        setLineSpacing,
        setHighlightKeyTerms,
        resetSettings,
      }}
    >
      {children}
    </ReaderContext.Provider>
  );
}

export function useReaderSettings() {
  const context = useContext(ReaderContext);
  if (!context) {
    return {
      ...DEFAULT_SETTINGS,
      setFontSize: () => {},
      setFontFamily: () => {},
      setLineSpacing: () => {},
      setHighlightKeyTerms: () => {},
      resetSettings: () => {},
    };
  }
  return context;
}
