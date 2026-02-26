interface CountdownViewProps {
  readonly secondsRemaining: number;
}

export const CountdownView = ({ secondsRemaining }: CountdownViewProps) => {
  return (
    <section className="countdown-card view-transition view-enter">
      <p className="countdown-label">Get Ready</p>
      <p className="countdown-value">{secondsRemaining}</p>
      <p className="countdown-subtitle">Board will appear when countdown ends.</p>
    </section>
  );
};
