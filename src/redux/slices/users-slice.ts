import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type user = {
    name: string,
    id: string
}

interface UserState {
    users: user[],
    loggedUser: user
}

const initialState: UserState = {
    users: [
        {name: "Rodrigo Oliveira", id: "02f55375-b904-430e-a67e-23a69f755ddb"},
        {name: "Alison Nicolau", id: "7ca8cc5c-55c9-4535-b191-43a9234d0656"},
        {name: "Giovani Faria", id: "db1bfa04-7371-40f9-bd52-34e1e374f658"}
    ],
    loggedUser: {
        name: "",
        id: ""
    }
}

export const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        changeLoggedUser: (state, action: PayloadAction<user>) => {
            state.loggedUser = action.payload
        },
    }
})

export const {changeLoggedUser} = UserSlice.actions;
export default UserSlice.reducer;
