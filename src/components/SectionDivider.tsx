export default function SectionDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`section-divider ${className}`}>
      <div className="diamond" />
    </div>
  );
}
