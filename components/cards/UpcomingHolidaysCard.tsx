
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import Card, { CardHeader } from '../Card';
import { Holiday } from '../../types';

const holidays: Holiday[] = [
  { name: 'Independence Day', date: '4 Jul, 2024', flag: '🇺🇸' },
  { name: 'Labor Day', date: '2 Sep, 2024', flag: '🇺🇸' },
  { name: 'Veterans Day', date: '11 Nov, 2024', flag: '🇺🇸' },
];

const UpcomingHolidaysCard: React.FC = () => {
    const { t, dir } = useTranslation();
    
    return (
        <Card>
            <CardHeader title={t('card.title.upcomingHolidays')} />
            <ul className="space-y-4">
                {holidays.map((holiday, index) => (
                    <li key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex items-center justify-center w-10 h-10 text-xs font-medium text-teal-700 bg-teal-50 rounded-lg">
                                <div className='flex flex-col text-center'>
                                    <span>{holiday.date.split(' ')[0]}</span>
                                    <span className='-mt-1'>{holiday.date.split(' ')[1].replace(',', '')}</span>
                                </div>
                            </div>
                            <div className={dir === 'rtl' ? 'mr-3' : 'ml-3'}>
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{holiday.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{holiday.date}</p>
                            </div>
                        </div>
                        <span className="text-xl">{holiday.flag}</span>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export default UpcomingHolidaysCard;
