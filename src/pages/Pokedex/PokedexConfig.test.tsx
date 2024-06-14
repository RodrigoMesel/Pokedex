import { screen } from '@testing-library/react';
import {renderWithProviders} from '../../utils/test-utils';
import Pokedex from './Pokedex';
import userEvent from '@testing-library/user-event';
import {v4 as uuid} from 'uuid';

describe("PokedexConfig", () => {
  beforeEach(() => { 

    global.window.electronAPI = {
      setPokedex: jest.fn(),
      receiveInitialUser: jest.fn().mockImplementation((callback) => callback({name: 'Rodrigo Oliveira', id: "02f55375-b904-430e-a67e-23a69f755ddb"})),
      getUserPokedex: jest.fn().mockResolvedValue([]),
      tradePokemons: jest.fn()
    };

  });

  it('should show pokemons filtered by text', async () => {
      // ARRANGE
    renderWithProviders(<Pokedex />, {preloadedState: {
      pokedex: {
          captured: [
              {name: 'Fogareu', originalName: 'charizard', type: "fire", id: uuid()},
              {name: 'bulbasaur', originalName: 'bulbasaur', type: "grass", id: uuid()},
              {name: 'Tortuguita', originalName: 'squirtle', type: "water", id: uuid()},
              {name: 'squirtle', originalName: 'squirtle', type: 'water', id: uuid()},
              {name: 'Squirrel', originalName: 'gengar', type: 'ghost', id: uuid()}
          ]
      }
    }});

    const searchBox = screen.getByRole('searchbox');

    // ACT
    await userEvent.type(searchBox, 'squi');
    const pokemonCards = screen.getAllByRole('img');


    // ASSERT
    expect(pokemonCards).toHaveLength(3);
    expect(screen.getByText('Tortuguita')).toBeInTheDocument();
    expect(screen.getByText('Squirrel')).toBeInTheDocument();
    expect(screen.getByText('Squirtle')).toBeInTheDocument();
    expect(screen.queryByText('Fogareu')).not.toBeInTheDocument();
  })

  it('should show no pokemons whit those filters', async () => {
    // ARRANGE
    renderWithProviders(<Pokedex />, {preloadedState: {
        pokedex: {
            captured: [
                {name: 'Fogareu', originalName: 'charizard', type: "fire", id: uuid()},
                {name: 'bulbasaur', originalName: 'bulbasaur', type: "grass", id: uuid()},
                {name: 'Tortuguita', originalName: 'squirtle', type: "water", id: uuid()},
                {name: 'squirtle', originalName: 'squirtle', type: 'water', id: uuid()},
                {name: 'Squirrel', originalName: 'gengar', type: 'ghost', id: uuid()}
            ]
        }
    }});

    const searchBox = screen.getByRole('searchbox');

    // ACT
    await userEvent.type(searchBox, 'squiaeaewaew');

    // ASSERT
    expect(screen.getByText('No Pokémon found with those filters')).toBeInTheDocument();
  })

  it('should open pokedex options', async () => {
    // ARRANGE
    renderWithProviders(<Pokedex />, {preloadedState: {
        pokedex: {
            captured: [
                {name: 'Fogareu', originalName: 'charizard', type: "fire", id: uuid()},
                {name: 'bulbasaur', originalName: 'bulbasaur', type: "grass", id: uuid()},
                {name: 'Tortuguita', originalName: 'squirtle', type: "water", id: uuid()},
                {name: 'squirtle', originalName: 'squirtle', type: 'water', id: uuid()},
                {name: 'Squirrel', originalName: 'gengar', type: 'ghost', id: uuid()}
            ]
        }
    }});

    const pokedexOptions = screen.getByTestId('optionsMenu');

    // ACT
    await userEvent.click(pokedexOptions)

    // ASSERT
    expect(screen.getByText('Sort')).toBeInTheDocument()
    expect(screen.getByText('Filter')).toBeInTheDocument()

  })

  it('should filter by type', async () => {
    // ARRANGE
    renderWithProviders(<Pokedex />, {preloadedState: {
        pokedex: {
            captured: [
                {name: 'Fogareu', originalName: 'charizard', type: "fire", id: uuid()},
                {name: 'bulbasaur', originalName: 'bulbasaur', type: "grass", id: uuid()},
                {name: 'Tortuguita', originalName: 'squirtle', type: "water", id: uuid()},
                {name: 'squirtle', originalName: 'squirtle', type: 'water', id: uuid()},
                {name: 'Squirrel', originalName: 'gengar', type: 'ghost', id: uuid()}
            ]
        }
    }});

    const pokedexOptions = screen.getByTestId('optionsMenu');

    // ACT
    await userEvent.click(pokedexOptions);
    const filterOption = screen.getByText('Filter');
    await userEvent.click(filterOption);
    const dropdown = screen.getByRole('combobox');
    await userEvent.click(dropdown);
    const fireOption = screen.getByText('fire');
    await userEvent.click(fireOption);
    await userEvent.click(pokedexOptions);

    const pokemonCards = screen.getAllByRole('img');
    
    // ASSERT
    expect(pokemonCards).toHaveLength(1);
    expect(screen.getByText('Fogareu')).toBeInTheDocument();
    expect(screen.queryByText('Tortuguita')).not.toBeInTheDocument();
  }, 10000)

  it('should sort reverse by name', async () => {
    // ARRANGE
    renderWithProviders(<Pokedex />, {preloadedState: {
        pokedex: {
            captured: [
                {name: 'Fogareu', originalName: 'charizard', type: "fire", id: uuid()},
                {name: 'bulbasaur', originalName: 'bulbasaur', type: "grass", id: uuid()},
                {name: 'Tortuguita', originalName: 'squirtle', type: "water", id: uuid()},
                {name: 'squirtle', originalName: 'squirtle', type: 'water', id: uuid()},
                {name: 'Squirrel', originalName: 'gengar', type: 'ghost', id: uuid()}
            ]
        }
    }});

    const pokedexOptions = screen.getByTestId('optionsMenu');

    // ACT
    await userEvent.click(pokedexOptions);
    const sortOption = screen.getByText('Sort');
    await userEvent.click(sortOption);
    const reverseSortOption = screen.getByText('Z to A');
    await userEvent.click(reverseSortOption);
    await userEvent.click(pokedexOptions);

    const pokemonCards = screen.getAllByRole('heading');
    
    // ASSERT
    expect(pokemonCards).toHaveLength(6);
    expect(pokemonCards[1]).toHaveTextContent('Tortuguita');
    expect(pokemonCards[2]).toHaveTextContent('Squirtle');
    expect(pokemonCards[3]).toHaveTextContent('Squirrel');
    expect(pokemonCards[4]).toHaveTextContent('Fogareu');
    expect(pokemonCards[5]).toHaveTextContent('Bulbasaur');
  }, 10000)

  it('should sort by name', async () => {
    // ARRANGE
    renderWithProviders(<Pokedex />, {preloadedState: {
        pokedex: {
            captured: [
                {name: 'Fogareu', originalName: 'charizard', type: "fire", id: uuid()},
                {name: 'bulbasaur', originalName: 'bulbasaur', type: "grass", id: uuid()},
                {name: 'Tortuguita', originalName: 'squirtle', type: "water", id: uuid()},
                {name: 'squirtle', originalName: 'squirtle', type: 'water', id: uuid()},
                {name: 'Squirrel', originalName: 'gengar', type: 'ghost', id: uuid()}
            ]
        }
    }});

    const pokedexOptions = screen.getByTestId('optionsMenu');

    // ACT
    await userEvent.click(pokedexOptions);
    const sortOption = screen.getByText('Sort');
    await userEvent.click(sortOption);
    const reverseSortOption = screen.getByText('A to Z');
    await userEvent.click(reverseSortOption);
    await userEvent.click(pokedexOptions);

    const pokemonCards = screen.getAllByRole('heading');
    
    // ASSERT
    expect(pokemonCards).toHaveLength(6);
    expect(pokemonCards[1]).toHaveTextContent('Bulbasaur');
    expect(pokemonCards[2]).toHaveTextContent('Fogareu');
    expect(pokemonCards[3]).toHaveTextContent('Squirrel');
    expect(pokemonCards[4]).toHaveTextContent('Squirtle');
    expect(pokemonCards[5]).toHaveTextContent('Tortuguita');
  }, 10000)
})