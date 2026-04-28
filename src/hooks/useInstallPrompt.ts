import { useEffect, useState } from 'react';

let _deferredPrompt: BeforeInstallPromptEvent | null = null;

window.addEventListener('beforeinstallprompt', (e) => {
	e.preventDefault();
	_deferredPrompt = e as BeforeInstallPromptEvent;
});

export function useInstallPrompt() {
	const [promptAvailable, setPromptAvailable] = useState(!!_deferredPrompt);

	useEffect(() => {
		const handler = (e: Event) => {
			e.preventDefault();
			_deferredPrompt = e as BeforeInstallPromptEvent;
			setPromptAvailable(true);
		};
		window.addEventListener('beforeinstallprompt', handler);
		return () => window.removeEventListener('beforeinstallprompt', handler);
	}, []);

	const triggerInstall = async () => {
		if (!_deferredPrompt) return;
		_deferredPrompt.prompt();
		const { outcome } = await _deferredPrompt.userChoice;
		if (outcome === 'accepted') {
			_deferredPrompt = null;
			setPromptAvailable(false);
		}
	};

	return { promptAvailable, triggerInstall };
}
