import React, { useState, useEffect } from 'react';
import { MdViewModule, MdViewList } from 'react-icons/md';
import { MdAdd, MdEdit, MdDelete, MdPerson, MdEmail, MdPhone, MdLocationOn, MdBadge } from 'react-icons/md';
import ClientForm from './ClientForm';
import * as ClientsService from '../../services/ClientsServices';
import styles from './ClientsList.module.css';


const VIEW_KEY = 'clientsViewMode';

const ClientsList = () => {
    const [clients, setClients] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [viewMode, setViewMode] = useState(() => localStorage.getItem(VIEW_KEY) || 'card');
    // Persist view mode in localStorage
    useEffect(() => {
        localStorage.setItem(VIEW_KEY, viewMode);
    }, [viewMode]);
    const handleToggleView = () => {
        setViewMode((prev) => (prev === 'card' ? 'table' : 'card'));
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const data = await ClientsService.getClients();
            setClients(data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const handleAddClient = async (clientData) => {
        try {
            await ClientsService.createClient(clientData);
            fetchClients();
            setShowForm(false);
        } catch (error) {
            console.error('Error creating client:', error);
        }
    };

    const handleUpdateClient = async (clientData) => {
        try {
            await ClientsService.updateClient(editingClient._id, clientData);
            fetchClients();
            setEditingClient(null);
            setShowForm(false);
        } catch (error) {
            console.error('Error updating client:', error);
        }
    };

    const handleDeleteClient = async (clientId) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            try {
                await ClientsService.deleteClient(clientId);
                fetchClients();
            } catch (error) {
                console.error('Error deleting client:', error);
            }
        }
    };

    const handleEditClick = (client) => {
        setEditingClient(client);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingClient(null);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1></h1>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button
                        className={styles.toggleViewBtn}
                        onClick={handleToggleView}
                        title={viewMode === 'card' ? 'Switch to Table View' : 'Switch to Card View'}
                        style={{ display: 'flex', alignItems: 'center', padding: '10px', borderRadius: '8px', background: 'var(--card-bg, white)', border: '1px solid var(--border-color)', cursor: 'pointer' }}
                    >
                        {viewMode === 'card' ? <MdViewList size={22} /> : <MdViewModule size={22} />}
                    </button>
                    <button className={styles.addBtn} onClick={() => setShowForm(true)}>
                        <MdAdd /> Add Client
                    </button>
                </div>
            </div>

            {showForm && (
                <ClientForm
                    onSubmit={editingClient ? handleUpdateClient : handleAddClient}
                    onClose={handleCloseForm}
                    editData={editingClient}
                />
            )}

            {viewMode === 'card' ? (
                <div className={styles.clientsGrid}>
                    {clients.map((client) => (
                        <div key={client._id} className={styles.clientCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.profileSection}>
                                    <div className={styles.avatar}>
                                        {client.profileImage ? (
                                            <img src={client.profileImage} alt={client.ownerName} />
                                        ) : (
                                            <MdPerson />
                                        )}
                                    </div>
                                    <div className={styles.nameSection}>
                                        <h3>{client.businessName}</h3>
                                        <p className={styles.ownerName}>{client.ownerName}</p>
                                    </div>
                                </div>
                                <div className={styles.actions}>
                                    <button onClick={() => handleEditClick(client)} className={styles.editBtn}>
                                        <MdEdit />
                                    </button>
                                    <button onClick={() => handleDeleteClient(client._id)} className={styles.deleteBtn}>
                                        <MdDelete />
                                    </button>
                                </div>
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.infoItem}>
                                    <MdEmail className={styles.icon} />
                                    <span>{client.email}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <MdPhone className={styles.icon} />
                                    <span>{client.phone}</span>
                                </div>
                                {client.matriculeFiscal && (
                                    <div className={styles.infoItem}>
                                        <MdBadge className={styles.icon} />
                                        <span>{client.matriculeFiscal}</span>
                                    </div>
                                )}
                                {client.address && (
                                    <div className={styles.infoItem}>
                                        <MdLocationOn className={styles.icon} />
                                        <span>{client.address}</span>
                                    </div>
                                )}
                                {client.notes && (
                                    <div className={styles.notes}>
                                        <p>{client.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.clientsTableWrapper}>
                    <table className={styles.clientsTable}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Owner</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Matricule Fiscal</th>
                                <th>Address</th>
                                <th>Notes</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((client) => (
                                <tr key={client._id}>
                                    <td>{client.businessName}</td>
                                    <td>{client.ownerName}</td>
                                    <td>{client.email}</td>
                                    <td>{client.phone}</td>
                                    <td>{client.matriculeFiscal || '-'}</td>
                                    <td>{client.address || '-'}</td>
                                    <td style={{ maxWidth: 200, whiteSpace: 'pre-line', overflowWrap: 'break-word' }}>{client.notes || '-'}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(client)} className={styles.editBtn} title="Edit"><MdEdit /></button>
                                        <button onClick={() => handleDeleteClient(client._id)} className={styles.deleteBtn} title="Delete"><MdDelete /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ClientsList;
