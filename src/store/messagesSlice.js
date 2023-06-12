import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const sendMessage = createAsyncThunk(
	'messages/sendMessage',
	async ({ chatId, textMessage }, { getState, dispatch }) => {
		const { idInstance, apiToken } = getState().login;

		try {
			const response = await fetch(
				`https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiToken}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						chatId,
						message: textMessage,
					}),
				}
			);
			const data = await response.json();

			dispatch(
				addMessage({
					chatId,
					textMessage,
					idMessage: data.idMessage,
					isOwn: true,
				})
			);

			return data;
		} catch (error) {
			throw new Error(error);
		}
	}
);

export const getMessage = createAsyncThunk(
	'messages/getMessage',
	async ({}, { getState, dispatch }) => {
		const { idInstance, apiToken } = getState().login;

		try {
			const response = await fetch(
				`https://api.green-api.com/waInstance${idInstance}/receiveNotification/${apiToken}`
			);
			const data = await response.json();

			if (data.body.typeWebhook === 'incomingMessageReceived') {
				dispatch(
					addMessage({
						chatId: data.body.senderData.chatId,
						textMessage:
							data.body.messageData.textMessageData.textMessage,
						idMessage: data.body.idMessage,
						isOwn: false,
					})
				);
			}
			console.log(1);

			await fetch(
				`https://api.green-api.com/waInstance${idInstance}/deleteNotification/${apiToken}/${data.receiptId}`,
				{ method: 'DELETE' }
			);
			console.log(2);

			return data;
		} catch (error) {
			throw new Error(error);
		}
	}
);

const initialState = {
	chats: {},
	loading: false,
	error: null,
};

const messagesSlice = createSlice({
	name: 'messages',
	initialState: initialState,
	reducers: {
		addContact: (state, action) => {
			if (state.chats[action.payload] === undefined) {
				state.chats[action.payload] = [];
			}
		},
		addMessage: (state, action) => {
			const payload = action.payload;
			const chatId = state.chats[payload.chatId];

			if (chatId !== undefined) {
				chatId.push({
					id: payload.idMessage,
					text: payload.textMessage,
					isOwn: payload.isOwn,
				});
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(sendMessage.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(sendMessage.fulfilled, (state) => {
				state.loading = false;
				state.error = null;
			})
			.addCase(sendMessage.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(getMessage.pending, () => {})
			.addCase(getMessage.fulfilled, () => {})
			.addCase(getMessage.rejected, () => {});
	},
});

export const { addContact, addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
