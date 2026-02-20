import React, { useState, useEffect, useMemo } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdFilterList, MdViewModule, MdViewList } from 'react-icons/md';
import ServiceForm from './ServiceForm';
import DeleteConfirmModal from './DeleteConfirmModal';
import * as ServicesService from '../../services/ServicesServices';
import * as ClientsService from '../../services/ClientsServices';
import styles from './ServicesList.module.css';

const VIEW_KEY = 'servicesViewMode';

const ServicesList = () => {
	const [services, setServices] = useState([]);
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState('');
	const [typeFilter, setTypeFilter] = useState('');
	const [clientFilter, setClientFilter] = useState('');
	const [clients, setClients] = useState([]);
	const [viewMode, setViewMode] = useState(() => localStorage.getItem(VIEW_KEY) || 'card');
	const [showForm, setShowForm] = useState(false);
	const [editingService, setEditingService] = useState(null);
	const [deletingService, setDeletingService] = useState(null);

	useEffect(() => {
		localStorage.setItem(VIEW_KEY, viewMode);
	}, [viewMode]);

	useEffect(() => {
		fetchClients();
	}, []);

	useEffect(() => {
		fetchServices();
	}, [statusFilter, typeFilter]);

	useEffect(() => {
		const timer = setTimeout(() => {
			fetchServices();
		}, 400);
		return () => clearTimeout(timer);
	}, [search]);

	const fetchClients = async () => {
		try {
			const data = await ClientsService.getClients();
			setClients(data);
		} catch (error) {
			console.error('Error fetching clients:', error);
		}
	};

	const fetchServices = async () => {
		setLoading(true);
		try {
			const params = {
				search,
				projectStatus: statusFilter,
				category: typeFilter,
				limit: 100
			};
			const data = await ServicesService.getServices(params);
			setServices(data.projects || []);
		} catch (error) {
			console.error('Error fetching services:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleAddService = async (serviceData) => {
		try {
			await ServicesService.createService(serviceData);
			fetchServices();
			setShowForm(false);
		} catch (error) {
			console.error('Error creating service:', error);
			alert(error.response?.data?.message || 'Error creating service');
		}
	};

	const handleUpdateService = async (serviceData) => {
		try {
			await ServicesService.updateService(editingService._id, serviceData);
			fetchServices();
			setEditingService(null);
			setShowForm(false);
		} catch (error) {
			console.error('Error updating service:', error);
			alert(error.response?.data?.message || 'Error updating service');
		}
	};

	const handleDeleteService = async (confirmName) => {
		try {
			await ServicesService.deleteService(deletingService._id, confirmName);
			fetchServices();
			setDeletingService(null);
		} catch (error) {
			console.error('Error deleting service:', error);
			throw error;
		}
	};

	// Client-side search + client filter (on top of server filter)
	const filteredServices = useMemo(() => {
		let filtered = [...services];
		if (search) {
			const q = search.toLowerCase();
			filtered = filtered.filter(s =>
				(s.projectName || '').toLowerCase().includes(q) ||
				(s.client?.businessName || '').toLowerCase().includes(q)
			);
		}
		if (clientFilter) {
			filtered = filtered.filter(s => s.client?._id === clientFilter);
		}
		return filtered;
	}, [services, search, clientFilter]);

	const getStatusBadge = (service) => {
		const status = service.projectStatus;
		if (status === 'Completed') return <span className={styles.statusDone}>Done</span>;
		if (status === 'In Progress') return <span className={styles.statusInProgress}>In Progress</span>;
		return <span className={styles.statusPending}>Pending</span>;
	};

	const getServiceTypeBadge = (type) => {
		const classMap = {
			Marketing: styles.typeMarketing,
			Development: styles.typeDevelopment,
			Production: styles.typeProduction
		};
		return <span className={`${styles.typeBadge} ${classMap[type] || ''}`}>{type}</span>;
	};

	return (
		<div className={styles.container}>
			{/* Header Section */}
			<div className={styles.headerSection}>
				<div>
					<h1 className={styles.pageTitle}>Services Management</h1>
					<p className={styles.pageSubtitle}>Track and manage all client services in one place.</p>
				</div>
				<div className={styles.headerActions}>
					<button
						className={`${styles.viewToggleBtn} ${viewMode === 'card' ? styles.viewToggleActive : ''}`}
						onClick={() => setViewMode('card')}
						title="Card View"
					>
						<MdViewModule />
					</button>
					<button
						className={`${styles.viewToggleBtn} ${viewMode === 'table' ? styles.viewToggleActive : ''}`}
						onClick={() => setViewMode('table')}
						title="Table View"
					>
						<MdViewList />
					</button>
					<button className={styles.addBtn} onClick={() => { setEditingService(null); setShowForm(true); }}>
						<MdAdd /> Add New Service
					</button>
				</div>
			</div>

			{/* Filter Bar */}
			<div className={styles.filterBar}>
				<div className={styles.searchGroup}>
					<MdSearch className={styles.searchIcon} />
					<input
						type="text"
						placeholder="Search by service or client name..."
						value={search}
						onChange={e => setSearch(e.target.value)}
						className={styles.searchInput}
					/>
				</div>
				<div className={styles.filterGroup}>
					<MdFilterList className={styles.filterIcon} />
					<label>Status:</label>
					<select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
						<option value="">All</option>
						<option value="Not Started">Pending</option>
						<option value="In Progress">In Progress</option>
						<option value="Completed">Done</option>
					</select>
				</div>
				<div className={styles.filterGroup}>
					<label>Type:</label>
					<select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
						<option value="">All</option>
						<option value="Marketing">Marketing</option>
						<option value="Development">Development</option>
						<option value="Production">Production</option>
					</select>
				</div>
				<div className={styles.filterGroup}>
					<label>Client:</label>
					<select value={clientFilter} onChange={e => setClientFilter(e.target.value)}>
						<option value="">All Clients</option>
						{clients.map(c => (
							<option key={c._id} value={c._id}>{c.businessName}</option>
						))}
					</select>
				</div>
			</div>

			{/* Card Grid View */}
			{viewMode === 'card' ? (
			<div className={styles.grid}>
				{loading ? (
					<div className={styles.loading}>Loading services...</div>
				) : filteredServices.length === 0 ? (
					<div className={styles.noData}>No services found.</div>
				) : (
					filteredServices.map((service, idx) => (
						<div key={service._id} className={styles.card} style={{ animationDelay: `${idx * 60}ms` }}>
							<div className={styles.cardHeader}>
								<div className={styles.cardTitleRow}>
									<div className={styles.serviceName}>{service.projectName}</div>
									{getStatusBadge(service)}
								</div>
								{service.serviceProvided && getServiceTypeBadge(service.serviceProvided)}
							</div>
							<div className={styles.cardBody}>
								<div className={styles.infoRow}>
									<span className={styles.infoLabel}>Client</span>
									<span className={styles.infoValue}>{service.client?.businessName || 'N/A'}</span>
								</div>
								<div className={styles.infoRow}>
									<span className={styles.infoLabel}>Start</span>
									<span className={styles.infoValue}>
										{service.startDate ? new Date(service.startDate).toLocaleDateString() : '-'}
									</span>
								</div>
								<div className={styles.infoRow}>
									<span className={styles.infoLabel}>End</span>
									<span className={styles.infoValue}>
										{service.endDate ? new Date(service.endDate).toLocaleDateString() : '-'}
									</span>
								</div>
								<div className={styles.infoRow}>
									<span className={styles.infoLabel}>Total Price</span>
									<span className={styles.priceValue}>
										{service.totalPrice?.toLocaleString()} TND
									</span>
								</div>
							</div>
							<div className={styles.cardActions}>
								<button
									className={styles.editBtn}
									onClick={() => { setEditingService(service); setShowForm(true); }}
									title="Edit"
								>
									<MdEdit /> Edit
								</button>
								<button
									className={styles.deleteBtn}
									onClick={() => setDeletingService(service)}
									title="Delete"
								>
									<MdDelete /> Delete
								</button>
							</div>
						</div>
					))
				)}
			</div>
			) : (
			/* Table View */
			<div className={styles.tableWrapper}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th>Service Name</th>
							<th>Client</th>
							<th>Type</th>
							<th>Status</th>
							<th>Start</th>
							<th>End</th>
							<th>Price</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr><td colSpan="8" className={styles.loading}>Loading services...</td></tr>
						) : filteredServices.length === 0 ? (
							<tr><td colSpan="8" className={styles.noData}>No services found.</td></tr>
						) : (
							filteredServices.map(service => (
								<tr key={service._id}>
									<td className={styles.tableServiceName}>{service.projectName}</td>
									<td>{service.client?.businessName || 'N/A'}</td>
									<td>{service.serviceProvided && getServiceTypeBadge(service.serviceProvided)}</td>
									<td>{getStatusBadge(service)}</td>
									<td>{service.startDate ? new Date(service.startDate).toLocaleDateString() : '-'}</td>
									<td>{service.endDate ? new Date(service.endDate).toLocaleDateString() : '-'}</td>
									<td className={styles.priceValue}>{service.totalPrice?.toLocaleString()} TND</td>
									<td>
										<div className={styles.tableActions}>
											<button className={styles.editBtn} onClick={() => { setEditingService(service); setShowForm(true); }} title="Edit"><MdEdit /></button>
											<button className={styles.deleteBtn} onClick={() => setDeletingService(service)} title="Delete"><MdDelete /></button>
										</div>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
			)}

			{/* Modals */}
			{showForm && (
				<ServiceForm
					onSubmit={editingService ? handleUpdateService : handleAddService}
					onClose={() => { setShowForm(false); setEditingService(null); }}
					editData={editingService}
				/>
			)}

			{deletingService && (
				<DeleteConfirmModal
					service={deletingService}
					onConfirm={handleDeleteService}
					onCancel={() => setDeletingService(null)}
				/>
			)}
		</div>
	);
};

export default ServicesList;