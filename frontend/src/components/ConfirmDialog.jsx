const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmLabel = "Delete", isDanger = true }) => {
  if (!isOpen) return null;

  return (
    // Backdrop — clicking it also cancels
    <div className="dialog-backdrop" onClick={onCancel}>
      <div
        className="dialog-box"
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click from firing
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <div className="dialog-icon">{isDanger ? "🗑️" : "❓"}</div>
        <h3 id="dialog-title" className="dialog-title">{title}</h3>
        <p className="dialog-message">{message}</p>
        <div className="dialog-actions">
          <button
            id="dialog-cancel"
            onClick={onCancel}
            className="btn btn-ghost"
          >
            Cancel
          </button>
          <button
            id="dialog-confirm"
            onClick={onConfirm}
            className={`btn ${isDanger ? "btn-danger-solid" : "btn-primary"}`}
            autoFocus
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
