import { configureStore } from '@reduxjs/toolkit';
import messagesReducer from './messagesSlice';
import loginReducer from './loginSlice';

export const store = configureStore({
	reducer: {
		messages: messagesReducer,
		login: loginReducer,
	},
});
