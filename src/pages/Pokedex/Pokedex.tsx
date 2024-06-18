import './Pokedex.css';
import { useAppSelector } from '../../redux/hooks';
import PokemonCard from '../../components/PokemonCard/PokemonCard';
import { useContext, useMemo } from 'react';
import { PokemonType } from '../../redux/slices/pokedex-slice';
import SearchBar from '../../components/SearchBar/SearchBar';
import PokedexOptions from '../../components/PokedexOptions/PokedexOptions';
import { AppContext } from '../../context/app-context';
import ResetPokedex from '../../components/ResetPokedex/ResetPokedex';

function Pokedex() {

  const captured = useAppSelector((state) => state.pokedex.captured);
  const loggedUser = useAppSelector((state) => state.user.loggedUser);
  const {filterName, setFilterName, filterTypes, ascendingOrder} = useContext(AppContext);

  const filterPokemons = (pokemons : PokemonType[], filterName: string, filterTypes: string[]) => {

    if(pokemons === undefined || pokemons === null) {
      return []
    }
    
    if(filterTypes.length > 0) {
      pokemons = pokemons.filter(c => filterTypes.includes(c.type));
    }

    if(filterName !== "") {
      pokemons = pokemons.filter(c => c.name.toLowerCase().includes(filterName.toLowerCase()) ||
      c.originalName.toLowerCase().includes(filterName.toLowerCase()));
    }

    return pokemons.sort((a, b) => 
      (ascendingOrder ? 
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()) :
        (b.name.toLowerCase().localeCompare(a.name.toLowerCase()))))
  }

  const filteredPokemons = useMemo(() => {
    return filterPokemons(captured, filterName, filterTypes);
  }, [captured, filterName, filterTypes, ascendingOrder]);

  return (
    <div className="Pokedex-container">
      <div className="App-header">
        <h2>{loggedUser.name}'s Pokédex</h2>

        <div className='App-sub-header'>
          <SearchBar filterName={filterName} setFilterName={setFilterName}/>
          <p className='captured'>Total captured: {captured.length}</p>
          <PokedexOptions 
            pokedex={captured}/>
        </div>
      </div>

      <div className='pokedexgrid'>
          {filteredPokemons.length > 0 ? 
            filteredPokemons.map((pokemon, index) => (
              <PokemonCard 
                key={index}
                name={pokemon.name}
                originalName={pokemon.originalName}
                id={pokemon.id}
                isPokedex={true}/>
            )) 
            :
            <p>No Pokémon found with those filters</p>
          }
        </div>

        <div className='resetPokedex'>
          <ResetPokedex/>
        </div>
    </div>
  );
}

export default Pokedex;
