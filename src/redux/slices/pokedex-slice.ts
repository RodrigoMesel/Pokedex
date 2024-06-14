import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface PokemonType{
    id: string,
    originalName: string,
    name: string, 
    type: string
}

interface PokedexState {
    captured: PokemonType[]
}

const initialState: PokedexState = {
    captured: []
}

export const PokedexSlice = createSlice({
    name: 'pokedex',
    initialState,
    reducers: {
        capturePokemon: (state, action: PayloadAction<PokemonType>) => {
            state.captured = [...state.captured, action.payload]
        },
        upadtePokedex: (state, action: PayloadAction<PokemonType[]>) => {
            state.captured = action.payload
        },
        resetPokedex: (state) => {
            state.captured = [];
        }
    }
})

export const {capturePokemon, upadtePokedex, resetPokedex} = PokedexSlice.actions;
export default PokedexSlice.reducer;
