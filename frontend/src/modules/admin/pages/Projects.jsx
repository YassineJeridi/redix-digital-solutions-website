import React from 'react';
import ProjectsList from '../components/Projects/ProjectsList';
import styles from './Projects.module.css';

const Projects = () => {
    return (
        <div className={styles.page}>
            <h1 className={styles.pageTitle}>Projects Management</h1>
            <ProjectsList />
        </div>
    );
};

export default Projects;
