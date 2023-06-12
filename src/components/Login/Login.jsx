import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Login.scss';
import { checkCredentials } from '../../store/loginSlice';
import { Navigate } from 'react-router-dom';

function Login() {
	const isAuthorized = useSelector((state) => state.login.isAuthorized);

	const dispatch = useDispatch();
	const [idInstance, setIdInstance] = useState('');
	const [apiToken, setApiToken] = useState('');
	const isLoading = useSelector((state) => state.login.isLoading);
	const error = useSelector((state) => state.login.error);

	if (isAuthorized) return <Navigate to="/dialog"></Navigate>;

	const formSubmit = (e) => {
		e.preventDefault();

		dispatch(checkCredentials({ idInstance, apiToken }));
	};

	return (
		<div className="login">
			<form className="login__form" onSubmit={formSubmit}>
				<input
					className="login__input"
					placeholder="Введите idInstance"
					value={idInstance}
					onChange={(e) => setIdInstance(e.target.value)}
				/>
				<input
					className="login__input"
					placeholder="Введите apiTokenInstance"
					value={apiToken}
					onChange={(e) => setApiToken(e.target.value)}
				/>
				<button className="login__button">Подтвердить</button>
				{isLoading && <div>Loading...</div>}
				{error && <div>Error: {error}</div>}
			</form>
		</div>
	);
}

export default Login;
