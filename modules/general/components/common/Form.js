export default function Form({ className, onSubmit, children }) {
  return (
    <form onSubmit={onSubmit} className={`form-control ${className}`}>
      {children}
    </form>
  );
}
