import { configureStore, createSlice } from "@reduxjs/toolkit";
const roomSlice = createSlice({
  name: "room",
  initialState:[{id:-1, roomname:"", infos:[]}],
  reducers: {
    setRoomInfos: (state, action) => {
      state.pop();
      state.push(action.payload);
    }
  }
})

const privateRoomSlice = createSlice({
  name: "privateRoom",
  initialState:[{id:-1, userId:-1, name:"", username:"", image:"", rank:""}],
  reducers: {
    setPrivateRoomInfos: (state, action) => {
      state.pop();
      state.push(action.payload);
    }
  }
})

const messagesSlice = createSlice({
  name: "messages",
  initialState:["toto"],
  reducers: {
    setMessagesList: (state, action) => {
      state.pop();
      state.push(action.payload);
    }
  }
})

const updateRoomsSlice = createSlice({
  name: "updateRooms",
  initialState:{action:false},
  reducers: {
    updateRooms: (state) => {
        return {
          ...state,
          action: !state.action
      }
    }
  }
})

const updateMessagesSlice = createSlice({
  name: "updateMessages",
  initialState:{action:false},
  reducers: {
    updateMessages: (state) => {
        return {
          ...state,
          action: !state.action
      }
    }
  }
})

const blockInfosSlice = createSlice({
  name: "blockInfos",
  initialState:[""],
  reducers: {
    setBlockInfos: (state, action) => {
        state.pop();
        state.push(action.payload);
    }
  }
})

const updateBlockInfosSlice = createSlice({
  name: "updateBlockInfos",
  initialState:{action:false},
  reducers: {
    updateBlockInfos: (state) => {
      return {
        ...state,
        action: !state.action
      }
    }
  }
})

export const { setRoomInfos } = roomSlice.actions;
export const { setPrivateRoomInfos } = privateRoomSlice.actions;
export const { setMessagesList } = messagesSlice.actions;
export const { updateRooms } = updateRoomsSlice.actions;
export const { updateMessages } = updateMessagesSlice.actions;
export const { setBlockInfos } = blockInfosSlice.actions;
export const { updateBlockInfos } = updateBlockInfosSlice.actions;

export const store = configureStore({
  reducer: {
    room:roomSlice.reducer,
    privateRoom:privateRoomSlice.reducer,
    messages:messagesSlice.reducer,
    updateRooms:updateRoomsSlice.reducer,
    updateMessages:updateMessagesSlice.reducer,
    blockInfos:blockInfosSlice.reducer,
    updateBlockInfos:updateBlockInfosSlice.reducer
  },
  
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

