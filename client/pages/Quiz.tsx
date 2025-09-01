import React, { useEffect } from "react";

type Props = {
  currentStep?: number;
  t?: any;
  quizData?: any;
  updateQuizData?: (key: string, value: any) => void;
};

const Quiz = ({ currentStep = 0, t, quizData = {}, updateQuizData = () => {} }: Props) => {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("Quiz mounted/updated", { currentStep, t, quizData });
  }, [currentStep, t, quizData]);

  let debugStr = "";
  try {
    debugStr = JSON.stringify({ currentStep, t, quizData }, null, 2);
  } catch {
    debugStr = "[Unable to stringify props]";
  }

  // Temporary: treat /quiz URL as quiz step so UI is visible while we debug parent logic
  const onQuizPath =
    typeof window !== "undefined" &&
    (window.location.pathname === "/quiz" || window.location.pathname.replace(/\/+/g, "") === "/quiz");
  const isQuizStep = currentStep === 1 || onQuizPath;

  const platforms: string[] = t?.options?.platforms ?? [];

  return (
    <div>
      {/* Visible debug overlay so we can inspect runtime props without DevTools */}
      <div style={{ position: "fixed", right: 12, top: 12, zIndex: 9999 }}>
        <div className="bg-white text-black rounded shadow p-3 max-w-[380px] max-h-[60vh] overflow-auto text-xs">
          <div className="font-semibold mb-1">Quiz debug</div>
          <pre style={{ whiteSpace: "pre-wrap" }}>{debugStr}</pre>
        </div>
      </div>

      {isQuizStep ? (
        <div className="p-6 text-white min-h-[200px]">
          <p className="text-lg font-semibold mb-4">
            {t?.questions?.primaryPlatform ?? "Choose your primary platform"}
          </p>

          {platforms.length === 0 ? (
            <div className="text-sm text-gray-300">
              No platforms available yet. Check debug panel for props.
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
      ) : null}
    </div>
  );
};

export default Quiz;