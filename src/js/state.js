function formatPokemon(data) {
  return {
    name: data.name,
    health: {
      initial: data.stats[0].base_stat,
      current: data.stats[0].base_stat,
      bar: "green",
    },
    avatar: data.sprites.other["official-artwork"].front_default,
    types: data.types.map((item) => ({ name: item.type.name })),
    moves: data.moves.slice(0, 4).map((item) => ({ name: item.move.name })),
    _ui: {
      bar: null,
      health: null,
    },
  };
}

async function getPokemon() {

  const id = getRandomNumber(898);
  const data = await $.ajax({
    url: `https://pokeapi.co/api/v2/pokemon/${id}`,
    method: "GET",
  });
  return formatPokemon(data);
}

async function getState() {

  const data = await Promise.all([getPokemon(), getPokemon()]);
  return {
    pokemons: data,
    position: getRandomNumber(1, 0),
  };
}
