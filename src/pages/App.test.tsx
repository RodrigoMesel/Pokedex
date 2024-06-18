import { screen, waitFor } from '@testing-library/react';
import {renderWithProviders, renderWithProvidersAndPersonalizedContext} from '../utils/test-utils';
import App from './App';
import { useGetPokemonInfosQuery, useGetPokemonPaginationQuery } from '../redux/slices/pokemon-api-slice';
import userEvent from '@testing-library/user-event';
import { AppContext } from '../context/app-context';
import {v4 as uuid} from 'uuid';
import { PokemonType } from '../redux/slices/pokedex-slice';
import { user } from '../redux/slices/users-slice';

type Pokedex = {
  [key: string]: {
    captured: PokemonType[];
  };
};

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

const mockedNotify = jest.fn()

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

  it('should do a complete trade', async () => {
    // ARRANGE

    const mockedUsersPokedex: Pokedex = {
      "Rodrigo Oliveira": {
        captured: [{name: "bulbasaur", originalName: "bulbasaur", id: "5d9c9dec-d123-48f8-9c53-4d694413c471", type: "grass"}]
      },
      "Alison Nicolau": {
        captured: []
      }
    }

    global.window.electronAPI = {
      setPokedex: jest.fn(),
      receiveInitialUser: jest.fn().mockImplementation((callback) => callback({name: 'Rodrigo Oliveira', id: "02f55375-b904-430e-a67e-23a69f755ddb"})),
      getUserPokedex: jest.fn().mockImplementation((user: user) => {
        const userPokedex = mockedUsersPokedex[user.name].captured;
        return Promise.resolve(userPokedex)
      }),
      tradePokemons: jest.fn().mockImplementation((pokemon: PokemonType, userOwner: user, userDestiny: user) => {

        let ownerPokedex = mockedUsersPokedex[userOwner.name].captured;
        let destinyPokedex = mockedUsersPokedex[userDestiny.name].captured;
  
        ownerPokedex = ownerPokedex.filter(c => c.id !== pokemon.id);
        destinyPokedex = [...destinyPokedex, pokemon];
  
        mockedUsersPokedex[userOwner.name].captured = ownerPokedex;
        mockedUsersPokedex[userDestiny.name].captured = destinyPokedex;
  
        return Promise.resolve(ownerPokedex);
      })
    };

    renderWithProvidersAndPersonalizedContext(
      <AppContext.Provider value={{ascendingOrder: true, filterName: "", filterTypes: [], isOptionsOpen: false, notify: mockedNotify, setAscendingOrder: jest.fn(), setFilterName: jest.fn(), setFilterTypes: jest.fn(), setIsOptionsOpen: jest.fn()}}>
        <App/>
      </AppContext.Provider>, {
        preloadedState: {
          user: {
            loggedUser: {name: "Rodrigo Oliveira", id: "02f55375-b904-430e-a67e-23a69f755ddb"},
            users: [
              {name: "Rodrigo Oliveira", id: "02f55375-b904-430e-a67e-23a69f755ddb"},
              {name: "Alison Nicolau", id: "7ca8cc5c-55c9-4535-b191-43a9234d0656"},
              {name: "Giovani Faria", id: "db1bfa04-7371-40f9-bd52-34e1e374f658"}
            ],
          }
        },
      })

    // ACT
    const pokedexOption = screen.getByRole('tab', { name: 'Pokédex' });
    await userEvent.click(pokedexOption);
    const iconButton = screen.getAllByTestId('tradeDialog');
    await userEvent.click(iconButton[0]);
    const dropdown = screen.getByRole('combobox');
    await userEvent.click(dropdown);
    const userOption = screen.getByRole('option', {name: "Alison Nicolau"});
    await userEvent.click(userOption);
    const tradeSubmitButton = screen.getByRole('button', {name: 'Trade'});
    await userEvent.click(tradeSubmitButton);

    // ASSERT
    await waitFor(() =>{
      expect(screen.getByText("No Pokémon found with those filters")).toBeInTheDocument();
    })
    /*
    const userButton = screen.getByText("RO");
    await userEvent.click(userButton);
    const alisonButton = screen.getByRole('menuitem', {name: "Rodrigo Oliveira"});
    await userEvent.click(alisonButton);*/

  }, 10000)
})