const FormField = ({ label, name, error, ...inputProps }) => {
  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">{label}</label>
      <input
        id={name}
        name={name}
        className={`form-input ${error ? "input-error" : ""}`}
        {...inputProps}
      />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
};

export default FormField;
