interface Win98IconProps {
  icon: string;
  label: string;
  onClick: () => void;
}

export default function Win98Icon({ icon, label, onClick }: Win98IconProps) {
  return (
    <div className="win98-icon" onDoubleClick={onClick} title={`Double-click to open ${label}`}>
      <div className="win98-icon-image">{icon}</div>
      <span className="win98-icon-label">{label}</span>
    </div>
  );
}
