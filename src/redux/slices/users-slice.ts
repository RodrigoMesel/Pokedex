import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type user = {
    name: string
}

interface UserState {
    users: user[],
    loggedUser: user
}

const initialState: UserState = {
    users: [
        {name: "Rodrigo Oliveira"},
        {name: "Alison Nicolau"},
        {name: "Giovani Faria"}
    ],
    loggedUser: {
        name: ""
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
