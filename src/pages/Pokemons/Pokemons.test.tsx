import {renderWithProviders} from '../../utils/test-utils';
import { screen } from '@testing-library/react';
import { useGetPokemonInfosQuery, useGetPokemonPaginationQuery } from '../../redux/slices/pokemon-api-slice';
import Pokemons from './Pokemons';


const mockedData = [
  {name: 'bulbasaur', originalName: 'bulbasaur'},
  {name: 'bulbasaur', originalName: 'bulbasaur'},
  {name: 'bulbasaur', originalName: 'bulbasaur'},
  {name: 'bulbasaur', originalName: 'bulbasaur'},
  {name: 'bulbasaur', originalName: 'bulbasaur'},
  {name: 'bulbasaur', originalName: 'bulbasaur'},
  {name: 'bulbasaur', originalName: 'bulbasaur'},
  {name: 'PlantaAmbulante', originalName: 'bulbasaur'},
]

const mockedDataNextPage = [
  {name: 'charmander', originalName: 'charmander'},
  {name: 'charmander', originalName: 'charmander'},
  {name: 'charmander', originalName: 'charmander'},
  {name: 'charmander', originalName: 'charmander'},
  {name: 'charmander', originalName: 'charmander'},
  {name: 'charmander', originalName: 'charmander'},
  {name: 'charmander', originalName: 'charmander'},
  {name: 'Fogareu', originalName: 'charmander'},
]

const bulbasaurMockedData = {
  sprites: {
    front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
  },
  weight: 65,
  height: 120,
  types: [{
    slot: 1,
    type: {
      name: "grass"
    }
  }]
}

const charmanderMockedData = {
  sprites: {
    front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png"
  },
  weight: 80,
  height: 150,
  types: [{
    slot: 1,
    type: {
      name: "fire"
    }
  }]
}

jest.mock('../../redux/slices/pokemon-api-slice', () => ({
  pokemonApiSlice: jest.fn(),
  useGetPokemonPaginationQuery: jest.fn(),
  useGetPokemonInfosQuery: jest.fn(),
}));

describe("Pokemons", () => {
  beforeEach(() => {

    global.window.electronAPI = {
      setPokedex: jest.fn(),
      receiveInitialUser: jest.fn().mockImplementation((callback) => callback('Rodrigo Oliveira')),
      getUserPokedex: jest.fn().mockResolvedValue([]),
      tradePokemons: jest.fn()
    };

    (useGetPokemonPaginationQuery as jest.Mock).mockClear();
    (useGetPokemonInfosQuery as jest.Mock).mockClear();

    (useGetPokemonPaginationQuery as jest.Mock).mockReturnValue({
      data: {
        results: mockedData,
        counter: 8,
        next: null,
        previous: null
      },
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    });

    (useGetPokemonInfosQuery as jest.Mock).mockReturnValue({ // Mock implementation
      data: bulbasaurMockedData,
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    })
  });

  it('should display 8 cards and its content', () => {
    // ARRANGE
    renderWithProviders(<Pokemons/>);

    // ACT

    // ASSERT
    expect(screen.getAllByAltText('bulbasaur')).toHaveLength(7);
    expect(screen.getByText('PlantaAmbulante')).toBeInTheDocument();
  })
/*
  it('should call api and load 8 more cards when clicked next mockar a chamada para a API', async () => {
    // ARRANGE
    renderWithProviders(<Pokemons/>);
    const nextButton = screen.getByRole('button', {name: '>'});

    
    (useGetPokemonPaginationQuery as jest.Mock).mockReturnValue({
      data: {
        results: mockedDataNextPage,
        counter: 8,
        next: null,
        previous: null
      },
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    });

    (useGetPokemonInfosQuery as jest.Mock).mockReturnValue({
      data: charmanderMockedData,
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    })
    
    // ACT
    await userEvent.click(nextButton)

    // ASSERT
    await waitFor(() => {

      expect(useGetPokemonPaginationQuery).toHaveBeenCalledTimes(2);
    })
    
    await waitFor(() => {
      expect(screen.getAllByRole('img', { name: 'charmander' })).toHaveLength(7);
    });
    expect(screen.getByText('Fogareu')).toBeInTheDocument();

  })*/
})


