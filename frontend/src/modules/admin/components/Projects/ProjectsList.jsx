import React, { useState, useEffect, useMemo } from 'react';
import { 
    MdAdd, MdEdit, MdDelete, MdSearch, MdFileDownload, 
    MdFilterList, MdSort, MdChevronLeft, MdChevronRight, MdPayment 
} from 'react-icons/md';
import ProjectForm from './ProjectForm';
import DeleteConfirmModal from './DeleteConfirmModal';
import * as ProjectsService from '../../services/ProjectsServices';
import styles from './ProjectsList.module.css';

const ProjectsList = () => {
    const [projects, setProjects] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
    const [loading, setLoading] = useState(false);
    
    // Filters and search
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [projectStatus, setProjectStatus] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    // Client filter
    const [clientFilter, setClientFilter] = useState('');
    
    // UI state
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [deletingProject, setDeletingProject] = useState(null);
    const [userRole, setUserRole] = useState('Admin'); // TODO: Get from context/auth

    useEffect(() => {
        fetchProjects();
    }, [pagination.page, category, paymentStatus, projectStatus, sortBy, sortOrder]);

    // Debounce search and client filter
    useEffect(() => {
        const timer = setTimeout(() => {
            if (pagination.page === 1) {
                fetchProjects();
            } else {
                setPagination(prev => ({ ...prev, page: 1 }));
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search, clientFilter]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                search,
                category,
                paymentStatus,
                projectStatus,
                sortBy,
                sortOrder
            };
            const data = await ProjectsService.getProjects(params);
            setProjects(data.projects);
            setPagination(data.pagination);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProject = async (projectData) => {
        try {
            await ProjectsService.createProject(projectData);
            fetchProjects();
            setShowForm(false);
        } catch (error) {
            console.error('Error creating project:', error);
            alert(error.response?.data?.message || 'Error creating project');
        }
    };

    const handleUpdateProject = async (projectData) => {
        try {
            await ProjectsService.updateProject(editingProject._id, projectData);
            fetchProjects();
            setEditingProject(null);
            setShowForm(false);
        } catch (error) {
            console.error('Error updating project:', error);
            alert(error.response?.data?.message || 'Error updating project');
        }
    };

    const handleDelete = async (confirmName) => {
        try {
            await ProjectsService.deleteProject(deletingProject._id, confirmName);
            fetchProjects();
            setDeletingProject(null);
        } catch (error) {
            console.error('Error deleting project:', error);
            throw error;
        }
    };

    const handleEditClick = (project) => {
        setEditingProject(project);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingProject(null);
    };

    const handleExportCSV = async () => {
        try {
            await ProjectsService.exportToCSV({ category, paymentStatus, projectStatus });
        } catch (error) {
            console.error('Error exporting CSV:', error);
        }
    };

    const handleExportPDF = async () => {
        try {
            await ProjectsService.exportToPDF({ category, paymentStatus, projectStatus });
        } catch (error) {
            console.error('Error exporting PDF:', error);
        }
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const getPaymentStatusClass = (status) => {
        switch (status) {
            case 'Done': return styles.statusDone;
            case 'Partial': return styles.statusPartial;
            default: return styles.statusPending;
        }
    };

    const getProjectStatusClass = (status) => {
        switch (status) {
            case 'Completed': return styles.statusCompleted;
            case 'In Progress': return styles.statusInProgress;
            case 'Not Started': return styles.statusNotStarted;
            default: return '';
        }
    };

    const canDelete = userRole === 'Admin';
    const canCreateEdit = ['Admin', 'Manager'].includes(userRole);

    const [partialPaymentProject, setPartialPaymentProject] = useState(null);
    const [partialPaymentAmount, setPartialPaymentAmount] = useState('');

    const handleInlinePaymentStatus = async (e, project) => {
        e.stopPropagation();
        const newStatus = e.target.value;
        if (newStatus === project.paymentStatus) return;
        try {
            await ProjectsService.updateProjectStatus(project._id, { paymentStatus: newStatus });
            fetchProjects();
        } catch (error) {
            console.error('Error updating payment status:', error);
        }
    };

    const handleInlineProjectStatus = async (e, project) => {
        e.stopPropagation();
        const newStatus = e.target.value;
        if (newStatus === project.projectStatus) return;
        try {
            await ProjectsService.updateProjectStatus(project._id, { projectStatus: newStatus });
            fetchProjects();
        } catch (error) {
            console.error('Error updating project status:', error);
        }
    };

    const handlePartialPayment = async () => {
        if (!partialPaymentProject || !partialPaymentAmount || parseFloat(partialPaymentAmount) <= 0) return;
        try {
            await ProjectsService.recordPartialPayment(partialPaymentProject._id, parseFloat(partialPaymentAmount));
            fetchProjects();
            setPartialPaymentProject(null);
            setPartialPaymentAmount('');
        } catch (error) {
            console.error('Error recording partial payment:', error);
        }
    };

    // Get unique client names for dropdown
    const clientOptions = useMemo(() => {
        const names = new Set();
        projects.forEach(p => {
            if (p.client && p.client.businessName) names.add(p.client.businessName);
        });
        return Array.from(names).sort();
    }, [projects]);

    // Filter and sort projects by client name in-memory (for UI only)
    const filteredProjects = useMemo(() => {
        let filtered = [...projects];
        if (clientFilter) {
            filtered = filtered.filter(p => p.client?.businessName === clientFilter);
        }
        return filtered;
    }, [projects, clientFilter]);

    return (
        <div className={styles.container}>
            {/* Header with Actions */}
            <div className={styles.header}>
                <div className={styles.searchBar}>
                    <MdSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search by project name or client..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                <div className={styles.headerActions}>
                    <select
                        className={styles.clientFilterDropdown}
                        value={clientFilter}
                        onChange={e => setClientFilter(e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '15px', marginRight: '8px' }}
                    >
                        <option value="">All Clients</option>
                        {clientOptions.map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                    <button className={styles.exportBtn} onClick={handleExportCSV} title="Export CSV">
                        <MdFileDownload /> CSV
                    </button>
                    <button className={styles.exportBtn} onClick={handleExportPDF} title="Export PDF">
                        <MdFileDownload /> PDF
                    </button>
                    {canCreateEdit && (
                        <button className={styles.addBtn} onClick={() => setShowForm(true)}>
                            <MdAdd /> Add Project
                        </button>
                    )}
                </div>
            </div>

            {/* Category Filter Tabs */}
            <div className={styles.categoryTabs}>
                <button 
                    className={`${styles.tab} ${category === '' ? styles.activeTab : ''}`}
                    onClick={() => setCategory('')}
                >
                    All Projects
                </button>
                <button 
                    className={`${styles.tab} ${category === 'Marketing' ? styles.activeTab : ''}`}
                    onClick={() => setCategory('Marketing')}
                >
                    Marketing
                </button>
                <button 
                    className={`${styles.tab} ${category === 'Production' ? styles.activeTab : ''}`}
                    onClick={() => setCategory('Production')}
                >
                    Production
                </button>
                <button 
                    className={`${styles.tab} ${category === 'Development' ? styles.activeTab : ''}`}
                    onClick={() => setCategory('Development')}
                >
                    Development
                </button>
            </div>

            {/* Additional Filters */}
            <div className={styles.filters}>
                <div className={styles.filterGroup}>
                    <label><MdFilterList /> Payment Status:</label>
                    <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                        <option value="">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Partial">Partial</option>
                        <option value="Done">Done</option>
                    </select>
                </div>
                <div className={styles.filterGroup}>
                    <label><MdFilterList /> Project Status:</label>
                    <select value={projectStatus} onChange={(e) => setProjectStatus(e.target.value)}>
                        <option value="">All</option>
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>

            {/* Projects Table */}
            {loading ? (
                <div className={styles.loading}>Loading projects...</div>
            ) : (
                <>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('projectName')}>
                                        Project Name {sortBy === 'projectName' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th onClick={() => handleSort('client')}>
                                        Client {sortBy === 'client' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th onClick={() => handleSort('startDate')}>
                                        Start Date {sortBy === 'startDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th onClick={() => handleSort('endDate')}>
                                        End Date {sortBy === 'endDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th onClick={() => handleSort('paymentStatus')}>
                                        Payment Status {sortBy === 'paymentStatus' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th onClick={() => handleSort('projectStatus')}>
                                        Project Status {sortBy === 'projectStatus' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th onClick={() => handleSort('totalPrice')}>
                                        Total Price {sortBy === 'totalPrice' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProjects.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className={styles.noData}>No projects found</td>
                                    </tr>
                                ) : (
                                    filteredProjects.map((project) => (
                                        <tr key={project._id} onClick={() => handleEditClick(project)} className={styles.clickableRow}>
                                            <td className={styles.projectName}>{project.projectName}</td>
                                            <td>{project.client?.businessName || 'N/A'}</td>
                                            <td>{new Date(project.startDate).toLocaleDateString()}</td>
                                            <td>{new Date(project.endDate).toLocaleDateString()}</td>
                                            <td onClick={(e) => e.stopPropagation()}>
                                                <select
                                                    className={`${styles.inlineSelect} ${getPaymentStatusClass(project.paymentStatus)}`}
                                                    value={project.paymentStatus}
                                                    onChange={(e) => handleInlinePaymentStatus(e, project)}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Partial">Partial</option>
                                                    <option value="Done">Done</option>
                                                </select>
                                                {project.amountPaid > 0 && project.paymentStatus !== 'Done' && (
                                                    <div className={styles.paidInfo}>{project.amountPaid}/{project.totalPrice} TND</div>
                                                )}
                                            </td>
                                            <td onClick={(e) => e.stopPropagation()}>
                                                <select
                                                    className={`${styles.inlineSelect} ${getProjectStatusClass(project.projectStatus)}`}
                                                    value={project.projectStatus}
                                                    onChange={(e) => handleInlineProjectStatus(e, project)}
                                                >
                                                    <option value="Not Started">Not Started</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Completed">Completed</option>
                                                </select>
                                            </td>
                                            <td className={styles.price}>{project.totalPrice.toLocaleString()} TND</td>
                                            <td className={styles.actions} onClick={(e) => e.stopPropagation()}>
                                                {canCreateEdit && (
                                                    <button 
                                                        onClick={() => { setPartialPaymentProject(project); setPartialPaymentAmount(''); }} 
                                                        className={styles.paymentBtn}
                                                        title="Record Payment"
                                                    >
                                                        <MdPayment />
                                                    </button>
                                                )}
                                                {canCreateEdit && (
                                                    <button 
                                                        onClick={() => handleEditClick(project)} 
                                                        className={styles.editBtn}
                                                        title="Edit"
                                                    >
                                                        <MdEdit />
                                                    </button>
                                                )}
                                                {canDelete && (
                                                    <button 
                                                        onClick={() => setDeletingProject(project)} 
                                                        className={styles.deleteBtn}
                                                        title="Delete"
                                                    >
                                                        <MdDelete />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className={styles.pagination}>
                            <button 
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                disabled={pagination.page === 1}
                                className={styles.pageBtn}
                            >
                                <MdChevronLeft /> Previous
                            </button>
                            <span className={styles.pageInfo}>
                                Page {pagination.page} of {pagination.pages} ({pagination.total} total)
                            </span>
                            <button 
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                disabled={pagination.page === pagination.pages}
                                className={styles.pageBtn}
                            >
                                Next <MdChevronRight />
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Modals */}
            {showForm && (
                <ProjectForm
                    onSubmit={editingProject ? handleUpdateProject : handleAddProject}
                    onClose={handleCloseForm}
                    editData={editingProject}
                    userRole={userRole}
                />
            )}

            {deletingProject && (
                <DeleteConfirmModal
                    project={deletingProject}
                    onConfirm={handleDelete}
                    onCancel={() => setDeletingProject(null)}
                />
            )}

            {partialPaymentProject && (
                <div className={styles.partialOverlay} onClick={() => setPartialPaymentProject(null)}>
                    <div className={styles.partialModal} onClick={(e) => e.stopPropagation()}>
                        <h3>Record Payment</h3>
                        <p className={styles.partialInfo}>
                            <strong>{partialPaymentProject.projectName}</strong><br/>
                            Total: {partialPaymentProject.totalPrice} TND | 
                            Paid: {partialPaymentProject.amountPaid || 0} TND | 
                            Remaining: {(partialPaymentProject.totalPrice - (partialPaymentProject.amountPaid || 0)).toFixed(2)} TND
                        </p>
                        <input
                            type="number"
                            placeholder="Payment amount (TND)"
                            value={partialPaymentAmount}
                            onChange={(e) => setPartialPaymentAmount(e.target.value)}
                            min="0"
                            max={partialPaymentProject.totalPrice - (partialPaymentProject.amountPaid || 0)}
                            step="0.01"
                            className={styles.partialInput}
                            autoFocus
                        />
                        <div className={styles.partialActions}>
                            <button className={styles.cancelBtn} onClick={() => setPartialPaymentProject(null)}>Cancel</button>
                            <button className={styles.confirmPayBtn} onClick={handlePartialPayment} disabled={!partialPaymentAmount || parseFloat(partialPaymentAmount) <= 0}>
                                <MdPayment /> Confirm Payment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsList;
