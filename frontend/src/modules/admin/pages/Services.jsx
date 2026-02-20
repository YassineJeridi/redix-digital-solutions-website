import React from 'react';
import ServicesList from '../components/Services/ServicesList';
import styles from './Services.module.css';

const Services = () => {
    return (
        <div className={styles.page}>
            <ServicesList />
        </div>
    );
};

export default Services;
