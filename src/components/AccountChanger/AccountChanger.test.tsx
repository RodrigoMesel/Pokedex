import App from '../../pages/App';
import {renderWithProviders} from '../../utils/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; 
import AccountChanger from './AccountChanger';



describe("AccountChanger", () => {

    beforeEach(() => {
        global.window.electronAPI = {
            setPokedex: jest.fn(),
            receiveInitialUser: jest.fn().mockImplementation((callback) => callback({name: 'Rodrigo Oliveira', id: "02f55375-b904-430e-a67e-23a69f755ddb"})),
            getUserPokedex: jest.fn().mockResolvedValue([]),
            tradePokemons: jest.fn()
          };
    })

  it('should render loggedUser icon', () => {
    // ARRANGE
    renderWithProviders(<AccountChanger/>, {
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
    });
    const accountButton = screen.getByRole('img', {name: "Rodrigo Oliveira"});

    // ACT

    // ASSERT
    expect(accountButton).toBeInTheDocument();

  })

  it('should open user options when button clicked', async () => {
    // ARRANGE
    renderWithProviders(<AccountChanger/>, {
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
    });
    const accountButton = screen.getByRole('img', {name: "Rodrigo Oliveira"});

    // ACT
    await userEvent.click(accountButton);
    const user1Button = screen.getByRole('menuitem', {name: "Rodrigo Oliveira"})
    const user2Button = screen.getByRole('menuitem', {name: "Alison Nicolau"})
    const user3Button = screen.getByRole('menuitem', {name: "Giovani Faria"})

    // ASSERT
    expect(user1Button).toBeInTheDocument();
    expect(user2Button).toBeInTheDocument();
    expect(user3Button).toBeInTheDocument();

  })

  it('should change logged user when option clicked', async () => {
    // ARRANGE
    let {store} = renderWithProviders(<AccountChanger/>, {
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
    });
    const accountButton = screen.getByRole('img', {name: "Rodrigo Oliveira"});

    // ACT
    await userEvent.click(accountButton);
    const userButton = screen.getByRole('menuitem', {name: "Alison Nicolau"})
    await userEvent.click(userButton);

    // ASSERT
    expect(store.getState().user.loggedUser.name).toBe("Alison Nicolau");
    expect(screen.getByRole('img', {name: "Alison Nicolau"})).toBeInTheDocument();

  })
  
})




