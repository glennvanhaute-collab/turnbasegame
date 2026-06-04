<template>
  <div class="raids-view">
    <div class="coming-soon">
      <div class="cs-icon">⚔</div>
      <h2 class="cs-title">Raids</h2>
      <p class="cs-sub">Summon your full warband to assault fortified strongholds. Defeat legendary raid bosses with unique mechanics and earn exclusive rewards.</p>
      <div class="cs-tag">Coming Soon</div>
    </div>
  </div>
</template>

<style scoped>
.raids-view {
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}
.coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  max-width: 440px;
}
.cs-icon {
  font-size: 3rem;
  opacity: 0.3;
}
.cs-title {
  font-family: var(--font-head);
  font-size: 1.4rem;
  color: var(--gold);
  letter-spacing: 3px;
  text-transform: uppercase;
}
.cs-sub {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.7;
}
.cs-tag {
  font-family: var(--font-head);
  font-size: 0.6rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-dim);
  border: 1px solid var(--border-brown);
  border-radius: 20px;
  padding: 4px 14px;
}
</style>
