import { useEffect, useState } from "react";
import { getPokedexNumber, getFullPokedexNumber } from "../utils/index";
import TypeCard from "./TypeCard";
import Modal from "./Modal";

const PokeCard = ({ selectedPokemon }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skill, setSkill] = useState(null);
  const [loadingSkill, setLoadingSkill] = useState(false);

  const { name, height, abilities, stats, types, moves, sprites } = data || {};

  const imgList = Object.keys(sprites || {}).filter((val) => {
    if (!sprites[val]) return false;
    if (["versions", "other"].includes(val)) return false;
    return true;
  });

  async function fetchMoveData(move, moveUrl) {
    if (loadingSkill || !localStorage || !moveUrl) return;

    // check cache for move
    let cache = {};
    if (localStorage.getItem("pokemon-moves")) {
      cache = JSON.parse(localStorage.getItem("pokemon-moves"));
    }

    if (move in cache) {
      setSkill(cache[move]);
      return;
    }

    // fetch information

    setLoadingSkill(true);
    try {
      const res = await fetch(moveUrl);
      const moveData = await res.json();

      const description = moveData?.flavor_text_entries.filter((val) => {
        return (val.version_group.name = "firered-leafgreen");
      })[0].flavor_text;

      const skillData = {
        name: move,
        description: description,
      };

      setSkill(skillData);
      cache[move] = skillData;
      localStorage.setItem("pokemon-moves", JSON.stringify(cache));
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoadingSkill(false);
    }
  }

  useEffect(() => {
    // if loading, exit loop
    if (loading || !localStorage) return;

    // check if the selected pokemon information is available in the cache

    // 1. define the cache
    let cache = {};
    if (localStorage.getItem("pokedex")) {
      cache = JSON.parse(localStorage.getItem("pokedex"));
    }

    // 2. check if the selected pokemon is in the cache, otherwise fetch api
    if (selectedPokemon in cache) {
      setData(cache[selectedPokemon]);
      return;
    }

    // we passed all the cache to no avail and now need to fetch the data from api

    async function fetchPokemonData() {
      setLoading(true);
      try {
        const baseUrl = "https://pokeapi.co/api/v2/";
        const suffix = `pokemon/${getPokedexNumber(selectedPokemon)}`;
        const finalUrl = baseUrl + suffix;

        const res = await fetch(finalUrl);
        const pokemonData = await res.json();
        console.log(pokemonData);

        setData(pokemonData);
        cache[selectedPokemon] = pokemonData;

        localStorage.setItem("pokedex", JSON.stringify(cache));
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPokemonData();

    // if we fetch from api,make sure to save the information to the cache for next time
  }, [selectedPokemon]);

  if (loading || !data) {
    return (
      <div>
        <h4>Loading...</h4>
      </div>
    );
  }

  return (
    <div className="poke-card">
      {skill && (
        <Modal handleCloseModal={() => setSkill(null)}>
          <div>
            <h6>Name</h6>
            <h2 className="skill-name">{skill.name.replace("-", " ")}</h2>
          </div>
          <div>
            <h6>Description</h6>
            <p>{skill.description}</p>
          </div>
        </Modal>
      )}
      <div>
        <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
        <h2>{name}</h2>
      </div>
      <div className="type-container">
        {types.map((typeObj, typeIndex) => {
          return <TypeCard key={typeIndex} type={typeObj?.type?.name} />;
        })}
      </div>
      <img
        className="default-img"
        src={`/pokemon/${getFullPokedexNumber(selectedPokemon)}.png`}
        alt={`${name}-large-img`}
      />
      <div className="img-container">
        {imgList.map((spriteUrl, spriteIndex) => {
          const imgUrl = sprites[spriteUrl];
          return (
            <img
              key={spriteIndex}
              src={imgUrl}
              alt={`${name}-img-${spriteUrl}`}
            />
          );
        })}
      </div>
      <h3>Stats</h3>
      <div className="stats-card">
        {stats.map((statObj, statIndex) => {
          const { stat, base_stat } = statObj;
          return (
            <div key={statIndex} className="stat-item">
              <p>{stat?.name.replaceAll("-", " ")}</p>
              <h4>{base_stat}</h4>
            </div>
          );
        })}
      </div>
      <h3>Moves</h3>
      <div className="pokemon-move-grid">
        {moves.map((moveObj, moveIndex) => {
          return (
            <button
              className="button-card pokemon-move"
              key={moveIndex}
              onClick={() =>
                fetchMoveData(moveObj?.move?.name, moveObj?.move?.url)
              }
            >
              <p>{moveObj?.move?.name.replaceAll("-", " ")}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PokeCard;
