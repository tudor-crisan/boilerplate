
export const EmailBody = ({ children, style }) => (
  <body style={{ margin: 0, padding: 0, ...style }}>
    {children}
  </body>
);

export const EmailContainer = ({ children, style }) => (
  <div style={style}>
    {children}
  </div>
);

export const EmailButton = ({ href, children, style }) => (
  <a href={href} style={{
    display: 'inline-block',
    textDecoration: 'none',
    ...style
  }}>
    {children}
  </a>
);



export const GenericLayout = ({ font, fontImportName, children }) => {
  return (
    <html>
      {children}
    </html>
  );
};
