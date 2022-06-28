import { configureStore, createSlice } from "@reduxjs/toolkit";

const pongSlice = createSlice({
	name: "pong",
	initialState:{	gameState: null,
					room: null},
	reducers: {
	  setPongInfos: (state, action) => {
		state.gameState = action.payload.gameState;
	  },
	  setRoom: (state, action) => {
		state.room = action.payload.room;
	  }
	}
})

export const { setPongInfos, setRoom } = pongSlice.actions;

export const store = configureStore({
  reducer: {
    pong: pongSlice.reducer,
  },
  
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
