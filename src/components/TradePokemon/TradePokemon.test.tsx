import {renderWithProviders,} from '../../utils/test-utils';
import TradePokemon from './TradePokemon';
import {v4 as uuid} from 'uuid';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';


global.window.electronAPI = {
  setPokedex: jest.fn(),
  receiveInitialUser: jest.fn().mockImplementation((callback) => callback('Rodrigo Oliveira')),
  getUserPokedex: jest.fn().mockImplementation(() => Promise.resolve([])),
  tradePokemons: jest.fn()
};

describe("TradePokemon", () => {

  it('should open dialog when button clicked', async () => {
    // ARRANGE
    renderWithProviders(<TradePokemon pokemon={{
        id: uuid(),
        name: 'bulbasaur',
        originalName: 'bulbasaur',
        type: 'grass'
    }}/>)

    // ACT
    const iconButton = screen.getByTestId('tradeDialog');
    await userEvent.click(iconButton);

    // ASSERT
    expect(screen.getByText("Do you want to transfer Bulbasaur to who?")).toBeInTheDocument();
  })

  it('should show other users as option to trade', async () => {
    // ARRANGE
    renderWithProviders(<TradePokemon pokemon={{
        id: uuid(),
        name: 'bulbasaur',
        originalName: 'bulbasaur',
        type: 'grass'
    }}/>, {
        preloadedState: {
            user: {
                loggedUser: {name: "Rodrigo Oliveira", id: "02f55375-b904-430e-a67e-23a69f755ddb"},
                users: [
                  {name: "Rodrigo Oliveira", id: "02f55375-b904-430e-a67e-23a69f755ddb"},
                  {name: "Alison Nicolau", id: "7ca8cc5c-55c9-4535-b191-43a9234d0656"},
                  {name: "Giovani Faria", id: "db1bfa04-7371-40f9-bd52-34e1e374f658"}
                ],
              },
        }
    })

    // ACT
    const iconButton = screen.getByTestId('tradeDialog');
    await userEvent.click(iconButton);
    const dropdown = screen.getByRole('combobox');
    await userEvent.click(dropdown);
    const userOption = screen.getByRole('option', {name: "Alison Nicolau"});
    const user2Option = screen.getByRole('option', {name: "Giovani Faria"});

    // ASSERT
    expect(userOption).toBeInTheDocument();
    expect(user2Option).toBeInTheDocument();
  })
})




