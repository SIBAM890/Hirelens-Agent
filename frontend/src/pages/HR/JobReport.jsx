import React from 'react';
import { useParams } from 'react-router-dom';

const JobReport = () => {
    const { id } = useParams();
    return (
        <div className="pt-24 p-8">
            <h1 className="text-2xl font-bold">Job Report #{id}</h1>
            <p className="text-gray-500">Candidate ranking and AI insights will appear here.</p>
        </div>
    );
};

export default JobReport;
