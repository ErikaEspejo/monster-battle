(function () {
  let state;

  // Setup
  function setup() {
    const { pokemons = [] } = state;
    const arena = $("#arena");
    const columns = $(".column");

    pokemons.forEach((pokemon, index) => {
      const container = columns[index];
      const containers = choose(pokemon);

      if (index === 0) {
        $(container).append(containers);
      } else {
        $(container).append(containers.reverse());
      }

      const [bar] = $(container).find(".bar");
      const [health] = $(container).find(".health");

      pokemon._ui.bar = bar;
      pokemon._ui.health = health;
    });
  }

  function turn() {
    const { pokemons = [], position = 0 } = state;
    const attacked = (position + 1) % 2;
    const pokemon = pokemons[attacked];

    // Turn
    const { newHealth, newPercentage } = calculateStatus(
      pokemon.health.initial,
      pokemon.health.current,
      getRandomNumber(20)
    );
    const newBarColor = calculateBarColor(newPercentage);
    const previousBarColor = pokemon.health.bar;

    // Update State
    pokemon.health.current = newHealth;
    pokemon.health.bar = newBarColor;

    // Update UI
    $(pokemon._ui.bar)
      .attr("style", `width: ${newPercentage}%`)
      .removeClass(previousBarColor)
      .addClass(newBarColor);

    $(pokemon._ui.health).text(
      `${pokemon.health.current}/${pokemon.health.initial}`
    );

    // Animations
    const pokemonActive = $($("#arena .column")[position]).find("img");

    const dirLeft = position === 0 ? "+" : "-";
    const dirTop = position === 0 ? "-" : "+";
    $(pokemonActive).animate(
      {
        "margin-left": `${dirLeft}=150px`,
        "margin-top": `${dirTop}=100px`,
      },
      100
    );
    $(pokemonActive).animate(
      {
        "margin-left": `${dirTop}=150px`,
        "margin-top": `${dirLeft}=100px`,
      },
      100
    );

    const pokemonAttacked = $($("#arena .column")[attacked]).find("img");

    $(pokemonAttacked).animate({ "margin-left": "-=50px" }, 100);
    $(pokemonAttacked).animate({ "margin-left": "+=50px" }, 100);
    $(pokemonAttacked).animate({ "margin-left": "+=50px" }, 100);
    $(pokemonAttacked).animate({ "margin-left": "-=50px" }, 100);

    if (pokemon.health.current > 0) {
      state.position = (state.position + 1) % 2;
      render();
    } else {
      $("#panel .message").text("Wins!!!");
      $("#panel .moves button").attr("disabled", "");
    }
  }

  function render() {
    const { pokemons = [], position = 0 } = state;
    const pokemon = pokemons[position];

    const panel = $("#panel");

    const message = "What attack do you want to use?";
    const [dialogContainer, movesContainer] = controls(pokemon, message, turn);
    const [left, right] = $(panel).children();

    if (position === 0) {
      $(left).empty().append(dialogContainer);
      $(right).empty().append(movesContainer);
    } else {
      $(left).empty().append(movesContainer);
      $(right).empty().append(dialogContainer);
    }

    const indicator = $("#indicator");

    $(indicator)
      .find(".column")
      .each(function (index) {
        if (index === position) {
          $(this).html(`<div class="arrow"></div>`);
        } else {
          $(this).empty();
        }
      });
  }

  $(document).ready(async (event) => {
    state = await getState();
    setup();
    render();
  });
})();
