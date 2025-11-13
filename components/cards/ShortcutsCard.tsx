
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import Card, { CardHeader } from '../Card';
import { Shortcut, TranslationKey } from '../../types';
import { IconClock, IconUsers, IconFileText, IconPlus, IconChevronRight } from '../Icons';

const shortcuts: Shortcut[] = [
    { nameKey: 'shortcuts.timeTracking', icon: IconClock },
    { nameKey: 'shortcuts.contacts', icon: IconUsers },
    { nameKey: 'shortcuts.incomeTax', icon: IconFileText },
    { nameKey: 'shortcuts.addInfo', icon: IconPlus },
];

const ShortcutsCard: React.FC = () => {
    const { t, dir } = useTranslation();

    return (
        <Card>
            <CardHeader title={t('card.title.shortcuts')} />
            <ul className="space-y-2">
                {shortcuts.map((shortcut, index) => (
                    <li key={index}>
                        <a href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100/80 transition-colors">
                            <div className="flex items-center">
                                <div className="p-2 bg-teal-50 rounded-lg">
                                    <shortcut.icon className="w-5 h-5 text-teal-600"/>
                                </div>
                                <span className={`text-sm font-medium text-gray-700 dark:text-gray-200 ${dir === 'rtl' ? 'mr-3' : 'ml-3'}`}>{t(shortcut.nameKey as TranslationKey)}</span>
                            </div>
                            <IconChevronRight className={`w-5 h-5 text-gray-400 ${dir === 'rtl' ? 'transform -scale-x-100' : ''}`} />
                        </a>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export default ShortcutsCard;
