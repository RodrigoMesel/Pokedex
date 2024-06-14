import App from '../../pages/App';
import {renderWithProviders} from '../../utils/test-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; 
import { useGetPokemonInfosQuery, useGetPokemonPaginationQuery } from '../../redux/slices/pokemon-api-slice';
import CaptureDialog from './CaptureDialog2';
import Pokemons from '../../pages/Pokemons/Pokemons';


global.window.electronAPI = {
  setPokedex: jest.fn(),
  receiveInitialUser: jest.fn().mockImplementation((callback) => callback('Rodrigo Oliveira')),
  getUserPokedex: jest.fn().mockImplementation(() => Promise.resolve([])),
  tradePokemons: jest.fn()

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

const mockedOnSubmit = jest.fn();

jest.mock('../../redux/slices/pokemon-api-slice', () => ({
  pokemonApiSlice: jest.fn(),
  useGetPokemonPaginationQuery: jest.fn(),
  useGetPokemonInfosQuery: jest.fn(),
}));

describe("CaptureDialog", () => {
  beforeEach(() => {

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

  it('should open dialog when button clicked', async () => {
    // ARRANGE
    renderWithProviders(<Pokemons/>);
    const openDialogButton = screen.getAllByAltText('pokeball');

    // ACT
    await userEvent.click(openDialogButton[0]);

    // ASSERT
    expect(openDialogButton).toHaveLength(8);
    expect(screen.getByText('Wanna rename?')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Capture'})).toBeInTheDocument();
  })

  it('should not submit if form is invalid', async () => {
    // ARRANGE
    renderWithProviders(<CaptureDialog pokemonName='bulbasaur' pokemonSprite='aa.png' pokemonType='grass'/>)
    
    // ACT
    const pokeballButton = screen.getByRole('img', {name: 'pokeball'});
    await userEvent.click(pokeballButton);

    const inputArea = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button', {name: 'Capture'});
    await userEvent.type(inputArea, 'Ab');
    await userEvent.click(submitButton);

    // ASSERT
    expect(mockedOnSubmit).toHaveBeenCalledWith('Ab', false);
  })

  it('should submit if form is valid', async () => {
    // ARRANGE
    renderWithProviders(<CaptureDialog pokemonName='bulbasaur' pokemonSprite='aa.png' pokemonType='grass'/>)
    
    // ACT
    const pokeballButton = screen.getByRole('img', {name: 'pokeball'});
    await userEvent.click(pokeballButton);

    const inputArea = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button', {name: 'Capture'});
    await userEvent.type(inputArea, 'PlantaAmbulanteCarnivora');
    await userEvent.click(submitButton);

    // ASSERT
    expect(mockedOnSubmit).toHaveBeenCalledWith('PlantaAmbulanteCarnivora', true);

  })

  it('should update Pokemon list when form submitted', async() => {
    // ARRANGE
    const {store} = renderWithProviders(<App/>);

    const openDialogButton = screen.getAllByAltText('pokeball');
    const pokedexOption = screen.getByRole('tab', { name: 'Pokédex' });

    // ACT
    expect(store.getState().pokedex.captured).toHaveLength(0);

    await userEvent.click(openDialogButton[0]);

    const inputArea = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button', {name: 'Capture'});
    fireEvent.change(inputArea, {target: {value: 'PlantaAmbulanteCarnivora'}});
    await userEvent.click(submitButton);

    await userEvent.click(pokedexOption);
    
    // ASSERT
    expect(store.getState().pokedex.captured).toHaveLength(1);
    expect(screen.getByText("PlantaAmbulanteCarnivora")).toBeInTheDocument();
  })

  it('should appear error message after 2 seconds', async() => {
    // ARRANGE
    renderWithProviders(<CaptureDialog pokemonName='bulbasaur' pokemonSprite='aa.png' pokemonType='grass'/>)
    
    // ACT
    const inputArea = screen.getByRole('textbox');
    await userEvent.type(inputArea, 'Aa');


    // ASSERT
    await waitFor(() => {
      expect(screen.getByText("*The length of the renamed name must be between 3 and 50")).toBeInTheDocument();
    })

  })

})




