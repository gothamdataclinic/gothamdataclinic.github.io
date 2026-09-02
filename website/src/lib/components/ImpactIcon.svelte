<script lang="ts">
  type ImpactIcon = 'workshops' | 'building' | 'publishing'

  let { type }: { type: ImpactIcon } = $props()
</script>

<div class="impact-icon impact-icon--{type}" aria-hidden="true">
  {#if type === 'workshops'}
    <svg viewBox="0 0 72 72" role="img">
      <path class="paper" d="M17 15h38v30H17z" />
      <path class="board" d="M21 19h30v20H21z" />
      <path class="chalk" d="M25 25h12v3H25zm0 7h20v3H25z" />
      <path class="hands" d="M17 61C13 57 11 51 11 44M55 61c4-4 6-10 6-17" />
      <circle class="person" cx="22" cy="50" r="5" />
      <path class="person" d="M11 66c0-8 4-12 11-12s11 4 11 12z" />
      <circle class="person" cx="50" cy="50" r="5" />
      <path class="person" d="M39 66c0-8 4-12 11-12s11 4 11 12z" />
    </svg>
  {:else if type === 'building'}
    <svg viewBox="0 0 72 72" role="img">
      <path class="back" d="M12 28h22v32H12z" />
      <path class="front" d="M30 16h30v44H30z" />
      <path class="roof" d="m27 18 18-9 18 9z" />
      <path class="windows" d="M18 35h8v7h-8zm0 13h8v7h-8zm20-22h7v8h-7zm10 0h7v8h-7zM38 40h7v8h-7zm10 0h7v8h-7z" />
      <path class="door" d="M43 51h8v9h-8z" />
    </svg>
  {:else}
    <svg viewBox="0 0 72 72" role="img">
      <path class="book-left" d="M8 18c11-2 20 1 28 8v37c-8-7-17-10-28-8z" />
      <path class="book-right" d="M64 18c-11-2-20 1-28 8v37c8-7 17-10 28-8z" />
      <path class="pages" d="M15 28c6 0 11 2 16 5v4c-5-3-10-5-16-5zm0 10c6 0 11 2 16 5v4c-5-3-10-5-16-5zm42-10c-6 0-11 2-16 5v4c5-3 10-5 16-5zm0 10c-6 0-11 2-16 5v4c5-3 10-5 16-5z" />
      <path class="pencil" d="m52 8 8 8-19 19-10 3 3-10z" />
      <path class="pencil-tip" d="m31 38 3-10 7 7z" />
    </svg>
  {/if}
</div>

<style>
  .impact-icon {
    width: 4.5rem;
    height: 4.5rem;
    margin-bottom: 1.5rem;
  }

  svg { width: 100%; height: 100%; display: block; }

  .impact-icon--workshops .paper { fill: #ffd166; }
  .impact-icon--workshops .board { fill: #1d2b4a; }
  .impact-icon--workshops .chalk { fill: #f3f5fa; }
  .impact-icon--workshops .person { fill: #d9581f; }
  .impact-icon--workshops .hands { fill: none; stroke: #d9581f; stroke-width: 5; stroke-linecap: round; stroke-linejoin: round; }

  .impact-icon--building .back { fill: #55b5a6; }
  .impact-icon--building .front { fill: #d9581f; }
  .impact-icon--building .roof { fill: #1d2b4a; }
  .impact-icon--building .windows { fill: #ffd166; }
  .impact-icon--building .door { fill: #3d4a73; }

  .impact-icon--publishing .book-left { fill: #55b5a6; }
  .impact-icon--publishing .book-right { fill: #ffd166; }
  .impact-icon--publishing .pages { fill: #1d2b4a; }
  .impact-icon--publishing .pencil { fill: #d9581f; }
  .impact-icon--publishing .pencil-tip { fill: #1d2b4a; }
</style>
