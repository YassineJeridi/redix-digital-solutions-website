import React, { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdPerson, MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import ClientForm from './ClientForm';
import * as ClientsService from '../../services/ClientsServices';
import styles from './ClientsList.module.css';

const ClientsList = () => {
    const [clients, setClients] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingClient, setEditingClient] = useState(null);

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
                <button className={styles.addBtn} onClick={() => setShowForm(true)}>
                    <MdAdd /> Add Client
                </button>
            </div>

            {showForm && (
                <ClientForm
                    onSubmit={editingClient ? handleUpdateClient : handleAddClient}
                    onClose={handleCloseForm}
                    editData={editingClient}
                />
            )}

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
        </div>
    );
};

export default ClientsList;
