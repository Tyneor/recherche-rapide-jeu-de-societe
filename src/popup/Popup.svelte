<script lang="ts">
  import { onMount } from "svelte";
  import { fetchGames, searchGames, type Game } from "./bgg";

  export let history: unknown[];
  $: console.log(history);

  onMount(() => {
    searchElt.focus();
  });

  let searchElt: HTMLInputElement;
  let searchValue: string;

  let games: Game[] = [];

  const search = async () => {
    const searchedGames = await searchGames(searchValue);
    games = await fetchGames(...searchedGames.map((g) => g.id));
    games.sort((a, b) => b.ratings.userCount - a.ratings.userCount);
    console.log(games);
  };
</script>

{#if games.length > 0}
  <div class="games">
    {#each games as game}
      <div class="game">
        <div class="img-container">
          <img src={game.thumbnail} alt="" />
        </div>

        <div class="right">
          <a href={game.link} title="{game.name} • {game.link}" target="_blank"><h1>{game.name}</h1></a>
          <span>Year: {game.yearPublished}</span>
          {#if game.ratings.globalRank}
            <div class="line">
              <span>Rank: {game.ratings.globalRank}</span>
              {#if game.ratings.familyRankCategory}
                <span>{game.ratings.familyRankCategory.split(" ")[0]}: {game.ratings.familyRank}</span>
              {/if}
            </div>
          {/if}
          <div class="line">
            <span>Rating: {game.ratings.geekAverage.toFixed(2)}</span>
            <span>{game.ratings.userCount} users average rating: {game.ratings.average.toFixed(2)}</span>
          </div>
        </div>
      </div>
    {/each}
  </div>
{:else}
  <form on:submit|preventDefault={search}>
    <input bind:this={searchElt} type="search" bind:value={searchValue} placeholder="Monopoly" />
  </form>
{/if}

<style lang="scss">
  .games {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    .game {
      height: 100px;
      display: flex;
      gap: 0.5rem;

      .img-container {
        width: 100px;
        height: 100px;
        display: grid;
        place-items: center;

        > img {
          max-width: 100px;
          max-height: 100px;
        }
      }

      .right {
        min-width: 0;
        display: flex;
        flex-direction: column;

        h1 {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 1rem;
          color: #161616;
        }

        .line {
          display: flex;
          gap: 1rem;
        }
      }
    }
  }

  form {
    height: 100px;
    display: grid;
    place-items: center;

    input {
      border: none;
      outline: none;
      background-color: rgb(248, 233, 255);
      padding: 0.5rem;
      font-size: 1rem;
    }
  }
</style>
