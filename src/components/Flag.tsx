import React from 'react';
import ReactCountryFlag from 'react-country-flag';
import '../App.css';

interface FlagComponentProps {
    countryCode: string;
    className?: string;
}

const Flag: React.FC<FlagComponentProps> = ({ countryCode, className }) => {
    return (
        <div>
            <ReactCountryFlag className={`flag ${className}`} countryCode={countryCode} svg />
        </div>
    );
};

export default Flag;
