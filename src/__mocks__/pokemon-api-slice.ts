export const useGetPokemonPaginationQuery = jest.fn();
export const useGetPokemonInfosQuery = jest.fn();

export const pokemonApiSlice = {
    reducerPath: 'pokemonApi',
    reducer: jest.fn(),
    middleware: jest.fn(),
    endpoints: {
      getPokemonPagination: jest.fn(),
      getPokemonInfos: jest.fn(),
    },
  };