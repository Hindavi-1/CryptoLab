import ChallengeOne from "./ChallengeOne";

export default function ChallengePage({ params }) {
  const { id } = params;

  if (id === "1") {
    return <ChallengeOne />;
  }

  // Fallback for unimplemented challenges
  return (
    <div style={{ padding: "100px 24px", textAlign: "center", color: "var(--text)" }}>
      <h1>Challenge #{id}</h1>
      <p style={{ marginTop: "16px", color: "var(--text-muted)" }}>
        This challenge is currently under construction. Check back soon!
      </p>
    </div>
  );
}
