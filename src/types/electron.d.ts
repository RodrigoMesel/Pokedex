import { PokemonType } from "../redux/slices/pokedex-slice";

declare global {
    interface Window {
      electronAPI: {
        setPokedex: (pokedex: PokemonType[], user: string) => void
        receiveInitialUser: (callback: (userName: string) => void) => void;
        getUserPokedex: (user: string) => Promise<PokemonType[]>
      };
    }
  }
  
  export {};
  