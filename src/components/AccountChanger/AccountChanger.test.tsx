import App from '../../pages/App';
import {renderWithProviders} from '../../utils/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; 
import AccountChanger from './AccountChanger';



describe("AccountChanger", () => {

    beforeEach(() => {
        global.window.electronAPI = {
            setPokedex: jest.fn(),
            receiveInitialUser: jest.fn().mockImplementation((callback) => callback('Rodrigo Oliveira')),
            getUserPokedex: jest.fn().mockResolvedValue([])
          };
    })

  it('should render loggedUser icon', () => {
    // ARRANGE
    renderWithProviders(<AccountChanger/>, {
        preloadedState: {
            user: {
                loggedUser: {name: "Rodrigo Oliveira"},
                users: [
                    {name: "Rodrigo Oliveira"},
                    {name: "Alison Nicolau"},
                    {name: "Giovani Faria"}
                ]
            }
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
                loggedUser: {name: "Rodrigo Oliveira"},
                users: [
                    {name: "Rodrigo Oliveira"},
                    {name: "Alison Nicolau"},
                    {name: "Giovani Faria"}
                ]
            }
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
                loggedUser: {name: "Rodrigo Oliveira"},
                users: [
                    {name: "Rodrigo Oliveira"},
                    {name: "Alison Nicolau"},
                    {name: "Giovani Faria"}
                ]
            }
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




