
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import Card, { CardHeader } from '../Card';
import { Birthday } from '../../types';
import { IconCake } from '../Icons';

const birthdays: Birthday[] = [
  { name: "Ethan Maxwell's Birthday!", date: 'Today', avatar: 'https://picsum.photos/id/305/100/100' },
  { name: "Sophia Peterson's Birthday!", date: '4 Nov, 2024', avatar: 'https://picsum.photos/id/306/100/100' },
  { name: "Jackson Miller's Birthday!", date: '6 Nov, 2024', avatar: 'https://picsum.photos/id/308/100/100' },
];

const UpcomingBirthdaysCard: React.FC = () => {
    const { t, dir } = useTranslation();

    return (
        <Card>
            <CardHeader title={t('card.title.upcomingBirthdays')} />
            <ul className="space-y-4">
                {birthdays.map((birthday, index) => (
                    <li key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                            <img src={birthday.avatar} alt={birthday.name} className="w-10 h-10 rounded-full" />
                            <div className={dir === 'rtl' ? 'mr-3' : 'ml-3'}>
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{birthday.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{birthday.date}</p>
                            </div>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg">
                           <IconCake className="w-5 h-5 text-blue-500"/>
                        </div>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export default UpcomingBirthdaysCard;
