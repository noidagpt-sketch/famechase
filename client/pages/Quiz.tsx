import React, { useEffect, useState } from "react";

type Props = {
  currentStep?: number;
  t?: any;
  quizData?: any;
  updateQuizData?: (key: string, value: any) => void;
};

const Quiz = ({ currentStep = 0, t, quizData = {}, updateQuizData = () => {} }: Props) => {
  const [platforms, setPlatforms] = useState<string[] | null>(null); // null = loading
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Show quiz when explicit step === 1 or when path is /quiz
  const isQuizStep =
    currentStep === 1 ||
    (typeof window !== "undefined" &&
      (window.location.pathname === "/quiz" ||
        window.location.pathname.replace(/\/+/g, "") === "quiz"));

  useEffect(() => {
    const fromT = Array.isArray(t?.options?.platforms) ? t.options.platforms : [];
    if (fromT.length > 0) {
      setPlatforms(fromT);
      return;
    }

    let mounted = true;
    setPlatforms(null);
    setFetchError(null);
    fetch("/docs.json", { cache: "no-cache" })
      .then(async (res) => {
        if (!res.ok) throw new Error(`docs.json fetch failed: ${res.status}`);
        const json = await res.json();
        const p =
          Array.isArray(json?.options?.platforms) && json.options.platforms.length > 0
            ? json.options.platforms
            : Array.isArray(json?.platforms)
            ? json.platforms
            : [];
        if (mounted) setPlatforms(p);
      })
      .catch((err: any) => {
        if (mounted) {
          setPlatforms([]); // show "No platforms..." fallback
          setFetchError(String(err?.message ?? err));
        }
      });
    return () => {
      mounted = false;
    };
  }, [t]);

  if (!isQuizStep) return null;

  return (
    <div>
      <div className="p-6 text-white min-h-[200px]">
        <p className="text-lg font-semibold mb-4">
          {t?.questions?.primaryPlatform ?? "Choose your primary platform"}
        </p>

        {platforms === null ? (
          <div className="text-sm text-gray-300">Loading platforms...</div>
        ) : platforms.length === 0 ? (
          <div className="text-sm text-gray-300">
            No platforms available yet.
            {fetchError ? (
              <div className="mt-2 text-xs text-red-400">Error loading platforms: {fetchError}</div>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col gap-3 mt-2">
            {platforms.map((platform: string) => (
              <label
                key={platform}
                className={`flex items-center gap-2 cursor-pointer border rounded px-4 py-2 transition
                    ${quizData?.primaryPlatform === platform ? "border-neon-green bg-green-50" : "border-gray-200"}
                  `}
              >
                <input
                  type="radio"
                  name="primaryPlatform"
                  value={platform}
                  checked={quizData?.primaryPlatform === platform}
                  onChange={() => updateQuizData?.("primaryPlatform", platform)}
                  className="form-radio accent-neon-green"
                />
                <span className="font-medium text-white">{platform}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
