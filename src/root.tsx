import { App } from './components/App';

import './global.css';

export const Root = () => {
	return (
		<html>
			<head>
				<meta charSet="utf-8" />
				<title>My todo list</title>
			</head>
			<body>
				<App />
			</body>
		</html>
	);
};
