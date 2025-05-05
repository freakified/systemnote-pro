import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import {
	IonApp,
	IonRouterOutlet,
	setupIonicReact,
	// isPlatform,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Storage } from '@ionic/storage';

import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

// import '@ionic/react/css/palettes/dark.always.css';
// import '@ionic/react/css/palettes/dark.class.css';
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import { SettingsProvider } from './components/SettingsProvider/SettingsProvider';
import { SettingsPage } from './components/SettingsPage';
import ChangeLog from './components/SettingsPage/Changelog';
import InstallationDirections from './components/SettingsPage/InstallationDirections';
import { BASE_URL } from './utils/constants';

setupIonicReact({
	mode: 'ios',
	// mode: isPlatform('android') ? 'md' : 'ios',
});

const App: React.FC = () => {
	const [storage, setStorage] = useState<Storage | undefined>(undefined);

	useEffect(() => {
		const initStorage = async () => {
			const store = new Storage();
			const newStorage = await store.create();
			setStorage(newStorage);
		};
		initStorage();
	}, []);

	return (
		<SettingsProvider>
			<IonApp>
				<IonReactRouter>
					<IonRouterOutlet>
						<Route path={`${BASE_URL}`} exact={true}>
							<Home storage={storage} />
						</Route>
						<Route path={`${BASE_URL}/settings`} exact={true}>
							<SettingsPage />
						</Route>
						<Route
							path={`${BASE_URL}/settings/changelog`}
							exact={true}
						>
							<ChangeLog />
						</Route>
						<Route
							path={`${BASE_URL}/settings/installation`}
							exact={true}
						>
							<InstallationDirections />
						</Route>
					</IonRouterOutlet>
				</IonReactRouter>
			</IonApp>
		</SettingsProvider>
	);
};

export default App;
