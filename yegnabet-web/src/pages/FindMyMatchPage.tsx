import { useNavigate } from "react-router-dom";

import { AppShell } from "../components/layout/AppShell";
import { PageContainer } from "../components/layout/PageContainer";
import { MatchIntro } from "../components/match/MatchIntro";

export function FindMyMatchPage() {
  const navigate = useNavigate();

  return (
    <AppShell>
      <PageContainer>
        <MatchIntro
          onStart={() =>
            navigate(
              "/match/preferences"
            )
          }
        />
      </PageContainer>
    </AppShell>
  );
}