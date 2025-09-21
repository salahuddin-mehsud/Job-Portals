import React from 'react';
import Icon from 'components/AppIcon';

const ScreeningQuestions = ({ questions, onChange }) => {
  // Question types
  const questionTypes = [
    { value: 'text', label: 'Text Answer' },
    { value: 'yes_no', label: 'Yes/No' },
    { value: 'multiple_choice', label: 'Multiple Choice' },
    { value: 'file_upload', label: 'File Upload' }
  ];
  
  // Add option to a multiple choice question
  const addOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    if (!updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options = [];
    }
    updatedQuestions[questionIndex].options.push({ text: '' });
    onChange(updatedQuestions);
  };
  
  // Update option text
  const updateOption = (questionIndex, optionIndex, text) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].text = text;
    onChange(updatedQuestions);
  };
  
  // Remove option
  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    onChange(updatedQuestions);
  };
  
  // Update question
  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    
    // Initialize options array if type is multiple_choice
    if (field === 'type' && value === 'multiple_choice' && !updatedQuestions[index].options) {
      updatedQuestions[index].options = [{ text: '' }];
    }
    
    onChange(updatedQuestions);
  };
  
  // Remove question
  const removeQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    onChange(updatedQuestions);
  };
  
  // If no questions, show a message
  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-4 border border-dashed border-border rounded-md">
        <p className="text-text-secondary">No screening questions added yet.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {questions.map((question, questionIndex) => (
        <div key={questionIndex} className="border border-border rounded-md p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <input
                type="text"
                value={question.question || ''}
                onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                placeholder="Enter your question"
                className="input-field mb-2"
              />
              
              <div className="flex flex-wrap items-center gap-4">
                <select
                  value={question.type || 'text'}
                  onChange={(e) => updateQuestion(questionIndex, 'type', e.target.value)}
                  className="input-field w-auto"
                >
                  {questionTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={question.required || false}
                    onChange={(e) => updateQuestion(questionIndex, 'required', e.target.checked)}
                    className="w-4 h-4 text-primary border-secondary-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-text-primary">Required</span>
                </label>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => removeQuestion(questionIndex)}
              className="text-text-secondary hover:text-error transition-smooth ml-2"
            >
              <Icon name="Trash2" size={18} />
            </button>
          </div>
          
          {question.type === 'multiple_choice' && (
            <div className="mt-2 pl-4 border-l-2 border-border-light">
              <p className="text-sm text-text-secondary mb-2">Answer Options:</p>
              
              {question.options && question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center mb-2">
                  <div className="w-4 h-4 rounded-full border border-secondary-300 mr-2 flex-shrink-0"></div>
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                    placeholder={`Option ${optionIndex + 1}`}
                    className="input-field flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(questionIndex, optionIndex)}
                    className="text-text-secondary hover:text-error transition-smooth ml-2"
                    disabled={question.options.length <= 1}
                  >
                    <Icon name="X" size={16} />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => addOption(questionIndex)}
                className="text-primary text-sm font-medium flex items-center mt-2"
              >
                <Icon name="Plus" size={16} className="mr-1" />
                Add Option
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ScreeningQuestions;