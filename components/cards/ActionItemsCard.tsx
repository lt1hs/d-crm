
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import Card, { CardHeader } from '../Card';
import { ActionItem, TranslationKey } from '../../types';

const actionItems: ActionItem[] = [
  { titleKey: 'action.completeAccountSetup', descriptionKey: 'action.addMissingDetails', buttonTextKey: 'action.finishSetup' },
  { titleKey: 'action.submitDocs', descriptionKey: 'action.ensureOnboarding', buttonTextKey: 'action.uploadDocs' },
  { titleKey: 'action.setupDirectDeposit', descriptionKey: 'action.enterPaymentDetails', buttonTextKey: 'action.setPaymentMethod' },
  { titleKey: 'action.reviewTimeOff', descriptionKey: 'action.requestsNeedAttention', buttonTextKey: 'action.reviewRequests' },
];

const ActionItemsCard: React.FC = () => {
    const { t, dir } = useTranslation();

    return (
        <Card padding="p-0">
             <div className="p-6">
                <CardHeader title={t('card.title.thingsToDo')} />
             </div>
            <ul className="divide-y divide-gray-200">
                {actionItems.map((item, index) => (
                    <li key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 hover:bg-gray-50/50 transition-colors duration-200">
                        <div className="flex items-start">
                            <div className={`w-1 flex-shrink-0 self-stretch rounded-full bg-teal-200 ${dir === 'rtl' ? 'ml-4' : 'mr-4'}`}></div>
                            <div>
                                <h4 className="font-medium text-gray-800 dark:text-gray-100 text-sm">{t(item.titleKey as TranslationKey)}</h4>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t(item.descriptionKey as TranslationKey)}</p>
                            </div>
                        </div>
                        <div className="mt-4 sm:mt-0 w-full sm:w-auto flex justify-end">
                            <button className="text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm w-full sm:w-auto">
                                {t(item.buttonTextKey as TranslationKey)}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export default ActionItemsCard;
