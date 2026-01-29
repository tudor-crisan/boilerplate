export default function Main({ className = "", children }) {
  return <main className={`${className} min-h-screen`}>{children}</main>;
}
