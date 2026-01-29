const Divider = ({
  className = "divider text-xs font-bold opacity-50 my-1",
  children = "OR",
}) => {
  return <div className={className}>{children}</div>;
};

export default Divider;
