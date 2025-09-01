import React from "react";

type Props = {
  currentStep?: number;
  t?: any;
  quizData?: any;
  updateQuizData?: (key: string, value: any) => void;
};

const Quiz = ({ currentStep = 0, t, quizData = {}, updateQuizData = () => {} }: Props) => {
  // Show the quiz when currentStep is explicitly 1, or when user is on /quiz URL
  const isQuizStep =
    currentStep === 1 ||
    (typeof window !== "undefined" && (window.location.pathname === "/quiz" || window.location.pathname.replace(/\/+/g, "") === "quiz"));

  const platforms: string[] = t?.options?.platforms ?? [];

  return (
    <div>
      {isQuizStep ? (
        <div className="p-6 text-white min-h-[200px]">
          <p className="text-lg font-semibold mb-4">
            {t?.questions?.primaryPlatform ?? "Choose your primary platform"}
          </p>

          {platforms.length === 0 ? (
            <div className="text-sm text-gray-300">No platforms available yet.</div>
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