import React, { useState } from 'react';
import { VLabLayout } from '../VLabWrapper';

function PostTest() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const questions = [
    {
      id: 1,
      question: "After analyzing a region, you observe a G-R plot with a steep slope (high b-value ~1.5). What does this indicate?",
      options: [
        "The region has many large earthquakes relative to small ones",
        "The region has many small earthquakes relative to large ones",
        "All earthquakes have the same magnitude",
        "No seismic activity"
      ],
      correct: 1
    },
    {
      id: 2,
      question: "You analyzed Japan and found most earthquakes at depths of 50-200 km. This suggests:",
      options: [
        "A mid-ocean ridge setting",
        "A transform fault",
        "A subduction zone with intermediate depth seismicity",
        "Intraplate continental setting"
      ],
      correct: 2
    },
    {
      id: 3,
      question: "In temporal analysis, you observe a cluster of earthquakes over a few months. This is most likely:",
      options: [
        "Random background seismicity",
        "A main shock followed by aftershocks",
        "Volcanic tremor",
        "Instrument malfunction"
      ],
      correct: 1
    },
    {
      id: 4,
      question: "If you search for earthquakes with minimum magnitude 7.0 and find only 5 events over 100 years:",
      options: [
        "The region has no seismic hazard",
        "Large (M≥7.0) earthquakes are rare but possible in this region",
        "The catalogue is incomplete",
        "All earthquakes are less than magnitude 7.0"
      ],
      correct: 1
    },
    {
      id: 5,
      question: "What is the primary application of understanding the G-R relationship?",
      options: [
        "Predicting exact time of future earthquakes",
        "Estimating probability of different magnitude earthquakes for hazard assessment",
        "Stopping earthquakes",
        "Measuring earthquake intensity"
      ],
      correct: 1
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
    <VLabLayout activeSection="posttest" breadcrumbText="Post Test">
      <section className="content-header">
        <h1 align="center">
          Post-Test: Application of Seismicity Analysis
        </h1>
      </section>
      
      <section className="content">
        <div className="callout callout-success">
          <h4><i className="icon fa fa-check"></i> Test Your Understanding</h4>
          <p>
            Now that you've completed the simulation, test your understanding of practical 
            seismicity analysis and data interpretation.
          </p>
        </div>

        {submitted && (
          <div className={`alert alert-${score >= 4 ? 'success' : score >= 3 ? 'warning' : 'danger'}`}>
            <h4><i className={`icon fa fa-${score >= 4 ? 'check' : 'warning'}`}></i> Your Score: {score} / {questions.length}</h4>
            <p>
              {score >= 4 && "Outstanding! You have mastered the seismicity analysis concepts."}
              {score >= 3 && score < 4 && "Well done! Review areas where you had difficulty."}
              {score < 3 && "Consider revisiting the simulation and theory section."}
            </p>
            <button onClick={handleReset} className="btn btn-success">
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
              className="btn btn-success btn-lg"
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

export default PostTest;
