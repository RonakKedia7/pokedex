import { first151Pokemon, getFullPokedexNumber } from "../utils/index";
import { useState } from "react";

const SideNav = ({
  selectedPokemon,
  setSelectedPokemon,
  handleToggleMenu,
  showSideMenu,
}) => {
  const [searchValue, setSearchValue] = useState("");

  const filteredPokemon = first151Pokemon.filter((elem, elemIndex) => {
    if (getFullPokedexNumber(elemIndex).includes(searchValue)) {
      return true;
    }
    if (elem.toLowerCase().includes(searchValue.toLowerCase())) {
      return true;
    }
    return false;
  });

  return (
    <nav className={`${!showSideMenu ? "open" : ""}`}>
      <div className={`header ${!showSideMenu ? "open" : ""}`}>
        <button onClick={handleToggleMenu} className="open-nav-button">
          <i className="fa-solid fa-arrow-left-long"></i>
        </button>
        <h1 className="text-gradient">Pokedex</h1>
      </div>
      <input
        placeholder="E.g. 001 or Bulba..."
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
      />
      {filteredPokemon.map((pokemon) => {
        const truePokedexNumber = first151Pokemon.indexOf(pokemon);
        return (
          <button
            onClick={() => {
              setSelectedPokemon(truePokedexNumber);
              handleToggleMenu();
            }}
            key={truePokedexNumber}
            className={`nav-card ${
              truePokedexNumber === selectedPokemon ? "nav-card-selected" : ""
            }`}
          >
            <p>{getFullPokedexNumber(truePokedexNumber)}</p>
            <p>{pokemon}</p>
          </button>
        );
      })}
    </nav>
  );
};

export default SideNav;
