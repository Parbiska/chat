import './App.scss';
import Messages from './components/Messages/Messages';
import { Routes, Route, HashRouter, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import { Provider } from 'react-redux';
import { store } from './store/store';

function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Navigate to="/login" />} />
				<Route path="/login" element={<Login />} />
				<Route path="/dialog" element={<Messages />} />
				<Route
					path="*"
					element={<div>Error 404: Page not found</div>}
				></Route>
			</Routes>
		</div>
	);
}

const MainApp = () => {
	return (
		<HashRouter>
			<Provider store={store}>
				<App />
			</Provider>
		</HashRouter>
	);
};

export default MainApp;
