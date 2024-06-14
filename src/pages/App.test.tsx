import { screen } from '@testing-library/react';
import {renderWithProviders} from '../utils/test-utils';
import App from './App';
import { useGetPokemonInfosQuery, useGetPokemonPaginationQuery } from '../redux/slices/pokemon-api-slice';
import userEvent from '@testing-library/user-event';

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

jest.mock('../redux/slices/pokemon-api-slice', () => ({
  pokemonApiSlice: jest.fn(),
  useGetPokemonPaginationQuery: jest.fn(),
  useGetPokemonInfosQuery: jest.fn(),
}));

describe("App", () => {
  beforeEach(() => { 

    global.window.electronAPI = {
      setPokedex: jest.fn(),
      receiveInitialUser: jest.fn().mockImplementation((callback) => callback({name: 'Rodrigo Oliveira', id: "02f55375-b904-430e-a67e-23a69f755ddb"})),
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

    (useGetPokemonInfosQuery as jest.Mock).mockReturnValue({
      data: bulbasaurMockedData,
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    })
  });

  it('should change pokedex when account is changed', async () => {
    // ARRANGE
    renderWithProviders(<App/>, {
      preloadedState: {
        user: {
          loggedUser: {name: "Rodrigo Oliveira", id: "02f55375-b904-430e-a67e-23a69f755ddb"},
          users: [
            {name: "Rodrigo Oliveira", id: "02f55375-b904-430e-a67e-23a69f755ddb"},
            {name: "Alison Nicolau", id: "7ca8cc5c-55c9-4535-b191-43a9234d0656"},
            {name: "Giovani Faria", id: "db1bfa04-7371-40f9-bd52-34e1e374f658"}
          ],
        },
        pokedex: {
          captured: []
        }
      }
    })
    const pokedexOption = screen.getByRole('tab', { name: 'Pokédex' });

    // ACT
    await userEvent.click(pokedexOption);
    await userEvent.click(screen.getByRole('img'));
    await userEvent.click(screen.getByRole('menuitem', {name: "Rodrigo Oliveira"}));

    expect(screen.getByText("Rodrigo Oliveira's Pokédex")).toBeInTheDocument();

    // ASSERT
    await userEvent.click(screen.getByRole('img', {name: "Rodrigo Oliveira"}));
    await userEvent.click(screen.getByRole('menuitem', {name: "Alison Nicolau"}));

    expect(screen.getByText("Alison Nicolau's Pokédex")).toBeInTheDocument();
  })


  it('should throw error when initial user is not valid', async () => {
    // ARRANGE

    global.window.electronAPI.receiveInitialUser = jest.fn().mockImplementationOnce((callback) => callback([]))

    expect(() => renderWithProviders(<App/>, {
        preloadedState: {
          user: {
            loggedUser: {name: "Rodrigo Oliveira", id: "02f55375-b904-430e-a67e-23a69f755ddb"},
            users: [
              {name: "Rodrigo Oliveira", id: "02f55375-b904-430e-a67e-23a69f755ddb"},
              {name: "Alison Nicolau", id: "7ca8cc5c-55c9-4535-b191-43a9234d0656"},
              {name: "Giovani Faria", id: "db1bfa04-7371-40f9-bd52-34e1e374f658"}
            ],
          },
          pokedex: {
            captured: []
          }
        }
      })).toThrow("Invalid initial user format")
  })
})