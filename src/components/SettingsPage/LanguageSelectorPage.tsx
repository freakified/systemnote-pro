import React, { useState } from 'react';
import {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonPage,
    IonRadioGroup,
    IonRadio,
    IonListHeader,
} from '@ionic/react';

import { useSettings } from '../SettingsProvider/SettingsProvider';
import './SettingsPage.css';

export const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' }
];

const LanguageSelectorPage: React.FC = () => {
    const { settings, updateSettings } = useSettings();
    if (!settings) return null;

    const [selectedLanguage, setSelectedLanguage] = useState(
        settings.appLanguage || 'en'
    );

    const handleLanguageChange = (value: string) => {
        setSelectedLanguage(value);
        updateSettings({ appLanguage: value });
    };

    return (
        <IonPage>
            <IonHeader class="ion-no-border" translucent={true}>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton
                            defaultHref="/settings"
                            text="Settings"
                        ></IonBackButton>
                    </IonButtons>
                    <IonTitle>App Language</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonListHeader>Select App Language</IonListHeader>
                <IonList inset={true}>
                    <IonRadioGroup
                        value={selectedLanguage}
                        onIonChange={(e) =>
                            handleLanguageChange(e.detail.value)
                        }
                    >
                        {SUPPORTED_LANGUAGES.map(
                            (lang) => (
                                <IonRadio
                                    key={lang.code}
                                    slot="start"
                                    value={lang.code}
                                    justify="space-between"
                                    className="settingsPage-radio"
                                >
                                    <IonItem lines="full">
                                        {lang.name}
                                    </IonItem>
                                </IonRadio>
                            ),
                        )}
                    </IonRadioGroup>
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default LanguageSelectorPage;
