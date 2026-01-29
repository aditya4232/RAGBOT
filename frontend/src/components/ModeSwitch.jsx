function ModeSwitch({ mode, onModeChange }) {
  const handleToggle = () => {
    const newMode = mode === 'local' ? 'cloud' : 'local';
    onModeChange(newMode);
    localStorage.setItem('chatMode', newMode);
  };

  return (
    <div className="mode-switch">
      <span className={`mode-label ${mode === 'local' ? 'active' : ''}`}>
        Local RAG
      </span>
      <button 
        className={`toggle-btn ${mode === 'cloud' ? 'cloud' : ''}`}
        onClick={handleToggle}
        aria-label="Toggle between Local RAG and Cloud API"
      >
        <span className="toggle-slider"></span>
      </button>
      <span className={`mode-label ${mode === 'cloud' ? 'active' : ''}`}>
        Cloud API
      </span>
    </div>
  );
}

export default ModeSwitch;
