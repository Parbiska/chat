import './Messages.scss';
import DialogForm from './DialogForm';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { addContact, getMessage } from '../../store/messagesSlice';

function Messages() {
	const dispatch = useDispatch();
	const isAuthorized = useSelector((state) => state.login.isAuthorized);
	const chats = useSelector((state) => state.messages.chats);

	const [number, setNumber] = useState('');
	const [selectContact, setSelectContact] = useState('');
	useEffect(() => {
		const interval = setInterval(() => {
			dispatch(getMessage(''));
		}, 5000);

		return () => {
			clearInterval(interval);
		};
	});

	const addContactForm = (e) => {
		e.preventDefault();

		if (number && !isNaN(+number)) {
			dispatch(addContact(number + '@c.us'));
			setNumber('');
		}
	};

	if (!isAuthorized) return <Navigate to="/login"></Navigate>;

	const contacts = [];
	const messages = [];

	for (const key in chats) {
		contacts.unshift(
			<div
				onClick={(e) => setSelectContact(key)}
				className={
					'messages__contacts__el' +
					(key === selectContact
						? ' messages__contacts__el_select'
						: '')
				}
				key={key}
			>
				+{key.split('@')[0]}
			</div>
		);
	}

	if (chats[selectContact] && chats[selectContact].length) {
		chats[selectContact].forEach((message) => {
			messages.push(
				<div
					className={
						'messages__dialog__el' +
						(message.isOwn ? ' messages__dialog__el_own' : '')
					}
					key={message.id}
				>
					<p>{message.text}</p>
				</div>
			);
		});
	}

	return (
		<div className="messages">
			<div className="messages__container">
				<div className="messages__contacts">
					<form
						className="messages__contacts__form messages__contacts__el"
						onSubmit={addContactForm}
					>
						<input
							placeholder="Введите номер телефона"
							value={`+${number}`}
							maxLength={16}
							onChange={(e) =>
								setNumber(e.target.value.substring(1))
							}
						/>
						<button>Добавить контакт</button>
					</form>
					{contacts}
				</div>
				<div className="messages__chat">
					<div className="messages__dialog">{messages}</div>
					<DialogForm chatId={selectContact} />
				</div>
			</div>
		</div>
	);
}

export default Messages;
