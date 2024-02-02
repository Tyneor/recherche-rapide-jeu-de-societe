<script lang="ts">
  import { onMount } from "svelte";

  export let history: unknown[];
  $: console.log(history);

  onMount(() => {
    searchElt.focus();
  });

  let searchElt: HTMLInputElement;
  let gameName: string;

  const search = () => {};
</script>

<h1>Recherche de jeu</h1>
<form on:submit|preventDefault={search}>
  <input bind:this={searchElt} type="search" bind:value={gameName} placeholder="Monopoly" />
</form>
{gameName}
