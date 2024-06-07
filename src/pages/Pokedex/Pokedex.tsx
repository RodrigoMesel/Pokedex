import './Pokedex.css';
import { useAppSelector } from '../../redux/hooks';
import PokemonCard from '../../components/PokemonCard/PokemonCard';

function Pokedex() {

  const captured = useAppSelector((state) => state.pokedex.captured);
  const loggedUser = useAppSelector((state) => state.user.loggedUser);

  return (
    <div className="App">
      <header className="App-header">
        <h2>{loggedUser.name}'s Pokédex</h2>
        <p>Total captured: {captured.length}</p>
        <div className='pokedexgrid'>

          {captured.map((pokemon, index) => (
            <PokemonCard 
              key={index}
              name={pokemon.name}
              originalName={pokemon.originalName}
              isPokedex={true}/>
          ))}
        </div>
      </header>
    </div>
  );
}

export default Pokedex;
