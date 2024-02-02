<script lang="ts">
  import { onMount } from "svelte";
  import { fetchGame, type Game } from "./bgg";
  import { getTagValue } from "../lib/xml";

  export let history: unknown[];
  $: console.log(history);

  onMount(() => {
    searchElt.focus();
  });

  let searchElt: HTMLInputElement;
  let searchValue: string;

  let game: Game | null = null;

  const search = async () => {
    game = await fetchGame(344258);
  };
</script>

<h1>Recherche de jeu</h1>
<form on:submit|preventDefault={search}>
  <input bind:this={searchElt} type="search" bind:value={searchValue} placeholder="Monopoly" />
</form>

<pre>{JSON.stringify(game, null, 2)}</pre>

{#if game}
  <img src={game.thumbnail} alt="" />
{/if}
