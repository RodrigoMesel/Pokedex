import React, { PropsWithChildren } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { setupStore } from '../redux/store'
import type { AppStore, RootState } from '../redux/store'
import { FluentProvider, ToastIntent, teamsLightTheme } from '@fluentui/react-components';
import { AppContext, AppContextProvider } from '../context/app-context'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: Partial<RootState>
    store?: AppStore
}

export function renderWithProvidersAndPersonalizedContext (
  ui: React.ReactElement,
    {
      preloadedState = {},
      store = setupStore(preloadedState),
      ...renderOptions
    }: ExtendedRenderOptions = {}
){
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>
              <FluentProvider theme={teamsLightTheme}>
                  {children}
              </FluentProvider>
            </Provider>
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

export function renderWithProviders(
    ui: React.ReactElement,
    {
      preloadedState = {},
      store = setupStore(preloadedState),
      ...renderOptions
    }: ExtendedRenderOptions = {}
  ) {
    function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
      return <Provider store={store}>
                <FluentProvider theme={teamsLightTheme}>
                  <AppContextProvider>
                    {children}
                  </AppContextProvider>
                </FluentProvider>
              </Provider>
    }
    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
  }