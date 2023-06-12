import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
	idInstance: '',
	apiToken: '',
	isLoading: false,
	error: null,
	isAuthorized: false,
};

export const checkCredentials = createAsyncThunk(
	'login/checkCredentials',
	async ({ idInstance, apiToken }, { rejectWithValue, dispatch }) => {
		try {
			const response = await fetch(
				`https://api.green-api.com/waInstance${idInstance}/getStateInstance/${apiToken}`
			);

			const data = await response.json();

			if (data.stateInstance === 'authorized') {
				dispatch(setIdInstance(idInstance));
				dispatch(setApiToken(apiToken));
				return data;
			}

			throw new Error();
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

const loginSlice = createSlice({
	name: 'login',
	initialState,
	reducers: {
		setIdInstance: (state, action) => {
			state.idInstance = action.payload;
		},
		setApiToken: (state, action) => {
			state.apiToken = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(checkCredentials.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(checkCredentials.fulfilled, (state) => {
				state.isLoading = false;
				state.isAuthorized = true;
			})
			.addCase(checkCredentials.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			});
	},
});

const { setIdInstance, setApiToken } = loginSlice.actions;

export default loginSlice.reducer;
