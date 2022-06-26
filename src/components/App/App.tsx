import { useStore, component$, Host, useStyles$ } from '@builder.io/qwik';

import styles from './App.css?inline';

type Item = {
	id: string;
	isChecked: boolean;
	name: string;
};

export const data: Item[] = [
	{
		id: 'todo-001',
		isChecked: false,
		name: 'Apples',
	},
	{
		id: 'todo-002',
		isChecked: true,
		name: 'Bananies',
	},
	{
		id: 'todo-003',
		isChecked: false,
		name: 'Avocåëdos',
	},
];

export const App = component$(() => {
	useStyles$(styles);
	const state = useStore({ data: data, name: '' });

	return (
		<Host class="App">
			<h1>Hewwo</h1>
			<form
				onSubmit$={() => {
					state.data.push({
						id: 'todo-00' + (state.data.length + 1),
						name: state.name,
						isChecked: false,
					});

					state.name = '';
				}}
				preventdefault:submit
			>
				<label htmlFor="todo-name">Name</label>
				<input
					type="text"
					name="name"
					id="todo-name"
					onInput$={(evt) => {
						state.name = (evt.target as HTMLInputElement).value;
					}}
					value={state.name}
				/>
				<button type="submit">Submit</button>
			</form>
			<ul>
				{state.data.map((d) => (
					<li key={d.id}>
						<input
							type="checkbox"
							id={`checkbox-${d.id}`}
							checked={d.isChecked}
							onChange$={() => {
								const updatedItem = state.data.find(
									(el) => el.id === d.id
								) as Item;
								updatedItem.isChecked = !updatedItem.isChecked;
							}}
						/>
						<label htmlFor={`checkbox-${d.id}`}>{d.name}</label>
					</li>
				))}
			</ul>
		</Host>
	);
});
