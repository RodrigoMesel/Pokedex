import { screen, waitFor } from '@testing-library/react';
import App from '../../pages/App';
import {renderWithProviders} from '../../utils/test-utils';
import userEvent from '@testing-library/user-event';

global.window.electronAPI = {
  setPokedex: jest.fn(),
  receiveInitialUser: jest.fn().mockImplementation((callback) => callback({name: 'Rodrigo Oliveira', id: "02f55375-b904-430e-a67e-23a69f755ddb"})),
  getUserPokedex: jest.fn().mockResolvedValue([]),
  tradePokemons: jest.fn()
};


test('should have 2 menu items: "Pokemons" and "Pokedex"', () => {
  // ARRANGE
  renderWithProviders(<App />);
  const pokemonOption = screen.getAllByText(/Pokémons/i);
  const pokedexOption = screen.getAllByText(/Pokédex/i);

  // ACT

  // ASSERT
  expect(pokemonOption[0]).toBeInTheDocument();
  expect(pokedexOption[0]).toBeInTheDocument();
});

test('should start with "Pokemons" item selected', () => {
    // ARRANGE
    renderWithProviders(<App />);

    const pokemonOption = screen.getByRole('tab', { name: 'Pokémons' });
    const pokedexOption = screen.getByRole('tab', { name: 'Pokédex' });

    // ACT
  
    // ASSERT
    expect(pokemonOption).toHaveAttribute('aria-selected', "true");
    expect(pokedexOption).toHaveAttribute('aria-selected', "false");
  });


test('should change "Pokedex" to selected when clicked', async () => {
    // ARRANGE
    renderWithProviders(<App />);
    const user = userEvent.setup();
    const pokemonOption = screen.getByRole('tab', { name: 'Pokémons' });
    const pokedexOption = screen.getByRole('tab', { name: 'Pokédex' });

    // ACT
    await user.click(pokedexOption);

    // ASSERT
    expect(pokemonOption).toHaveAttribute('aria-selected', "false");
    expect(pokedexOption).toHaveAttribute('aria-selected', "true");
    await waitFor(() => {
      expect(screen.getByText(/Total captured:/i)).toBeInTheDocument();
    });

});