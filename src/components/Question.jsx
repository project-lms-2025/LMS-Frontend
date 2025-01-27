'use client';

import React, { useState, useRef } from 'react';

const Question = () => {
  const [questionType, setQuestionType] = useState('MCQ');
  const [questionText, setQuestionText] = useState('');
  const [questionImage, setQuestionImage] = useState(null);
  const [options, setOptions] = useState(['', '', '', '']);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [positiveValue, setPositiveValue] = useState(0);
  const [negativeValue, setNegativeValue] = useState(0);
  const [optionImages, setOptionImages] = useState(Array(4).fill(null));
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setQuestionImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setQuestionImage(null);
    setQuestionText('');
  };

  const handleOptionChange = (e, index) => {
    const newOptions = [...options];
    newOptions[index] = e.target.value;
    setOptions(newOptions);
  };

  const handleCheckboxChange = (index) => {
    const newSelectedOptions = [...selectedOptions];
    const optionIndex = newSelectedOptions.indexOf(index);
    if (optionIndex > -1) {
      newSelectedOptions.splice(optionIndex, 1);
    } else {
      newSelectedOptions.push(index);
    }
    setSelectedOptions(newSelectedOptions);
  };

  const handleRadioChange = (index) => {
    setSelectedOptions([index]);
  };

  const handlePositiveIncrement = () => {
    setPositiveValue((prev) => Math.round((prev + 0.5) * 2) / 2);
  };

  const handleNegativeDecrement = () => {
    setNegativeValue((prev) => Math.round((prev - 0.5) * 2) / 2);
  };

  const handleOptionImageUpload = (e, index) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newOptionImages = [...optionImages];
        newOptionImages[index] = reader.result;
        setOptionImages(newOptionImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveOptionImage = (index) => {
    const newOptionImages = [...optionImages];
    newOptionImages[index] = null;
    setOptionImages(newOptionImages);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 p-4 border rounded shadow-lg">
      <div className="flex flex-col gap-4">
        {/* Question Input */}
        <div className="relative">
          {questionImage && (
            <div className="relative mb-4">
              <img
                src={questionImage}
                alt="Question"
                className="w-full h-48 object-cover rounded"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-sm"
              >
                &times;
              </button>
            </div>
          )}
          <textarea
            placeholder="Type your question here..."
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full border p-2 rounded resize-none"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="mt-2 text-blue-600"
          >
            Attach Image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Question Type */}
        <div>
          <label className="block mb-2 font-medium">Select Question Type</label>
          <select
            value={questionType}
            onChange={(e) => {
              setQuestionType(e.target.value);
              setSelectedOptions([]);
            }}
            className="w-full border p-2 rounded"
          >
            <option value="MCQ">Multiple Choice</option>
            <option value="MSQ">Multiple Select</option>
            <option value="Numerical">Numerical</option>
          </select>
        </div>

        {/* Options */}
        <div>
          {(questionType === 'MCQ' || questionType === 'MSQ') && (
            <div className="grid grid-cols-1 gap-4">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  {questionType === 'MCQ' ? (
                    <input
                      type="radio"
                      name="mcqOption"
                      checked={selectedOptions.includes(index)}
                      onChange={() => handleRadioChange(index)}
                      className="w-4 h-4"
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={selectedOptions.includes(index)}
                      onChange={() => handleCheckboxChange(index)}
                      className="w-4 h-4"
                    />
                  )}

                  {optionImages[index] ? (
                    <div className="relative w-16 h-16">
                      <img
                        src={optionImages[index]}
                        alt={`Option ${index + 1}`}
                        className="object-cover w-full h-full rounded"
                      />
                      <button
                        onClick={() => handleRemoveOptionImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1"
                      >
                        &times;
                      </button>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(e, index)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-grow border p-2 rounded"
                    />
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleOptionImageUpload(e, index)}
                    className="hidden"
                    id={`optionImage${index}`}
                  />
                  <label
                    htmlFor={`optionImage${index}`}
                    className="cursor-pointer text-blue-600"
                  >
                    Attach Image
                  </label>
                </div>
              ))}
            </div>
          )}

          {questionType === 'Numerical' && (
            <input
              type="number"
              placeholder="Enter the numerical answer..."
              className="w-full border p-2 rounded"
            />
          )}
        </div>

        {/* Marks */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePositiveIncrement}
              className="px-2 py-1 bg-gray-200 rounded"
            >
              +
            </button>
            <input
              type="number"
              value={positiveValue}
              onChange={(e) => setPositiveValue(e.target.value)}
              className="w-16 text-center border p-1 rounded"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleNegativeDecrement}
              className="px-2 py-1 bg-gray-200 rounded"
            >
              -
            </button>
            <input
              type="number"
              value={negativeValue}
              onChange={(e) => setNegativeValue(e.target.value)}
              className="w-16 text-center border p-1 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question;
