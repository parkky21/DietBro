export default function StepIndicator({ currentStep }) {
  return (
    <>
      <div className="step-indicator">
        <div className={`step-dot ${currentStep > 1 ? 'done' : 'active'}`}>
          {currentStep > 1 ? '✓' : '1'}
        </div>
        <div className={`step-line ${currentStep > 1 ? 'done' : ''}`}></div>
        
        <div className={`step-dot ${currentStep > 2 ? 'done' : currentStep === 2 ? 'active' : ''}`}>
          {currentStep > 2 ? '✓' : '2'}
        </div>
        <div className={`step-line ${currentStep > 2 ? 'done' : ''}`}></div>
        
        <div className={`step-dot ${currentStep === 3 ? 'active' : ''}`}>
          3
        </div>
      </div>
      <div className="step-labels">
        <div className={`step-label ${currentStep === 1 ? 'active' : ''}`}>who r u</div>
        <div className={`step-label ${currentStep === 2 ? 'active' : ''}`}>what u eat</div>
        <div className={`step-label ${currentStep === 3 ? 'active' : ''}`}>ur W plan</div>
      </div>
    </>
  );
}
