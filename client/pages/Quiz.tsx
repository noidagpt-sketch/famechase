import React, { useEffect } from "react";

type Props = {
  currentStep?: number;
  t?: any;
  quizData?: any;
  updateQuizData?: (key: string, value: any) => void;
};

const Quiz = ({ currentStep = 0, t, quizData = {}, updateQuizData = () => {} }: Props) => {
  useEffect(() => {
    // Helpful debugging info — check browser console for this
    // Remove or disable in production
    // eslint-disable-next-line no-console
    console.log("Quiz mounted/updated", { currentStep, t, quizData });
  }, [currentStep, t, quizData]);

  // If we're not on the quiz step, render nothing
  if (currentStep !== 1) return null;

  const platforms: string[] = t?.options?.platforms ?? [];

  return (
    <div className="p-6 text-white min-h-[200px]">
      {/* Title with safe access */}
      <p className="text-lg font-semibold mb-4">
        {t?.questions?.primaryPlatform ?? "Choose your primary platform"}
      </p>

      {/* If there are no platforms, show a helpful message */}
      {platforms.length === 0 ? (
        <div className="text-sm text-gray-300">
          No platforms available yet. Check console for props or ensure t.options.platforms is provided.
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
  );
};

export default Quiz;