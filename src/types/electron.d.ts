import { PokemonType } from "../redux/slices/pokedex-slice";
import { user } from "../redux/slices/users-slice";

declare global {
    interface Window {
      electronAPI: {
        setPokedex: (pokedex: PokemonType[], user: user) => void
        receiveInitialUser: (callback: (user: user) => void) => void;
        getUserPokedex: (user: user) => Promise<PokemonType[]>
        tradePokemons: (pokemon: PokemonType, userOwner: user, userDestiny: user) => Promise<PokemonType[]>
      };
    }
  }
  
  export {};
  