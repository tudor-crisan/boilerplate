export const SettingsContainer = ({ children }) => (
  <div className="space-y-4 pb-2">{children}</div>
);

export const SettingsItem = ({ children }) => (
  <div className="space-y-1">{children}</div>
);

export const SettingsRow = ({ children }) => (
  <div className="grid grid-cols-2 gap-4">{children}</div>
);
