import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface PokemonType{
    name: string,
}

interface PokemonQueryReturn{
    counter: number,
    next: string | null,
    previous: string | null,
    results: [PokemonType]
}

interface PokemonInfosType{
  sprites: {
    front_default: string
  },
  weight: number,
  height: number,
  types: [{
    slot: number,
    type: {
      name: string
    }
  }]
}

export const pokemonApiSlice = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({
     baseUrl: 'https://pokeapi.co/api/v2/pokemon'
     }),
  endpoints: (builder) => ({
    getPokemonPagination: builder.query<PokemonQueryReturn, string>({
      query: (completePath,) => `?${completePath}`,
    }),
    getPokemonInfos: builder.query<PokemonInfosType, string>({
        query: (name) => `/${name}/`,
    }),
  }),
})

export const { useGetPokemonPaginationQuery, useGetPokemonInfosQuery } = pokemonApiSlice