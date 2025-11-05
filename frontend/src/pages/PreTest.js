import React, { useState } from 'react';
import { VLabLayout } from '../VLabWrapper';

function PreTest() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const questions = [
    {
      id: 1,
      question: "What does the Gutenberg-Richter law describe?",
      options: [
        "The depth distribution of earthquakes",
        "The relationship between earthquake frequency and magnitude",
        "The speed of seismic waves",
        "The duration of earthquake shaking"
      ],
      correct: 1
    },
    {
      id: 2,
      question: "What is the typical value of the b-value in the Gutenberg-Richter relationship?",
      options: [
        "Approximately 0.1",
        "Approximately 0.5",
        "Approximately 1.0",
        "Approximately 10.0"
      ],
      correct: 2
    },
    {
      id: 3,
      question: "Which magnitude scale is used in the ISC-GEM catalogue?",
      options: [
        "Richter magnitude (ML)",
        "Body wave magnitude (mb)",
        "Surface wave magnitude (Ms)",
        "Moment magnitude (Mw)"
      ],
      correct: 3
    },
    {
      id: 4,
      question: "Earthquakes occurring at depths greater than 300 km are classified as:",
      options: [
        "Shallow earthquakes",
        "Intermediate earthquakes",
        "Deep earthquakes",
        "Surface earthquakes"
      ],
      correct: 2
    },
    {
      id: 5,
      question: "What time period does the ISC-GEM catalogue cover?",
      options: [
        "1800-2000",
        "1850-2020",
        "1904-2021",
        "1950-2021"
      ],
      correct: 2
    }
  ];

  const handleAnswerChange = (questionId, answerIndex) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  return (
    <VLabLayout activeSection="pretest" breadcrumbText="Pre Test">
      <section className="content-header">
        <h1 align="center">
          Pre-Test: Seismicity Analysis
        </h1>
      </section>
      
      <section className="content">
        <div className="callout callout-info">
          <h4><i className="icon fa fa-info-circle"></i> Instructions</h4>
          <p>
            Test your understanding of basic seismology concepts before starting the simulation. 
            Select one answer for each question and click Submit when complete.
          </p>
        </div>

        {submitted && (
          <div className={`alert alert-${score >= 4 ? 'success' : score >= 3 ? 'warning' : 'danger'}`} style={{marginTop: '20px'}}>
            <h4><i className={`icon fa fa-${score >= 4 ? 'check' : 'warning'}`}></i> Your Score: {score} / {questions.length}</h4>
            <p>
              {score >= 4 && "Excellent! You have a strong understanding of the concepts."}
              {score >= 3 && score < 4 && "Good job! Review the theory section for areas you missed."}
              {score < 3 && "Please review the theory section before proceeding."}
            </p>
            <button onClick={handleReset} className="btn btn-primary">
              <i className="fa fa-refresh"></i> Retake Test
            </button>
          </div>
        )}

        {questions.map((q, index) => (
          <div key={q.id} className="box box-default" style={{marginTop: '20px'}}>
            <div className={`box-header with-border ${
              submitted 
                ? answers[q.id] === q.correct 
                  ? 'bg-green' 
                  : 'bg-red'
                : ''
            }`}>
              <h3 className="box-title">
                <strong>Question {index + 1}:</strong> {q.question}
              </h3>
            </div>
            <div className="box-body">
              {q.options.map((option, optionIndex) => (
                <div key={optionIndex} className="form-group">
                  <label style={{fontWeight: 'normal', cursor: 'pointer'}}>
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      checked={answers[q.id] === optionIndex}
                      onChange={() => handleAnswerChange(q.id, optionIndex)}
                      disabled={submitted}
                      style={{marginRight: '10px'}}
                    />
                    {option}
                    {submitted && optionIndex === q.correct && (
                      <span className="label label-success" style={{marginLeft: '10px'}}>
                        <i className="fa fa-check"></i> Correct
                      </span>
                    )}
                    {submitted && answers[q.id] === optionIndex && optionIndex !== q.correct && (
                      <span className="label label-danger" style={{marginLeft: '10px'}}>
                        <i className="fa fa-times"></i> Incorrect
                      </span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

        {!submitted && (
          <div style={{marginTop: '30px', textAlign: 'center'}}>
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== questions.length}
              className="btn btn-primary btn-lg"
            >
              <i className="fa fa-check"></i> Submit Answers
            </button>
            {Object.keys(answers).length !== questions.length && (
              <p style={{marginTop: '10px', color: '#999'}}>
                Please answer all questions before submitting
              </p>
            )}
          </div>
        )}
      </section>
    </VLabLayout>
  );
}

export default PreTest;
