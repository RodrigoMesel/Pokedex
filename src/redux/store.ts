import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { pokemonApiSlice } from './slices/pokemon-api-slice';
import pokedexReducer from './slices/pokedex-slice'
import userReducer from './slices/users-slice'


const rootReducer = combineReducers({
  [pokemonApiSlice.reducerPath]: pokemonApiSlice.reducer,
  pokedex: pokedexReducer,
  user: userReducer
})

export const setupStore = (preloadedState?: Partial<RootState>) => {

  if(pokemonApiSlice.middleware !== undefined) {
    return configureStore({
      reducer: rootReducer,
      preloadedState,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(pokemonApiSlice.middleware)
  })
  }

  return configureStore({
      reducer: rootReducer,
      preloadedState,
  })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']