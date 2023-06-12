import { useState } from 'react';
import { sendMessage } from '../../store/messagesSlice';
import './Messages.scss';
import { useDispatch } from 'react-redux';

const DialogForm = ({ chatId }) => {
	const dispatch = useDispatch();
	const [textMessage, setTextMessage] = useState('');

	const formSubmit = (e) => {
		e.preventDefault();

		dispatch(sendMessage({ chatId, textMessage }));
		setTextMessage('');
	};

	return (
		<form className="messages__chat__form" onSubmit={formSubmit}>
			<textarea
				placeholder="Введите сообщение"
				onChange={(e) => {
					setTextMessage(e.target.value);
				}}
				value={textMessage}
				type="text"
			/>
			{chatId ? (
				<button>Отправить</button>
			) : (
				<button disabled>Отправить</button>
			)}
		</form>
	);
};

export default DialogForm;
