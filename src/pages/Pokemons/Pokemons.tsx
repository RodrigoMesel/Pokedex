import './Pokemons.css';
import PokemonCard from '../../components/PokemonCard/PokemonCard';
import { useGetPokemonPaginationQuery } from '../../redux/slices/pokemon-api-slice';
import { useState } from 'react';
import { Button, Spinner } from '@fluentui/react-components';
import { POKEMON_API_START_PAGE } from '../../consts/pokemon-api-consts';

function Pokemons() {

  const [ page, setPage ] = useState<number>(1);
  const [ actualUrl, setActualUrl] = useState<string>(POKEMON_API_START_PAGE);
  const { data, isLoading } = useGetPokemonPaginationQuery(actualUrl);

  function updatePage(newUrl: string | null, newPage: number) {
    if(newUrl !== null) {
      setPage(newPage);
      const urlHelper = newUrl.split('?');
      setActualUrl(urlHelper[1]);
    }
  }

  return (
      <div className="App">
        <header className="App-header">
          <h2>Pokémon List</h2>
          <div className='grid'>
            {(!isLoading && data !== undefined) ? 
              (data!.results.map((pokemon, index) => (
                <PokemonCard 
                    key={index}
                    name={pokemon.name}
                    originalName={pokemon.name}
                    isPokedex={false}
                />
              )))
              :
              (<Spinner/>)  
            }
          </div>
          <div className='footer'>
            <Button className='button' onClick={() => {
                updatePage(data!.previous, page - 1);
            }}> Prev </Button>
            <p>{page}</p>
            <Button className='button' onClick={() => {
                updatePage(data!.next, page + 1)
            }}> Next </Button>
        </div>
        </header>
      </div>

  );
}

export default Pokemons;
