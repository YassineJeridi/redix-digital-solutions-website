import React from 'react';
import styles from './RecentRevenue.module.css';

const RecentRevenue = ({ projects }) => {
    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Recent Revenues</h3>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Project</th>
                            <th>Client</th>
                            <th>Category</th>
                            <th>Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects?.slice(0, 5).map((project, index) => (
                            <tr key={index} className={styles.row}>
                                <td>{project.name}</td>
                                <td>{project.client}</td>
                                <td>
                                    <span className={`${styles.badge} ${styles[project.category]}`}>
                                        {project.category}
                                    </span>
                                </td>
                                <td className={styles.revenue}>${project.revenue?.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentRevenue;
