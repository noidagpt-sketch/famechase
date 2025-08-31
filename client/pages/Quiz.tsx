import React from "react";

const Quiz = ({ currentStep, t, quizData, updateQuizData }) => (
  <> 
    {currentStep === 1 && (
      <> 
        <p className="text-lg font-semibold mb-4">{t.questions.primaryPlatform}</p>
        <div className="flex flex-col gap-3 mt-2"> 
          {t.options.platforms.map((platform: string) => (
            <label
              key={platform}
              className={`flex items-center gap-2 cursor-pointer border rounded px-4 py-2 transition 
                ${quizData.primaryPlatform === platform ? "border-neon-green bg-green-50" : "border-gray-200"}
              `}
            >
              <input
                type="radio"
                name="primaryPlatform"
                value={platform}
                checked={quizData.primaryPlatform === platform}
                onChange={() => updateQuizData("primaryPlatform", platform)}
                className="form-radio accent-neon-green"
              />
              <span className="font-medium">{platform}</span>
            </label>
          ))}
        </div>
      </>
    )} 
  </>
);

export default Quiz;